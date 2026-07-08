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
| Generate NIST 800-53 controls (324 controls in nist_800_53.json) | P0 |
| Write ISO 27001 controls | P0 |
| Create 35 risk scenarios (cloud, AI, supply chain added) | P0 |
| Create cross-framework mappings | P0 |
| Write 10 policy templates (Markdown) | P0 |
| Create phases.json | P0 |
| Write 6 theory lessons (Governance, Risk, Controls, Access Control, Audit Evidence, Cross-Framework Mapping) | P0 |
| Write quiz questions (grc_quiz.json) | P0 |
| NIST, ISO, CIS, SOC 2 controls via bulk_generate scripts | P0 |

**Deliverable:** 324 controls, 35 risks, 10 policies, 6 theory lessons, quiz engine

---

## Phase 2: Backend API (Day 6-9)

| Task | Priority |
|------|----------|
| FastAPI app structure | P0 |
| Frameworks router (frameworks.py) | P0 |
| Controls router (controls.py) | P0 |
| Mappings router (mappings.py) | P0 |
| Risks router (risks.py) | P0 |
| Risk register CRUD | P0 |
| Policies router (policies.py) | P0 |
| Quiz router (quiz.py) — next question, submit answer, stats | P0 |
| Lessons router (lessons.py) — theory content + checkpoints | P0 |
| Progress router (progress.py) | P1 |
| Streak router (streak.py) — XP, level, streak tracking | P0 |
| SQLite setup (user_stats, daily_activity, quiz_history, quiz_seen, progress) | P0 |
| CORS | P0 |

**Deliverable:** Full REST API with quiz engine, lessons, streak/XP system

---

## Phase 3: Frontend Core (Day 10-15)

| Task | Priority |
|------|----------|
| Vite + React + Tailwind v4 | P0 |
| Hyperstudio theme | P0 |
| Sidebar navigation | P0 |
| Dashboard (stats cards, StreakBadge) | P0 |
| Guided Lessons page (Learn.jsx) | P0 |
| Lesson View (LessonView.jsx) — sections, checkpoints, XP | P0 |
| Controls page (Controls.jsx) — search, filter | P0 |
| Risks page (Risks.jsx) — scenarios, risk register | P0 |
| Policies page (Policies.jsx) — Markdown viewer | P1 |
| Quiz page (Quiz.jsx) — session tracking, results | P0 |
| QuizResults component | P0 |
| StreakBadge component (level, XP, streak, daily goal) | P0 |
| ErrorMessage, SkeletonLoader components | P0 |

**Deliverable:** Full interactive frontend

---

## Phase 4: Advanced Features (Day 16-19)

| Task | Priority |
|------|----------|
| XP/Level/Streak system | P0 |
| Theory lesson content expansion (6 files, 40+ sections) | P0 |
| Quiz checkpoint integration in lessons | P0 |
| Streak tracking across all activity (quizzes maintain streak) | P0 |
| Responsive design | P1 |
| Session quiz results with topic/difficulty breakdown | P0 |

**Deliverable:** Gamified learning experience with 40k+ words of theory

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

| Framework | Controls |
|-----------|----------|
| NIST 800-53 Rev 5 | 324 controls (generated via gen_nist_controls.py) |
| ISO 27001 | 93 controls |
| CIS Controls v8 | 18 + safeguards |
| SOC 2 | Trust criteria + controls |

### Theory Lessons (6 lessons, 40 sections, 40k+ words)
| Lesson | Sections |
|--------|----------|
| Phase 1: Governance Fundamentals | 7 sections |
| Phase 2: Risk Management | 7 sections |
| Phase 3: Control Frameworks | 7 sections |
| Access Control | 7 sections |
| Audit Evidence | 6 sections |
| Cross-Framework Mapping | 6 sections |

### Risk Scenarios (35 total)
| Category | Count |
|----------|-------|
| Core security risks | 20 |
| Cloud Security | 5 |
| AI Security | 5 |
| Supply Chain | 5 |

### Quiz System
- Framework-specific questions (NIST, ISO 27001, Risk, Compliance, Audit)
- Session tracking with topic/difficulty breakdown
- Checkpoint questions integrated into lessons
- Low-repetition algorithm (last 80 seen excluded)

### Gamification
- **XP**: Earned only from completing theory lessons (15 XP per lesson)
- **Level**: 10 levels (thresholds: 0, 50, 120, 220, 360, 550, 800, 1100, 1500, 2000 XP)
- **Streak**: Maintained by any activity (lessons + quizzes)
- **Daily Goal**: 50 XP per day
- Quizzes maintain streak but award 0 XP (theory-only progression)
