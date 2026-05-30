# Implementation Plan
## GRCLearn — Governance, Risk & Compliance Learning Platform

---

## Timeline: 3-4 weeks

```
Week 1: Knowledge Base (controls, risks, policies, mappings)
Week 2: Backend API + Frontend core pages
Week 3: Risk module, Audit module, Mapping engine
Week 4: Content expansion, Testing, Documentation
```

---

## Phase 1: Knowledge Base (Day 1-5)

| Task | Priority |
|------|----------|
| Project structure | P0 |
| Define JSON schemas | P0 |
| Write 50 NIST 800-53 controls | P0 |
| Write 22 NIST CSF categories | P0 |
| Write 40 ISO 27001 controls | P0 |
| Write 18 CIS Controls + 50 safeguards | P0 |
| Write SOC 2 trust criteria | P1 |
| Write PCI DSS requirements | P1 |
| Create 30 risk scenarios | P0 |
| Create cross-framework mappings | P0 |
| Write 10 policy templates (Markdown) | P0 |
| Create phases.json | P0 |

**Deliverable:** 300+ controls, 30 risks, 10 policies, 100+ mappings

---

## Phase 2: Backend API (Day 6-9)

| Task | Priority |
|------|----------|
| FastAPI app structure | P0 |
| Frameworks router | P0 |
| Controls router (list, detail, search, filter) | P0 |
| Mappings router | P0 |
| Risks router | P0 |
| Risk register CRUD | P0 |
| Policies router | P0 |
| Audit router (checklist generation) | P1 |
| Progress router | P1 |
| Bookmarks + Notes | P1 |
| SQLite setup | P0 |
| CORS | P0 |

**Deliverable:** Full REST API

---

## Phase 3: Frontend Core (Day 10-15)

| Task | Priority |
|------|----------|
| Vite + React + Tailwind v4 | P0 |
| Hyperstudio theme | P0 |
| Sidebar navigation | P0 |
| Dashboard (progress, risk heat map) | P0 |
| Framework Explorer | P0 |
| Control Detail page | P0 |
| Learning Paths | P0 |
| Search (Fuse.js) | P0 |
| Policy viewer (Markdown) | P1 |
| Risk Register page | P1 |

**Deliverable:** Functional frontend

---

## Phase 4: Advanced Features (Day 16-19)

| Task | Priority |
|------|----------|
| Risk heat map visualization | P0 |
| Framework mapping view | P0 |
| Audit checklist generator | P1 |
| Compliance score gauge | P1 |
| Progress tracking | P1 |
| Bookmarks + Notes | P1 |
| Responsive design | P1 |

**Deliverable:** Full-featured app

---

## Phase 5: Polish + Documentation (Day 20-23)

| Task | Priority |
|------|----------|
| Expand content to 300+ controls | P0 |
| Write tests | P0 |
| README + setup.sh | P0 |
| LICENSE | P0 |
| Performance optimization | P1 |
| Final stability review | P0 |

**Deliverable:** GitHub-ready project

---

## Content Breakdown

| Framework | Controls | Families |
|-----------|----------|----------|
| NIST 800-53 Rev 5 | 80 | 20 |
| NIST CSF 2.0 | 22 categories + 106 subcategories | 6 functions |
| ISO 27001:2022 | 93 (full Annex A) | 4 themes |
| CIS Controls v8 | 18 + 153 safeguards (top 80) | 18 |
| SOC 2 | 40 | 5 trust criteria |
| PCI DSS 4.0 | 50 | 12 requirements |
| GDPR | 20 key articles | — |
| HIPAA | 20 key rules | — |
| **Total** | **~400+** | — |

Plus: 50 risk scenarios, 15 policies, 150+ cross-mappings
