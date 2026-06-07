from __future__ import annotations

import logging

from dnslib import A, AAAA, DNSRecord, QTYPE, RR, RCODE

from voidad_dns.blocklist import normalize_domain
from voidad_dns.client_filter import ClientFilter
from voidad_dns.config import settings
from voidad_dns.domain_classifier import classify_domain
from voidad_dns.family_filter import (
    FamilyFilterSettings,
    check_family_filters,
    family_category_to_block_type,
)
from voidad_dns.filter_engine import FilterEngine
from voidad_dns.never_block import is_never_block
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
        client_filter: ClientFilter | None = None,
    ) -> None:
        self._filter = filter_engine
        self._request_log = request_log
        self._upstream = upstream or UpstreamResolver()
        self._tenant_registry = tenant_registry
        self._stats_reporter = stats_reporter
        self._client_filter = client_filter or ClientFilter()

    def resolve(self, request: DNSRecord, client: str) -> DNSRecord:
        qname = normalize_domain(str(request.q.qname))
        qtype_name = QTYPE.get(request.q.qtype, str(request.q.qtype))

        if not self._client_filter.allows(client):
            self._request_log.add(
                RequestLogEntry.now(
                    domain=qname,
                    qtype=qtype_name,
                    action="rejected",
                    client=client,
                    detail="client_not_allowed",
                )
            )
            reply = request.reply()
            reply.header.rcode = RCODE.REFUSED
            return reply

        match, block_type = self._evaluate(qname, client)
        if match.blocked:
            tenant = (
                self._tenant_registry.get_by_ip(client)
                if self._tenant_registry
                else None
            )
            if block_type is None:
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

    def _evaluate(self, domain: str, client: str) -> tuple[FilterMatch, str | None]:
        if is_never_block(domain):
            return FilterMatch(blocked=False), None
        # Maximum mode: aggressive rotators + gambling + long-domain heuristics
        max_mode = settings.max_mode
        aggressive = True
        tenant = (
            self._tenant_registry.get_by_ip(client) if self._tenant_registry else None
        )
        if tenant and not self._tenant_registry.should_filter(client):
            return FilterMatch(blocked=False), None
        if tenant:
            settings_obj = tenant.settings
            if settings_obj.enhanced_ad_blocking:
                max_mode = True
            family = check_family_filters(
                domain,
                FamilyFilterSettings(
                    block_tiktok=settings_obj.block_tiktok,
                    block_social_media=settings_obj.block_social_media,
                    block_adult_content=settings_obj.block_adult_content,
                    block_gambling=settings_obj.block_gambling,
                    safe_search=settings_obj.safe_search,
                    blocked_keywords=settings_obj.blocked_keywords,
                ),
            )
            if family.blocked:
                return (
                    family.to_filter_match(),
                    family_category_to_block_type(family.category),
                )
            block_type = classify_domain(domain)
            if block_type == "ad" and not settings_obj.anti_adware:
                return FilterMatch(blocked=False), None
            if block_type == "tracker" and not settings_obj.anti_tracker:
                return FilterMatch(blocked=False), None
            if block_type == "phishing" and not settings_obj.anti_phishing:
                return FilterMatch(blocked=False), None
        return (
            self._filter.check(
                domain,
                client=client,
                aggressive=aggressive,
                max_mode=max_mode,
            ),
            None,
        )

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
