import os
import json
from anthropic import AsyncAnthropic

MODEL = "claude-sonnet-4-6"


def _get_client() -> AsyncAnthropic:
    from dotenv import load_dotenv
    load_dotenv()
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise ValueError("ANTHROPIC_API_KEY not set in .env")
    return AsyncAnthropic(api_key=api_key)


async def generate_report(
    company_name: str,
    industry: str,
    company_summary: str,
    relevant_techniques: list,
) -> dict:
    techniques_text = "\n".join([
        f"- {t['id']} {t['name']} (Score: {t['relevance_score']}/10"
        f", Tactic: {', '.join(t.get('tactics', []))}"
        f"): {t.get('why_relevant', '')}"
        for t in sorted(relevant_techniques, key=lambda x: x.get('relevance_score', 0), reverse=True)[:15]
    ])

    prompt = f"""You are a senior threat intelligence analyst writing a targeted security report for a real organization.

Company: {company_name}
Industry: {industry}
Profile: {company_summary}

Relevant MITRE ATT&CK Techniques (already scored by relevance):
{techniques_text}

Return ONLY valid JSON, no markdown, no explanation:

{{
  "executive_summary": "3-4 sentences summarizing the company's overall threat profile, what makes it a target, and the highest-risk attack vectors.",
  "attack_narrative": "2-3 sentences describing the most realistic end-to-end attack chain an adversary would run against this specific company.",
  "top_techniques": [
    {{
      "id": "T1234",
      "name": "Technique Name",
      "tactic": "Tactic Name",
      "score": 9,
      "context": "2-3 sentences of company-specific context explaining why this technique is dangerous for them specifically.",
      "prevention": ["Specific prevention action 1", "Specific prevention action 2", "Specific prevention action 3"]
    }}
  ],
  "monitoring_signals": [
    {{
      "category": "Category name (e.g. Authentication, API Activity, Cloud Infrastructure, Endpoint, Network)",
      "signals": ["Specific observable signal 1", "Specific observable signal 2", "Specific observable signal 3"]
    }}
  ],
  "top_priorities": [
    {{
      "rank": 1,
      "title": "Short action title",
      "detail": "2 sentences: what to do and why it's the most impactful starting point for this company."
    }}
  ]
}}

Requirements:
- top_techniques: the 6-8 highest-scored techniques, company-specific context only — no generic descriptions
- monitoring_signals: 4-6 categories covering the relevant log sources for this company's environment
- top_priorities: exactly 5 items ordered by business impact
- Every field must be specific to {company_name} — no filler, no generic security advice
- Return only JSON"""

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

    return json.loads(raw)
