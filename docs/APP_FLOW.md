# Application Flow
## GRCLearn — Governance, Risk & Compliance Learning Platform

---

## 1. Navigation

```
┌─────────────────────────────────────────────────────────────┐
│  Sidebar (fixed)                │  Main Content              │
│                                 │                            │
│  🛡️  GRCLearn                   │                            │
│                                 │                            │
│  📊 Dashboard                   │  (varies by route)         │
│  📖 Guided Lessons              │                            │
│  🔒 Controls                   │                            │
│  ⚠️  Risk Management            │                            │
│  📄 Policies                    │                            │
│  ❓ Quiz                        │                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Key Pages

### Dashboard
- Stats cards (Lessons, Controls, Risks, Policies, Frameworks)
- StreakBadge component (level, XP, streak, daily goal)
- Quick links to all sections

### Guided Lessons (Learn)
- List of GRC lessons: Governance, Risk, Controls, Access Control, Audit Evidence, Cross-Framework Mapping
- Each lesson shows section count and checkpoint question count
- Lesson View with step-by-step sections → checkpoint quizzes between sections
- Lesson completion awards XP (15 XP per lesson)
- Level-up progression (10 levels max)

### Control Library
- Browse NIST 800-53 controls (324 controls)
- Search by keywords
- Filter by family
- Control detail: description, implementation guidance, audit evidence, mappings, risks addressed
- Progress tracking (mark as learned)

### Risk Management
- 35 pre-built risk scenarios (core + cloud + AI + supply chain)
- Risk register CRUD (add custom risks with scoring)
- Risk scoring: Likelihood × Impact (1-5 each → 1-25)
- Risk heat map visualization
- Treatment options: Accept, Mitigate, Transfer, Avoid

### Policy Library
- List of security policy templates
- Click → rendered Markdown with proper heading hierarchy
- Policies: Access Control, Password, Incident Response, Vendor Management, etc.

### Knowledge Quiz
- Framework-specific quiz sessions (NIST, ISO 27001, Risk, Compliance, Audit)
- Question types: theory, scenario, command
- Session tracking with topic & difficulty breakdown
- QuizResults component shows detailed review
- Streak maintained by quiz activity (no XP awarded for quizzes)

---

## 3. Gamification System

### XP (Experience Points)
- Earned ONLY from completing theory lessons (15 XP per lesson)
- Not awarded for quizzes
- Shows in StreakBadge and lesson completion screen

### Level System
- 10 levels (max at 2000 XP)
- Level thresholds: [0, 50, 120, 220, 360, 550, 800, 1100, 1500, 2000]
- Derived purely from cumulative XP

### Streak
- Maintained by any activity (lessons + quizzes)
- Same day = no streak increase
- Consecutive days = streak +1
- Gap = streak resets to 1
- Longest streak tracked (never decreases)

### Daily Goal
- 50 XP per day target
- Progress bar in StreakBadge
- "Goal met" status tracked

---

## 4. Risk Heat Map

```
         Impact →
    L  │ 1  │ 2  │ 3  │ 4  │ 5  │
    i  ├────┼────┼────┼────┼────┤
    k  │ 🟢 │ 🟢 │ 🟡 │ 🟡 │ 🟠 │  1
    e  │ 🟢 │ 🟡 │ 🟡 │ 🟠 │ 🟠 │  2
    l  │ 🟡 │ 🟡 │ 🟠 │ 🟠 │ 🔴 │  3
    i  │ 🟡 │ 🟠 │ 🟠 │ 🔴 │ 🔴 │  4
    h  │ 🟠 │ 🟠 │ 🔴 │ 🔴 │ 🔴 │  5
    ↓  └────┴────┴────┴────┴────┘
```

Colors: Green (Low 1-4), Yellow (Medium 5-9), Orange (High 10-15), Red (Critical 16-25)
