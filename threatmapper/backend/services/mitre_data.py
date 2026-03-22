import json
import subprocess
import sys
from functools import lru_cache
from pathlib import Path

TACTIC_ORDER = [
    ('reconnaissance', 'Reconnaissance'),
    ('resource-development', 'Resource Development'),
    ('initial-access', 'Initial Access'),
    ('execution', 'Execution'),
    ('persistence', 'Persistence'),
    ('privilege-escalation', 'Privilege Escalation'),
    ('defense-evasion', 'Defense Evasion'),
    ('credential-access', 'Credential Access'),
    ('discovery', 'Discovery'),
    ('lateral-movement', 'Lateral Movement'),
    ('collection', 'Collection'),
    ('command-and-control', 'Command and Control'),
    ('exfiltration', 'Exfiltration'),
    ('impact', 'Impact'),
]

DATA_FILE = Path(__file__).parent.parent / "data" / "techniques.json"


def _ensure_data():
    if not DATA_FILE.exists():
        print("techniques.json not found. Running fetch_mitre.py...")
        script = Path(__file__).parent.parent / "scripts" / "fetch_mitre.py"
        result = subprocess.run([sys.executable, str(script)], capture_output=True, text=True)
        if result.returncode != 0:
            raise RuntimeError(f"Failed to fetch MITRE data: {result.stderr}")
        print(result.stdout)


@lru_cache(maxsize=1)
def get_techniques() -> dict:
    _ensure_data()
    return json.loads(DATA_FILE.read_text())


def get_matrix_data() -> dict:
    techniques = get_techniques()

    tactic_buckets = {tactic_id: [] for tactic_id, _ in TACTIC_ORDER}

    for tid, technique in techniques.items():
        for tactic in technique.get('tactics', []):
            if tactic in tactic_buckets:
                tactic_buckets[tactic].append(technique)

    matrix = {}
    for tactic_id, tactic_name in TACTIC_ORDER:
        sorted_techniques = sorted(tactic_buckets[tactic_id], key=lambda t: t['id'])
        matrix[tactic_id] = {
            'name': tactic_name,
            'techniques': sorted_techniques,
        }

    return matrix
