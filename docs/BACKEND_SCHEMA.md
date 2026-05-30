# Backend Schema
## GRCLearn — Governance, Risk & Compliance Learning Platform

---

## 1. Knowledge Base (JSON)

### frameworks/{name}.json — Control entries
```json
{
  "id": "nist-ac-2",
  "framework": "NIST 800-53",
  "family": "Access Control",
  "family_id": "AC",
  "control_id": "AC-2",
  "name": "Account Management",
  "description": "...",
  "implementation_guidance": ["..."],
  "audit_evidence": ["..."],
  "risk_addressed": ["..."],
  "priority": "high",
  "mappings": {
    "iso_27001": ["A.5.15"],
    "cis_v8": ["5.1"],
    "soc2": ["CC6.1"],
    "pci_dss": ["7.1"]
  },
  "related_controls": ["AC-3", "IA-2"],
  "references": ["..."]
}
```

### risks/scenarios.json
```json
{
  "id": "risk-unpatched-servers",
  "name": "Unpatched Servers",
  "category": "Vulnerability Management",
  "description": "...",
  "threat_source": "External attacker",
  "vulnerability": "Missing patches",
  "likelihood": 4,
  "impact": 5,
  "risk_score": 20,
  "risk_level": "Critical",
  "treatment": "Mitigate",
  "treatment_plan": ["..."],
  "controls": ["NIST SI-2", "CIS 7.1"],
  "kri": "% systems unpatched > 30 days"
}
```

### mappings.json — Cross-framework mapping table
```json
{
  "nist_ac_2": {
    "nist_800_53": "AC-2",
    "iso_27001": ["A.5.15", "A.5.16", "A.5.18"],
    "cis_v8": ["5.1", "5.2", "5.3"],
    "soc2": ["CC6.1", "CC6.2"],
    "pci_dss": ["7.1", "7.2", "8.1"]
  }
}
```

---

## 2. SQLite Schema (User State)

```sql
CREATE TABLE progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id TEXT NOT NULL,
    item_type TEXT NOT NULL CHECK(item_type IN ('control', 'risk', 'policy', 'phase')),
    learned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(item_id, item_type)
);

CREATE TABLE risk_register (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT,
    description TEXT,
    likelihood INTEGER CHECK(likelihood BETWEEN 1 AND 5),
    impact INTEGER CHECK(impact BETWEEN 1 AND 5),
    risk_score INTEGER GENERATED ALWAYS AS (likelihood * impact) STORED,
    risk_level TEXT,
    treatment TEXT CHECK(treatment IN ('accept', 'mitigate', 'transfer', 'avoid')),
    treatment_plan TEXT,
    owner TEXT,
    status TEXT DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookmarks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id TEXT NOT NULL,
    item_type TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(item_id, item_type)
);

CREATE TABLE notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id TEXT,
    item_type TEXT,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_findings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    framework TEXT NOT NULL,
    control_id TEXT NOT NULL,
    status TEXT CHECK(status IN ('compliant', 'non_compliant', 'partial', 'not_applicable')),
    evidence TEXT,
    finding TEXT,
    remediation TEXT,
    due_date TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. Pydantic Models

```python
class Control(BaseModel):
    id: str
    framework: str
    family: str
    family_id: str
    control_id: str
    name: str
    description: str
    implementation_guidance: list[str]
    audit_evidence: list[str]
    risk_addressed: list[str]
    priority: str
    mappings: dict[str, list[str]]
    related_controls: list[str]
    references: list[str]

class RiskScenario(BaseModel):
    id: str
    name: str
    category: str
    description: str
    likelihood: int
    impact: int
    risk_score: int
    risk_level: str
    treatment: str
    treatment_plan: list[str]
    controls: list[str]

class RiskRegisterEntry(BaseModel):
    name: str
    category: str
    description: str
    likelihood: int  # 1-5
    impact: int      # 1-5
    treatment: str   # accept, mitigate, transfer, avoid
    treatment_plan: str
    owner: str

class AuditFinding(BaseModel):
    framework: str
    control_id: str
    status: str  # compliant, non_compliant, partial, not_applicable
    evidence: str
    finding: str
    remediation: str
```

---

## 4. Content Targets

| Data File | Entries |
|-----------|---------|
| nist_800_53.json | 50 key controls |
| nist_csf.json | 22 categories + 6 functions |
| iso_27001.json | 40 key controls (from 93) |
| cis_v8.json | 18 controls + 50 safeguards |
| soc2.json | 5 trust criteria + 20 points |
| pci_dss.json | 12 requirements + 30 sub-reqs |
| scenarios.json | 30 risk scenarios |
| mappings.json | 100+ cross-mappings |
| policies/ | 10 Markdown templates |
