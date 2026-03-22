import json
import httpx
from pathlib import Path
import sys

MITRE_URL = "https://raw.githubusercontent.com/mitre-attack/attack-stix-data/master/enterprise-attack/enterprise-attack-14.1.json"
OUTPUT = Path(__file__).parent.parent / "data" / "techniques.json"


def fetch():
    print("Downloading MITRE ATT&CK data (this may take a moment)...")
    raw = httpx.get(MITRE_URL, timeout=120, follow_redirects=True).json()

    techniques = {}
    for obj in raw.get('objects', []):
        if obj.get('type') != 'attack-pattern':
            continue
        if obj.get('x_mitre_deprecated') or obj.get('revoked'):
            continue
        ext_refs = obj.get('external_references', [])
        tid = next((r['external_id'] for r in ext_refs if r.get('source_name') == 'mitre-attack'), None)
        if not tid or '.' in tid:
            continue
        tactics = [p['phase_name'] for p in obj.get('kill_chain_phases', [])
                   if p.get('kill_chain_name') == 'mitre-attack']
        raw_sources = obj.get('x_mitre_data_sources', []) or []
        data_sources = list(set([str(ds).split(':')[0].strip() for ds in raw_sources]))[:5]
        techniques[tid] = {
            'id': tid,
            'name': obj.get('name', ''),
            'description': (obj.get('description', '') or '')[:500],
            'tactics': tactics,
            'platforms': obj.get('x_mitre_platforms', []),
            'detection': (obj.get('x_mitre_detection', '') or '')[:400],
            'url': f"https://attack.mitre.org/techniques/{tid}/",
            'data_sources': data_sources,
        }

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(techniques, indent=2))
    print(f"Saved {len(techniques)} techniques to {OUTPUT}")


if __name__ == "__main__":
    fetch()
