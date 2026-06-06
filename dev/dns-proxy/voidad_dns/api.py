from __future__ import annotations

from pathlib import Path

from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import FileResponse, HTMLResponse
from pydantic import BaseModel, Field

from voidad_dns.blocklist import Blocklist, is_valid_domain, normalize_domain
from voidad_dns.blocklist_fetcher import fetch_and_save, read_meta
from voidad_dns.blocklist_refresh import BlocklistRefreshWorker
from voidad_dns.config import settings
from voidad_dns.dns_server import DNSService
from voidad_dns.filter_engine import FilterEngine
from voidad_dns.page_reports import PageReportStore
from voidad_dns.streaming_rules import all_rules, rules_for_host
from voidad_dns.stats_flush import StatsFlushWorker
from voidad_dns.stats_reporter import StatsReporter
from voidad_dns.tenant_registry import TenantRegistry
from voidad_dns.tenant_sync import TenantSyncWorker

STATIC_DIR = Path(__file__).resolve().parent / "static"


class DomainPayload(BaseModel):
    domain: str = Field(..., min_length=1, max_length=253)


class ExtensionReportPayload(BaseModel):
    page_host: str = Field(..., min_length=1, max_length=253)
    page_url: str | None = Field(default=None, max_length=2048)
    ad_domains: list[str] = Field(default_factory=list, max_length=50)


def create_app(
    blocklist: Blocklist | None = None,
    request_log: RequestLog | None = None,
    dns_service: DNSService | None = None,
    tenant_registry: TenantRegistry | None = None,
    tenant_sync: TenantSyncWorker | None = None,
    stats_reporter: StatsReporter | None = None,
    stats_flush: StatsFlushWorker | None = None,
    blocklist_refresh: BlocklistRefreshWorker | None = None,
) -> FastAPI:
    """Build the FastAPI application with shared DNS state."""
    blocklist = blocklist or Blocklist()
    request_log = request_log or RequestLog()
    filter_engine = FilterEngine(blocklist)
    tenant_registry = tenant_registry or TenantRegistry()
    tenant_sync = tenant_sync or TenantSyncWorker(tenant_registry)
    stats_reporter = stats_reporter or StatsReporter()
    stats_flush = stats_flush or StatsFlushWorker(stats_reporter)
    blocklist_refresh = blocklist_refresh or BlocklistRefreshWorker(blocklist)
    page_reports = PageReportStore(blocklist)
    dns_service = dns_service or DNSService(
        filter_engine, request_log, tenant_registry, stats_reporter
    )

    app = FastAPI(
        title="VoidAd DNS Proxy",
        description="Network DNS filter for VoidAd — router-level control",
        version="0.3.0",
    )
    app.state.blocklist = blocklist
    app.state.filter_engine = filter_engine
    app.state.request_log = request_log
    app.state.dns_service = dns_service
    app.state.tenant_registry = tenant_registry
    app.state.tenant_sync = tenant_sync
    app.state.stats_reporter = stats_reporter
    app.state.stats_flush = stats_flush
    app.state.blocklist_refresh = blocklist_refresh
    app.state.page_reports = page_reports

    @app.on_event("startup")
    def startup() -> None:
        app.state.tenant_sync.start()
        app.state.stats_flush.start()
        app.state.blocklist_refresh.start()
        app.state.dns_service.start()

    @app.on_event("shutdown")
    def shutdown() -> None:
        app.state.blocklist_refresh.stop()
        app.state.stats_flush.stop()
        app.state.tenant_sync.stop()
        app.state.dns_service.stop()

    @app.get("/", response_class=HTMLResponse)
    def dashboard() -> FileResponse:
        return FileResponse(STATIC_DIR / "index.html")

    @app.get("/api/health")
    def health() -> dict:
        return {
            "status": "ok",
            "dns": app.state.dns_service.address,
            "upstream": settings.upstream_dns,
        }

    @app.get("/api/stats")
    def stats() -> dict:
        tenants = app.state.tenant_registry.list_tenants()
        return {
            "dns": app.state.dns_service.address,
            "upstream": settings.upstream_dns,
            "blocklist_count": app.state.blocklist.count(),
            "blocklist_meta": read_meta(),
            "pattern_blocking": settings.pattern_blocking_enabled,
            "learned_blocks_count": app.state.filter_engine.learned_log.count(),
            "tenant_count": len(tenants),
            "registered_ips": sum(len(t.home_ips) for t in tenants),
            "requests": app.state.request_log.stats(),
        }

    @app.post("/api/sync/tenants")
    def sync_tenants() -> dict:
        ok = app.state.tenant_registry.refresh_from_api()
        return {"ok": ok, "tenants": len(app.state.tenant_registry.list_tenants())}

    @app.get("/api/blocklist")
    def get_blocklist(limit: int = Query(default=100, ge=1, le=500)) -> dict:
        domains = app.state.blocklist.list_domains()
        return {
            "count": len(domains),
            "domains": domains[:limit],
            "truncated": len(domains) > limit,
        }

    @app.post("/api/blocklist", status_code=201)
    def add_domain(payload: DomainPayload) -> dict:
        try:
            domain = app.state.blocklist.add(payload.domain)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc
        return {"domain": domain, "count": app.state.blocklist.count()}

    @app.delete("/api/blocklist/{domain:path}")
    def remove_domain(domain: str) -> dict:
        normalized = normalize_domain(domain)
        if not is_valid_domain(normalized):
            raise HTTPException(status_code=400, detail="Invalid domain")
        removed = app.state.blocklist.remove(normalized)
        if not removed:
            raise HTTPException(status_code=404, detail="Domain not in blocklist")
        return {"removed": normalized, "count": app.state.blocklist.count()}

    @app.post("/api/blocklist/reload")
    def reload_blocklist() -> dict:
        count = app.state.blocklist.reload()
        return {"reloaded": True, "count": count}

    @app.post("/api/blocklist/fetch")
    def fetch_blocklist() -> dict:
        count, source = fetch_and_save(force=True)
        reloaded = app.state.blocklist.reload()
        return {
            "fetched": True,
            "count": reloaded or count,
            "source": source,
        }

    @app.get("/api/learned")
    def get_learned(limit: int = Query(default=100, ge=1, le=500)) -> dict:
        entries = app.state.filter_engine.learned_log.recent(limit)
        return {
            "count": app.state.filter_engine.learned_log.count(),
            "entries": entries,
        }

    @app.post("/api/learned/{domain:path}/promote", status_code=201)
    def promote_learned(domain: str) -> dict:
        normalized = normalize_domain(domain)
        if not is_valid_domain(normalized):
            raise HTTPException(status_code=400, detail="Invalid domain")
        try:
            added = app.state.filter_engine.promote_learned(normalized)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc
        return {"promoted": added, "blocklist_count": app.state.blocklist.count()}

    @app.delete("/api/learned")
    def clear_learned() -> dict:
        app.state.filter_engine.learned_log.clear()
        return {"cleared": True}

    @app.get("/api/logs")
    def get_logs(limit: int = Query(default=100, ge=1, le=500)) -> dict:
        return {"entries": app.state.request_log.recent(limit)}

    @app.delete("/api/logs")
    def clear_logs() -> dict:
        app.state.request_log.clear()
        return {"cleared": True}

    # --- Browser extension bridge (Dual-Layer: Layer 2 → Layer 1) ---

    @app.get("/api/extension/streaming-rules")
    def extension_streaming_rules(host: str = Query(default="", max_length=253)) -> dict:
        """CSS selectors for first-party ad elements the DNS layer cannot block."""
        if host.strip():
            return {
                "hostname": host,
                "selectors": rules_for_host(host),
            }
        return {"rules": all_rules()}

    @app.post("/api/extension/report")
    def extension_report_page(payload: ExtensionReportPayload) -> dict:
        """
        Extension reports ad domains seen on a streaming page.
        New domains are appended to the supplemental blocklist for network-wide blocking.
        """
        return app.state.page_reports.record(
            page_host=payload.page_host.strip().lower(),
            ad_domains=payload.ad_domains,
            page_url=payload.page_url,
        )

    @app.get("/api/extension/reports")
    def extension_recent_reports(
        limit: int = Query(default=50, ge=1, le=200),
    ) -> dict:
        return {"entries": app.state.page_reports.recent(limit)}

    return app
