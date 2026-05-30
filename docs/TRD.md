# Technical Requirements Document (TRD)
## GRCLearn — Governance, Risk & Compliance Learning Platform

---

## 1. System Architecture

Same stack as VAPTLearn for consistency — React + FastAPI + JSON/SQLite.

```
┌─────────────────────────────────────────────────────┐
│           Frontend (React + Vite + Tailwind v4)     │
│  ┌──────────┐ ┌──────────┐ ┌───────────────────┐   │
│  │Framework │ │  Risk    │ │  Audit            │   │
│  │Explorer  │ │ Register │ │  Checklists       │   │
│  └──────────┘ └──────────┘ └───────────────────┘   │
└─────────────────────┬───────────────────────────────┘
                      │ REST API
┌─────────────────────▼───────────────────────────────┐
│              Backend (FastAPI)                        │
│  ┌──────────┐ ┌──────────┐ ┌───────────────────┐   │
│  │Framework │ │  Risk    │ │  Mapping          │   │
│  │ Service  │ │  Engine  │ │  Engine           │   │
│  └──────────┘ └──────────┘ └───────────────────┘   │
└─────────────────────┬───────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────┐
│              Data Layer                              │
│  ┌──────────┐ ┌──────────┐ ┌───────────────────┐   │
│  │  JSON    │ │  SQLite  │ │  Markdown         │   │
│  │(controls)│ │(user data│ │  (policies)       │   │
│  └──────────┘ └──────────┘ └───────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 | UI Framework |
| Vite 5 | Build tool |
| Tailwind CSS v4 | Styling (Hyperstudio theme) |
| React Router 6 | Navigation |
| Recharts | Risk heat maps, compliance charts |
| Fuse.js | Client-side search |
| react-markdown | Policy rendering |

### Backend
| Technology | Purpose |
|-----------|---------|
| Python 3.10+ | Core language |
| FastAPI | Web framework |
| Uvicorn | ASGI server |
| Pydantic | Validation |

### Data
| Technology | Purpose |
|-----------|---------|
| JSON files | Controls, frameworks, mappings, risks |
| SQLite | User progress, risk register entries, notes |
| Markdown | Policy templates |

---

## 3. Design System

Same Hyperstudio theme as VAPTLearn (monochrome + amber) for portfolio cohesion.

| Color | Hex | Usage |
|-------|-----|-------|
| Midnight Void | `#101010` | Background |
| Deep Space | `#080808` | Deeper surfaces |
| Dark Carbon | `#333333` | Borders |
| Ash Gray | `#949494` | Secondary text |
| Polar White | `#F3F3F3` | Primary text |
| Amber Glow | `#E7C59A` | Accent (interactive) |
| Neon Green | `#00AC5C` | Compliant/success |
| Risk Red | `#E74C3C` | High risk indicators |
| Risk Yellow | `#F39C12` | Medium risk |

---

## 4. API Specification

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/frameworks` | List all frameworks |
| GET | `/api/frameworks/{id}` | Framework detail |
| GET | `/api/controls` | List controls (with filters) |
| GET | `/api/controls/{id}` | Control detail + mappings |
| GET | `/api/controls/search?q=` | Search controls |
| GET | `/api/mappings/{control_id}` | Cross-framework mappings |
| GET | `/api/risks` | List risk scenarios |
| GET | `/api/risks/{id}` | Risk detail |
| POST | `/api/risk-register` | Add to user's risk register |
| GET | `/api/risk-register` | User's risk register |
| GET | `/api/policies` | List policy templates |
| GET | `/api/policies/{id}` | Policy content (Markdown) |
| GET | `/api/audit/checklist/{framework}` | Generate audit checklist |
| GET | `/api/phases` | Learning phases |
| GET | `/api/progress` | User progress |
| POST | `/api/progress/mark` | Mark item learned |
| GET | `/api/bookmarks` | Bookmarks |
| POST | `/api/bookmarks` | Add bookmark |

---

## 5. Knowledge Base Schema

### Control Entry
```json
{
  "id": "nist-ac-2",
  "framework": "NIST 800-53",
  "family": "Access Control",
  "family_id": "AC",
  "control_id": "AC-2",
  "name": "Account Management",
  "description": "Manage information system accounts including establishing, activating, modifying, reviewing, disabling, and removing accounts.",
  "implementation_guidance": [
    "Define account types (individual, shared, group, system, guest)",
    "Establish conditions for group membership",
    "Identify authorized users and access authorizations",
    "Require approvals for account creation requests",
    "Review accounts periodically for compliance"
  ],
  "audit_evidence": [
    "Account inventory/listing",
    "Access review records",
    "Account approval documentation",
    "Terminated user account removal logs"
  ],
  "risk_addressed": ["Unauthorized access", "Orphaned accounts", "Privilege creep"],
  "priority": "high",
  "mappings": {
    "iso_27001": ["A.5.15", "A.5.16", "A.5.18"],
    "cis_v8": ["5.1", "5.2", "5.3"],
    "soc2": ["CC6.1", "CC6.2"],
    "pci_dss": ["7.1", "7.2", "8.1"]
  },
  "related_controls": ["AC-3", "AC-6", "IA-2", "IA-4"],
  "references": ["https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final"]
}
```

### Risk Scenario
```json
{
  "id": "risk-unpatched-servers",
  "name": "Unpatched Servers",
  "category": "Vulnerability Management",
  "description": "Critical servers running outdated software with known vulnerabilities.",
  "threat_source": "External attacker, automated scanners",
  "vulnerability": "Missing security patches",
  "likelihood": 4,
  "impact": 5,
  "risk_score": 20,
  "risk_level": "Critical",
  "treatment": "Mitigate",
  "treatment_plan": [
    "Implement automated patch management",
    "Establish patch SLA (critical: 72hrs, high: 7 days)",
    "Deploy compensating controls for legacy systems"
  ],
  "controls": ["NIST SI-2", "CIS 7.1", "ISO A.8.8"],
  "kri": "% of systems with critical patches > 30 days old"
}
```

### Policy Template (Markdown)
```markdown
# Access Control Policy

## 1. Purpose
Define requirements for managing access to information systems.

## 2. Scope
All employees, contractors, and third parties.

## 3. Policy Statements
3.1 Access shall be granted based on least privilege principle.
3.2 All access requests require manager approval.
...
```

---

## 6. File Structure

```
GRCLearn/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── routers/
│   │   ├── frameworks.py
│   │   ├── controls.py
│   │   ├── risks.py
│   │   ├── policies.py
│   │   ├── audit.py
│   │   ├── mappings.py
│   │   └── progress.py
│   ├── services/
│   │   ├── knowledge_base.py
│   │   ├── mapping_engine.py
│   │   ├── risk_engine.py
│   │   └── search.py
│   ├── models/
│   │   ├── database.py
│   │   └── schemas.py
│   └── data/
│       ├── frameworks/
│       │   ├── nist_800_53.json
│       │   ├── nist_csf.json
│       │   ├── iso_27001.json
│       │   ├── cis_v8.json
│       │   ├── soc2.json
│       │   └── pci_dss.json
│       ├── risks/
│       │   └── scenarios.json
│       ├── policies/
│       │   ├── access_control.md
│       │   ├── password.md
│       │   ├── incident_response.md
│       │   └── ...
│       ├── mappings.json
│       └── phases.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Frameworks.jsx
│   │   │   ├── Controls.jsx
│   │   │   ├── RiskRegister.jsx
│   │   │   ├── Policies.jsx
│   │   │   ├── Audit.jsx
│   │   │   └── Mappings.jsx
│   │   └── components/
│   └── ...
├── docs/
├── README.md
├── LICENSE
└── setup.sh
```

---

## 7. Performance Requirements

| Metric | Requirement |
|--------|-------------|
| Page load | < 1.5s |
| Search | < 200ms |
| Control detail | < 100ms |
| Risk calculation | < 50ms |
