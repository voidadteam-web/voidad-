from __future__ import annotations

import logging

from dnslib import A, AAAA, DNSRecord, QTYPE, RR, RCODE

from voidad_dns.blocklist import normalize_domain
from voidad_dns.config import settings
from voidad_dns.domain_classifier import classify_domain
from voidad_dns.filter_engine import FilterEngine
from voidad_dns.pattern_filter import BlockReason, FilterMatch
from voidad_dns.request_log import RequestLog, RequestLogEntry
from voidad_dns.resolver import UpstreamResolver
from voidad_dns.stats_reporter import BlockEvent, StatsReporter
from voidad_dns.tenant_registry import TenantRegistry

logger = logging.getLogger(__name__)


class VoidAdDNSHandler:
    """Resolve DNS queries: block listed/pattern domains or forward to upstream."""

    def __init__(
        self,
        filter_engine: FilterEngine,
        request_log: RequestLog,
        upstream: UpstreamResolver | None = None,
        tenant_registry: TenantRegistry | None = None,
        stats_reporter: StatsReporter | None = None,
    ) -> None:
        self._filter = filter_engine
        self._request_log = request_log
        self._upstream = upstream or UpstreamResolver()
        self._tenant_registry = tenant_registry
        self._stats_reporter = stats_reporter

    def resolve(self, request: DNSRecord, client: str) -> DNSRecord:
        qname = normalize_domain(str(request.q.qname))
        qtype_name = QTYPE.get(request.q.qtype, str(request.q.qtype))

        match = self._evaluate(qname, client)
        if match.blocked:
            tenant = (
                self._tenant_registry.get_by_ip(client)
                if self._tenant_registry
                else None
            )
            block_type = classify_domain(qname)
            reason_tag = match.reason.value if match.reason else "unknown"
            self._request_log.add(
                RequestLogEntry.now(
                    domain=qname,
                    qtype=qtype_name,
                    action="blocked",
                    client=client,
                    detail=f"{block_type}:{reason_tag}:{match.detail}:{tenant.user_id if tenant else 'global'}",
                )
            )
            if self._stats_reporter and tenant:
                self._stats_reporter.enqueue(
                    BlockEvent(
                        user_id=tenant.user_id,
                        domain=qname,
                        block_type=block_type,
                        client_ip=client,
                    )
                )
            return self._blocked_response(request)

        try:
            response_data = self._upstream.forward(request.pack())
            self._request_log.add(
                RequestLogEntry.now(
                    domain=qname,
                    qtype=qtype_name,
                    action="forwarded",
                    client=client,
                )
            )
            return DNSRecord.parse(response_data)
        except Exception as exc:
            self._request_log.add(
                RequestLogEntry.now(
                    domain=qname,
                    qtype=qtype_name,
                    action="error",
                    client=client,
                    detail=str(exc),
                )
            )
            raise

    def _evaluate(self, domain: str, client: str) -> FilterMatch:
        # Maximum mode: always use aggressive rotator + long-domain heuristics
        aggressive = True
        if self._tenant_registry:
            tenant = self._tenant_registry.get_by_ip(client)
            if tenant and not self._tenant_registry.should_filter(client):
                return FilterMatch(blocked=False)
            if tenant:
                settings_obj = tenant.settings
                block_type = classify_domain(domain)
                if block_type == "ad" and not settings_obj.anti_adware:
                    return FilterMatch(blocked=False)
                if block_type == "tracker" and not settings_obj.anti_tracker:
                    return FilterMatch(blocked=False)
                if block_type == "phishing" and not settings_obj.anti_phishing:
                    return FilterMatch(blocked=False)
        return self._filter.check(domain, client=client, aggressive=aggressive)

    def _blocked_response(self, request: DNSRecord) -> DNSRecord:
        reply = request.reply()
        if request.q.qtype == QTYPE.AAAA:
            reply.add_answer(
                RR(
                    request.q.qname,
                    QTYPE.AAAA,
                    rdata=AAAA("::"),
                    ttl=settings.block_ttl,
                )
            )
            return reply
        if request.q.qtype == QTYPE.A:
            reply.add_answer(
                RR(
                    request.q.qname,
                    QTYPE.A,
                    rdata=A("0.0.0.0"),
                    ttl=settings.block_ttl,
                )
            )
            return reply
        reply.header.rcode = RCODE.NXDOMAIN
        return reply
