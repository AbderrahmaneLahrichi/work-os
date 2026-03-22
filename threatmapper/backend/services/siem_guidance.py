import os
import json
import asyncio
from pathlib import Path
from anthropic import AsyncAnthropic

MODEL = "claude-sonnet-4-6"

CACHE_FILE = Path(__file__).parent.parent / "data" / "siem_cache.json"
_cache: dict = {}
_cache_lock = asyncio.Lock()

SIEM_META = {
    "sentinel": {
        "name": "Microsoft Sentinel",
        "platform": "Azure",
        "query_language": "KQL",
        "portal_based": False,
        "docs_base": "https://learn.microsoft.com/en-us/azure/sentinel/",
    },
    "splunk": {
        "name": "Splunk",
        "platform": "On-prem / Cloud",
        "query_language": "SPL",
        "portal_based": False,
        "docs_base": "https://docs.splunk.com/Documentation/Splunk",
    },
    "elastic": {
        "name": "Elastic SIEM",
        "platform": "On-prem / Cloud / AWS",
        "query_language": "EQL",
        "portal_based": False,
        "docs_base": "https://www.elastic.co/guide/en/security/current/",
    },
    "qradar": {
        "name": "IBM QRadar",
        "platform": "On-prem / Cloud",
        "query_language": "AQL",
        "portal_based": False,
        "docs_base": "https://www.ibm.com/docs/en/qsip",
    },
    "crowdstrike": {
        "name": "CrowdStrike Falcon",
        "platform": "Cloud (SaaS)",
        "query_language": None,
        "portal_based": True,
        "docs_base": "https://falcon.crowdstrike.com/documentation/page/a2a7fc0e/custom-ioa-rule-groups",
    },
    "chronicle": {
        "name": "Google Chronicle",
        "platform": "Google Cloud",
        "query_language": "YARA-L",
        "portal_based": False,
        "docs_base": "https://cloud.google.com/chronicle/docs/",
    },
}

QUERY_PROMPT = """You are a detection engineer writing SIEM detection content.

MITRE ATT&CK Technique: {technique_id} — {technique_name}
Description: {technique_description}

SIEM Platform: {platform_name} ({platform})
Query Language: {query_language}

Return ONLY valid JSON, no markdown, no explanation:

{{
  "mode": "query",
  "detection_query": "The actual detection query in {query_language}. Must be syntactically correct. Use real field names for this platform.",
  "query_notes": "One sentence explaining what the query looks for and any tuning needed.",
  "data_sources_required": ["log source 1", "log source 2"],
  "implementation_checklist": [
    {{
      "step": 1,
      "action": "Specific action to take",
      "detail": "One sentence of additional context or how-to."
    }}
  ]
}}

Requirements:
- detection_query must be real, working {query_language} — not pseudocode
- implementation_checklist: 5-8 steps covering data source setup, rule creation, threshold tuning, alert routing, and validation
- Return only JSON"""

PORTAL_PROMPT = """You are a security engineer writing portal-based implementation guidance.

MITRE ATT&CK Technique: {technique_id} — {technique_name}
Description: {technique_description}

Platform: {platform_name} ({platform})

{platform_name} uses a UI-driven approach for creating detection rules — there is no standalone query language.
Provide step-by-step portal navigation instructions for implementing a detection for this technique.

Return ONLY valid JSON, no markdown, no explanation:

{{
  "mode": "portal",
  "portal_steps": [
    {{
      "step": 1,
      "title": "Short title for this step",
      "detail": "Specific navigation path and what to configure. Be exact: menu names, button labels, field values."
    }}
  ],
  "data_sources_required": ["log source or sensor 1", "log source or sensor 2"]
}}

Requirements:
- portal_steps: 5-8 steps with exact navigation paths inside the {platform_name} console
- Use real menu names and UI labels that actually exist in {platform_name}
- Return only JSON"""


def _load_cache():
    global _cache
    if CACHE_FILE.exists():
        try:
            _cache = json.loads(CACHE_FILE.read_text(encoding="utf-8"))
        except Exception:
            _cache = {}
    else:
        _cache = {}


def _save_cache():
    CACHE_FILE.parent.mkdir(parents=True, exist_ok=True)
    CACHE_FILE.write_text(json.dumps(_cache, indent=2), encoding="utf-8")


_load_cache()


def _get_client() -> AsyncAnthropic:
    from dotenv import load_dotenv
    load_dotenv()
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise ValueError("ANTHROPIC_API_KEY not set in .env")
    return AsyncAnthropic(api_key=api_key)


async def get_siem_guidance(technique_id: str, technique_name: str, technique_description: str, siem: str) -> dict:
    if siem not in SIEM_META:
        raise ValueError(f"Unknown SIEM: {siem}")

    cache_key = f"{technique_id}_{siem}"

    async with _cache_lock:
        if cache_key in _cache:
            cached = _cache[cache_key]
            # Only return cache if it has the mode field (new format)
            if "mode" in cached:
                return cached

    meta = SIEM_META[siem]

    if meta["portal_based"]:
        prompt = PORTAL_PROMPT.format(
            technique_id=technique_id,
            technique_name=technique_name,
            technique_description=technique_description,
            platform_name=meta["name"],
            platform=meta["platform"],
        )
    else:
        prompt = QUERY_PROMPT.format(
            technique_id=technique_id,
            technique_name=technique_name,
            technique_description=technique_description,
            platform_name=meta["name"],
            platform=meta["platform"],
            query_language=meta["query_language"],
        )

    client = _get_client()
    message = await client.messages.create(
        model=MODEL,
        max_tokens=4096,
        messages=[{"role": "user", "content": prompt}]
    )

    raw = message.content[0].text.strip()
    if raw.startswith("```"):
        lines = raw.split("\n")
        raw = "\n".join(lines[1:-1]) if lines[-1].strip() == "```" else "\n".join(lines[1:])

    data = json.loads(raw)
    data["siem"] = siem
    data["siem_name"] = meta["name"]
    data["siem_platform"] = meta["platform"]
    if not meta["portal_based"]:
        data["query_language"] = meta["query_language"]

    async with _cache_lock:
        _cache[cache_key] = data
        _save_cache()

    return data
