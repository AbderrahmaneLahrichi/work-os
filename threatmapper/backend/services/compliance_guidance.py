import os
import json
import asyncio
from pathlib import Path
from anthropic import AsyncAnthropic

MODEL = "claude-sonnet-4-6"

CACHE_FILE = Path(__file__).parent.parent / "data" / "compliance_cache.json"
_cache: dict = {}
_cache_lock = asyncio.Lock()

# Hardcoded official docs per framework — no AI-generated URLs
FRAMEWORK_DOCS = {
    "NIST CSF":    "https://www.nist.gov/cyberframework",
    "NIST SP 800-53": "https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final",
    "SOC 2":       "https://www.aicpa.org/resources/landing/soc-2",
    "PCI DSS":     "https://www.pcisecuritystandards.org/document_library/",
    "ISO 27001":   "https://www.iso.org/isoiec-27001-information-security.html",
    "ISO 27002":   "https://www.iso.org/standard/75652.html",
    "HIPAA":       "https://www.hhs.gov/hipaa/for-professionals/security/index.html",
    "GDPR":        "https://gdpr.eu/checklist/",
    "CCPA":        "https://oag.ca.gov/privacy/ccpa",
    "FedRAMP":     "https://www.fedramp.gov/documents/",
    "CIS Controls": "https://www.cisecurity.org/controls",
    "CMMC":        "https://dodcio.defense.gov/CMMC/",
}


def _get_docs_url(framework_name: str) -> str:
    for key, url in FRAMEWORK_DOCS.items():
        if key.lower() in framework_name.lower() or framework_name.lower() in key.lower():
            return url
    return "https://www.nist.gov/cyberframework"


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


async def get_compliance_guidance(
    framework: str,
    control_id: str,
    control_name: str,
    control_description: str,
    company_name: str,
    industry: str,
) -> dict:
    cache_key = f"{framework}_{control_id}_{company_name}"

    async with _cache_lock:
        cached = _cache.get(cache_key)
        if cached and any("platform" in s for s in cached.get("implementation_steps", [])):
            return cached

    prompt = f"""You are a compliance engineer writing precise, actionable implementation guidance.

Company: {company_name} ({industry})
Framework: {framework}
Control: {control_id} — {control_name}
What it requires: {control_description}

Return ONLY valid JSON, no markdown:

{{
  "what_it_means": "2 sentences. Exactly what this control requires for {company_name} — no filler, no vague language.",
  "implementation_steps": [
    {{
      "step": 1,
      "perspective": "Engineering",
      "platform": "AWS",
      "action": "Start with a verb. E.g. 'Enable AES-256 encryption on all RDS instances'",
      "detail": "Exact steps: CLI commands (e.g. aws kms create-key), portal menu paths (IAM > Policies > Create), config keys and values, SDK calls. No vague advice."
    }}
  ],
  "mitre_correlation": "T1XXX — Technique Name: one sentence on how this control defends against it. Use null if genuinely not applicable.",
  "tools_and_technologies": ["Specific tool or service name only"],
  "evidence_required": ["Name the exact artifact: log file, report type, screenshot of which setting, policy document name"]
}}

Rules:
- perspective must be exactly one of: Engineering, Portal/Config, Policy
- platform must be exactly one of: AWS, Azure, GCP, Okta, Microsoft 365, On-Premise, Any
  - Use "Any" for steps that apply regardless of platform (e.g. code changes, policy writing)
  - Use the specific cloud/platform when the step is specific to that provider
- Include steps across multiple platforms where a company likely uses more than one
- implementation_steps: 6-10 total steps — cover AWS, Azure and "Any" at minimum
- detail must be concrete: actual CLI commands, exact portal menu paths, real config values
- mitre_correlation: access control→T1078, MFA→T1110, encryption→T1485/T1486, logging→T1562, network seg→T1190
- evidence_required: 2-5 items, name exactly what the auditor will ask for
- Return only JSON"""

    client = _get_client()
    message = await client.messages.create(
        model=MODEL,
        max_tokens=3500,
        messages=[{"role": "user", "content": prompt}]
    )

    raw = message.content[0].text.strip()
    if raw.startswith("```"):
        lines = raw.split("\n")
        raw = "\n".join(lines[1:-1]) if lines[-1].strip() == "```" else "\n".join(lines[1:])

    data = json.loads(raw)
    data["framework"] = framework
    data["control_id"] = control_id
    data["control_name"] = control_name
    data["docs_url"] = _get_docs_url(framework)

    async with _cache_lock:
        _cache[cache_key] = data
        _save_cache()

    return data
