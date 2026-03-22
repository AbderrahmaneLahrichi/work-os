import json
import os
from anthropic import AsyncAnthropic
from services.mitre_data import get_techniques, get_matrix_data

MODEL = "claude-sonnet-4-6"


def _get_client() -> AsyncAnthropic:
    from dotenv import load_dotenv
    load_dotenv()
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise ValueError("ANTHROPIC_API_KEY not set in .env")
    return AsyncAnthropic(api_key=api_key)


def _build_technique_reference() -> str:
    techniques = get_techniques()
    lines = []
    for tid, t in list(techniques.items())[:300]:
        tactics_str = ", ".join(t.get('tactics', []))
        lines.append(f"{t['id']} | {t['name']} | {tactics_str}")
    return "\n".join(lines)


def _build_prompt(company_profile: dict, technique_reference: str) -> str:
    company_name = company_profile.get('company_name', 'Unknown')
    website = company_profile.get('website', '')
    homepage = company_profile.get('homepage_content', '')
    about = company_profile.get('about_content', '')

    context_parts = [f"Company: {company_name}"]
    if website:
        context_parts.append(f"Website: {website}")
    if homepage:
        context_parts.append(f"Homepage content:\n{homepage[:2000]}")
    if about:
        context_parts.append(f"About page content:\n{about[:2000]}")

    company_context = "\n\n".join(context_parts)

    return f"""You are a cybersecurity analyst specializing in MITRE ATT&CK threat modeling. Be concise.

{company_context}

MITRE ATT&CK techniques (ID | Name | Tactic):
{technique_reference}

Identify the 12 most relevant techniques for this company. Keep all text fields under 20 words each.

Return ONLY this JSON, no markdown, no explanation:

{{
  "company_summary": "One sentence about the company and their top security risk.",
  "industry": "Industry name",
  "data_handled": ["type1", "type2", "type3"],
  "tech_stack": ["tech1", "tech2", "tech3"],
  "compliance_frameworks": [
    {{
      "name": "Framework name (e.g. NIST CSF, SOC 2, PCI DSS, ISO 27001, HIPAA, GDPR)",
      "reason": "One sentence why it applies to this company.",
      "controls": [
        {{
          "id": "Control ID (e.g. PR.AC-1, CC6.1, Req 8.3, A.9.1.1)",
          "name": "Short control name (e.g. Identity Management, Logical Access, Password Policy)",
          "description": "One sentence of what this control requires.",
          "priority": "High, Medium, or Low"
        }}
      ]
    }}
  ],
  "relevant_techniques": [
    {{
      "technique_id": "T1xxx",
      "relevance_score": 8,
      "why_relevant": "One sentence specific to this company.",
      "what_to_detect": "One sentence on what to look for.",
      "tools": ["Tool1", "Tool2"],
      "data_sources": ["Source1", "Source2"],
      "microsoft_docs_url": ""
    }}
  ],
  "implementation_checklist": [
    {{
      "priority": "High",
      "action": "Concise action to implement.",
      "techniques_covered": ["T1xxx"],
      "tools": ["Tool"],
      "effort": "Days"
    }}
  ]
}}

Rules: relevance_score is integer 1-10, score >= 5 only. priority is High/Medium/Low. effort is Days/Weeks/Months. Max 4 compliance frameworks. Max 8 checklist items. Return only JSON."""


async def analyze_company(company_profile: dict) -> dict:
    technique_reference = _build_technique_reference()
    prompt = _build_prompt(company_profile, technique_reference)
    matrix = get_matrix_data()

    client = _get_client()
    message = await client.messages.create(
        model=MODEL,
        max_tokens=8192,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    raw_text = message.content[0].text.strip()

    # Strip markdown code fences if present
    if raw_text.startswith("```"):
        lines = raw_text.split("\n")
        raw_text = "\n".join(lines[1:-1]) if lines[-1].strip() == "```" else "\n".join(lines[1:])

    claude_response = json.loads(raw_text)

    # Build relevance map keyed by technique_id
    relevance_map = {}
    for rt in claude_response.get('relevant_techniques', []):
        tid = rt.get('technique_id', '')
        if tid:
            relevance_map[tid] = {
                'relevance_score': int(rt.get('relevance_score', 0)),
                'why_relevant': rt.get('why_relevant', ''),
                'what_to_detect': rt.get('what_to_detect', ''),
                'tools': rt.get('tools', []),
                'data_sources': rt.get('data_sources', []),
                'microsoft_docs_url': rt.get('microsoft_docs_url', ''),
            }

    # Rebuild the full matrix with relevance data merged in
    enriched_matrix = {}
    for tactic_id, tactic_data in matrix.items():
        enriched_techniques = []
        for technique in tactic_data['techniques']:
            tid = technique['id']
            rel = relevance_map.get(tid, {})
            enriched_technique = {
                'id': tid,
                'name': technique['name'],
                'description': technique.get('description', ''),
                'tactics': technique.get('tactics', []),
                'url': technique.get('url', ''),
                'detection': technique.get('detection', ''),
                'platforms': technique.get('platforms', []),
                'data_sources': technique.get('data_sources', []),
                'relevance_score': rel.get('relevance_score', 0),
                'why_relevant': rel.get('why_relevant', ''),
                'what_to_detect': rel.get('what_to_detect', ''),
                'tools': rel.get('tools', []),
                'microsoft_docs_url': rel.get('microsoft_docs_url', ''),
            }
            enriched_techniques.append(enriched_technique)
        enriched_matrix[tactic_id] = {
            'name': tactic_data['name'],
            'techniques': enriched_techniques,
        }

    return {
        'company_name': company_profile.get('company_name', ''),
        'company_summary': claude_response.get('company_summary', ''),
        'industry': claude_response.get('industry', ''),
        'data_handled': claude_response.get('data_handled', []),
        'tech_stack': claude_response.get('tech_stack', []),
        'compliance_frameworks': claude_response.get('compliance_frameworks', []),
        'implementation_checklist': claude_response.get('implementation_checklist', []),
        'matrix': enriched_matrix,
    }
