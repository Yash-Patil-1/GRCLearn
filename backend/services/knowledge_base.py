"""GRC Knowledge Base — loads controls, risks, policies, mappings from JSON."""

import json
from pathlib import Path
from typing import Optional

DATA_DIR = Path(__file__).parent.parent / "data"


class GRCKnowledgeBase:
    def __init__(self):
        self.controls: list[dict] = []
        self.risks: list[dict] = []
        self.frameworks: list[dict] = []
        self.policies: list[dict] = []
        self.mappings: dict = {}
        self.phases: list[dict] = []
        self.questions: list[dict] = []
        self.theory: list[dict] = []
        self._index: dict[str, dict] = {}

    def load(self):
        # Load controls from framework files
        fw_dir = DATA_DIR / "frameworks"
        if fw_dir.exists():
            for f in sorted(fw_dir.glob("*.json")):
                with open(f, 'r') as fp:
                    data = json.load(fp)
                    if isinstance(data, list):
                        self.controls.extend(data)
                    elif isinstance(data, dict) and "controls" in data:
                        self.controls.extend(data["controls"])
                        self.frameworks.append({
                            "id": data.get("id", f.stem),
                            "name": data.get("name", f.stem),
                            "description": data.get("description", ""),
                            "control_count": len(data["controls"]),
                        })

        # Deduplicate controls — keep first occurrence when IDs overlap (e.g., batch files)
        seen_ids = set()
        unique_controls = []
        for c in self.controls:
            cid = c.get("id")
            if cid and cid not in seen_ids:
                seen_ids.add(cid)
                unique_controls.append(c)
        self.controls = unique_controls

        self._index = {c["id"]: c for c in self.controls}

        # Load risks
        risks_file = DATA_DIR / "risks" / "scenarios.json"
        if risks_file.exists():
            with open(risks_file, 'r') as f:
                self.risks = json.load(f)

        # Load mappings
        mappings_file = DATA_DIR / "mappings.json"
        if mappings_file.exists():
            with open(mappings_file, 'r') as f:
                self.mappings = json.load(f)

        # Load policies list
        policies_dir = DATA_DIR / "policies"
        if policies_dir.exists():
            for f in sorted(policies_dir.glob("*.md")):
                self.policies.append({"id": f.stem, "name": f.stem.replace("_", " ").title(), "file": str(f)})

        # Load phases
        phases_file = DATA_DIR / "phases.json"
        if phases_file.exists():
            with open(phases_file, 'r') as f:
                self.phases = json.load(f)

        # Load quiz questions
        questions_dir = DATA_DIR / "questions"
        if questions_dir.exists():
            for f in sorted(questions_dir.glob("*.json")):
                with open(f, 'r') as fp:
                    self.questions.extend(json.load(fp))

        # Load theory
        theory_dir = DATA_DIR / "theory"
        if theory_dir.exists():
            for f in sorted(theory_dir.glob("*.json")):
                with open(f, 'r') as fp:
                    self.theory.append(json.load(fp))

    @property
    def control_count(self) -> int:
        return len(self.controls)

    @property
    def risk_count(self) -> int:
        return len(self.risks)

    @property
    def framework_count(self) -> int:
        return len(self.frameworks)

    def get_control(self, control_id: str) -> Optional[dict]:
        return self._index.get(control_id)

    def search_controls(self, query: str) -> list[dict]:
        q = query.lower()
        return [c for c in self.controls if
                q in c.get("name", "").lower() or
                q in c.get("description", "").lower() or
                q in c.get("control_id", "").lower() or
                q in c.get("family", "").lower()]

    def filter_controls(self, framework: Optional[str] = None, family: Optional[str] = None) -> list[dict]:
        results = self.controls
        if framework:
            results = [c for c in results if c.get("framework", "").lower() == framework.lower()]
        if family:
            results = [c for c in results if c.get("family", "").lower() == family.lower()]
        return results

    def get_families(self, framework: Optional[str] = None) -> list[str]:
        controls = self.filter_controls(framework=framework) if framework else self.controls
        return sorted(set(c.get("family", "") for c in controls if c.get("family")))

    def get_policy_content(self, policy_id: str) -> Optional[str]:
        policy = next((p for p in self.policies if p["id"] == policy_id), None)
        if policy and Path(policy["file"]).exists():
            return Path(policy["file"]).read_text()
        return None
