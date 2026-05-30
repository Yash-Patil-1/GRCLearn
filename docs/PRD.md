# Product Requirements Document (PRD)
## GRCLearn — Governance, Risk & Compliance Learning Platform

---

## 1. Product Overview

**Product Name:** GRCLearn  
**Version:** 1.0  
**Author:** Yash Patil  
**Date:** 2026-05-30  

### 1.1 Vision Statement
GRCLearn is a local-first educational platform that teaches Governance, Risk Management, and Compliance (GRC) — covering frameworks, controls, risk assessment, policy writing, audit preparation, and security program management. Inspired by TryHackMe Academy's learning approach but applied to the GRC domain.

Runs entirely on your machine. No cloud, no subscriptions, no APIs.

### 1.2 Problem Statement
- GRC knowledge is scattered across hundreds of framework documents
- No single platform teaches GRC in a structured, interactive way
- Existing tools (Eramba, OpenGRC) are enterprise automation — not learning platforms
- Students preparing for CISA, CRISC, ISO 27001 LA need structured study material
- Framework mapping (NIST → ISO → CIS) is confusing without visual tools

### 1.3 Target Users
| User Type | Description |
|-----------|-------------|
| GRC Students | Preparing for CISA, CRISC, ISO 27001 certifications |
| Security Analysts | Learning compliance requirements |
| IT Auditors | Understanding control frameworks |
| Portfolio Viewers | Hiring managers evaluating Yash's GRC knowledge |

### 1.4 What This Is NOT
- NOT an enterprise GRC automation tool
- NOT a compliance scanner
- NOT a replacement for actual audits
- It IS an educational reference + learning platform

---

## 2. Goals & Success Metrics

| Metric | Target |
|--------|--------|
| Controls documented | 400+ (across NIST, ISO, CIS, SOC2, PCI) |
| Frameworks covered | 10+ |
| Policy templates | 15+ |
| Risk scenarios | 50+ |
| Page load time | < 1 second |

---

## 3. Features & Requirements

### 3.1 Core Features

#### F1: Framework Explorer
- Browse NIST CSF 2.0, NIST 800-53, ISO 27001, CIS Controls v8, COBIT
- Hierarchical navigation (Framework → Family → Control)
- Control details: description, implementation guidance, audit evidence, related controls
- Cross-framework mapping (NIST AC-2 → ISO A.5 → CIS 5)

#### F2: Control Explorer
- 300+ controls with structured data
- Filter by: framework, family, risk level, implementation status
- Each control shows: ID, name, description, guidance, evidence, mappings
- Search across all controls

#### F3: Risk Management Module
- Risk register builder (identify, assess, treat)
- Risk scoring: Likelihood × Impact matrix
- Risk treatment options (Accept, Mitigate, Transfer, Avoid)
- 30+ pre-built risk scenarios with scoring examples
- Risk heat map visualization

#### F4: Policy Library
- 10+ security policy templates
- Markdown-based, editable
- Policies: Access Control, Password, Incident Response, Vendor Management, Asset Management, Acceptable Use, Data Classification, BCP, Change Management, Security Awareness

#### F5: Audit Module
- Audit checklist generator per framework
- Evidence collection guidance
- Control validation steps
- Findings management (finding → remediation → verification)
- Audit workflow: Plan → Execute → Report → Follow-up

#### F6: Framework Mapping Engine
- Visual cross-framework mapping
- NIST 800-53 ↔ ISO 27001 ↔ CIS Controls ↔ SOC 2 ↔ PCI DSS
- Click any control → see equivalents in other frameworks
- Mapping table export

#### F7: Metrics & Reporting
- KPI/KRI definitions and examples
- Compliance score calculator
- Risk score dashboard
- Executive reporting templates

#### F8: Learning Paths
- 7 structured phases (Governance → Risk → Controls → Compliance → Audit → Operations → Reporting)
- Progress tracking per phase
- Recommended study order

#### F9: Search & Navigation
- Full-text search across controls, policies, risks
- Filter by framework, family, risk level
- Bookmarks + notes

### 3.2 Nice-to-Have (v2)
- AI compliance assistant
- Interactive quizzes
- Certificate of completion
- Custom framework builder

---

## 4. Constraints

| Constraint | Details |
|-----------|---------|
| No Docker / VMs / Cloud | Runs locally |
| No APIs | All data is local JSON/SQLite |
| No automation | Educational only |
| Offline capable | Works without internet after setup |
| Performance | 4GB+ RAM |

---

## 5. User Stories

| ID | As a... | I want to... | So that... |
|----|---------|-------------|-----------|
| US1 | Student | Browse controls by framework | I learn each framework systematically |
| US2 | Student | See cross-framework mappings | I understand equivalences |
| US3 | Auditor | Generate audit checklists | I prepare for assessments |
| US4 | Analyst | Build a risk register | I practice risk assessment |
| US5 | Manager | View policy templates | I understand policy structure |
| US6 | Learner | Track my progress | I know what I've covered |

---

## 6. Content Scope (v1)

### Frameworks
| Framework | Controls/Items |
|-----------|---------------|
| NIST 800-53 Rev 5 | 50 key controls |
| NIST CSF 2.0 | 6 functions, 22 categories |
| ISO 27001:2022 | 93 controls (Annex A) |
| CIS Controls v8 | 18 controls, 153 safeguards |
| SOC 2 | 5 trust criteria |
| PCI DSS 4.0 | 12 requirements |
| GDPR | Key articles |
| HIPAA | Key rules |

### Policies (10+)
Access Control, Password, Incident Response, Vendor Management, Asset Management, Acceptable Use, Data Classification, BCP/DR, Change Management, Security Awareness

### Risk Scenarios (30+)
Unpatched servers, phishing, insider threat, ransomware, data breach, third-party risk, cloud misconfiguration, etc.
