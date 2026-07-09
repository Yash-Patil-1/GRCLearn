# 🏛️ GRCLearn — Governance, Risk & Compliance Learning Platform

> **Master GRC frameworks, controls, risk management, and compliance — with interactive exploration, guided lessons, and policy templates.**

![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi)
![Tests](https://img.shields.io/badge/Tests-28%20passing-brightgreen)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🖼️ Screenshots

| Dashboard & Streak | Lesson Viewer | Quiz Engine |
|:--:|:--:|:--:|
| ![Dashboard](https://raw.githubusercontent.com/Yash-Patil-1/GRCLearn/main/docs/screenshots/grclearn-dashboard.png) | ![Lesson](https://raw.githubusercontent.com/Yash-Patil-1/GRCLearn/main/docs/screenshots/grclearn-lesson.png) | ![Quiz](https://raw.githubusercontent.com/Yash-Patil-1/GRCLearn/main/docs/screenshots/grclearn-quiz.png) |

| Control Library | Risk Management | Policy Templates |
|:--:|:--:|:--:|
| ![Controls](https://raw.githubusercontent.com/Yash-Patil-1/GRCLearn/main/docs/screenshots/grclearn-controls.png) | ![Risks](https://raw.githubusercontent.com/Yash-Patil-1/GRCLearn/main/docs/screenshots/grclearn-risks.png) | ![Policies](https://raw.githubusercontent.com/Yash-Patil-1/GRCLearn/main/docs/screenshots/grclearn-policies.png) |

> **Note:** Screenshots are stored in `docs/screenshots/` for local reference.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📋 **Control Explorer** | 305 controls across 7 frameworks with search, filter, and family grouping |
| 🏗️ **Framework Browser** | NIST 800-53, ISO 27001, SOC 2, PCI DSS, HIPAA, GDPR, CIS v8 |
| ⚠️ **Risk Scenarios** | 20 real-world risk scenarios with assessment and registration |
| 📝 **Policy Templates** | 8 ready-to-use policy templates with full content |
| 📖 **Guided Lessons** | Step-by-step theory chapters with checkpoints, progress tracking, and XP rewards |
| 🧠 **Quiz Engine** | 43 quiz questions across 8 topic areas with scoring and streak tracking |
| 🔍 **Cross-Mapping** | See how controls map across frameworks |
| 📊 **Progress Tracking** | XP, streaks, daily goals, and learning progress |
| 🏆 **Gamification** | Levels, streaks, checkpoints, and daily goals keep you motivated |
| 🎨 **Aston Martin Theme** | Light theme — Racing Green, Bone White, Champagne Gold |

---

## 📊 Platform Stats

| Metric | Count |
|--------|-------|
| Controls | 305 |
| Frameworks | 7 |
| Risk Scenarios | 20 |
| Policy Templates | 8 |
| Theory Chapters / Lessons | 5 |
| Quiz Questions | 43 |
| Automated Tests | 28 |

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/Yash-Patil-1/GRCLearn.git
cd GRCLearn

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Frontend setup
cd ../frontend
npm install
```

### Running the Application

```bash
# Terminal 1 — Backend
cd backend
./venv/bin/python -m uvicorn main:app --reload --port 8001

# Terminal 2 — Frontend
cd frontend
npm run dev    # Starts on http://localhost:5174
```

Open **http://localhost:5174**

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5, Tailwind CSS v4, Lucide Icons, Recharts |
| Backend | FastAPI, Python 3.10+ |
| Database | SQLite (progress, streaks, XP) |
| Knowledge Base | JSON (controls, frameworks, risks, policies, lessons, questions) |
| Design | **Aston Martin** — Racing Green (#004D2B), Bone White (#F4EFE6), Champagne Gold (#C9A96E), Charcoal (#2C2C2C) |

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Platform info |
| GET | `/health` | Health check |
| GET | `/api/frameworks` | List all frameworks |
| GET | `/api/controls` | List controls (with search/filter) |
| GET | `/api/controls/{id}` | Get control details |
| GET | `/api/controls/families` | Control families |
| GET | `/api/risks` | List risk scenarios |
| POST | `/api/risks/register` | Add to risk register |
| GET | `/api/policies` | List policy templates |
| GET | `/api/policies/{id}` | Get policy content |
| GET | `/api/audit/checklist` | Audit preparation checklist |
| GET | `/api/lessons` | List guided lessons with checkpoint counts |
| GET | `/api/lessons/{id}` | Get lesson content with sections |
| GET | `/api/quiz/next` | Get next quiz question |
| POST | `/api/quiz/answer` | Submit quiz answer |
| GET | `/api/quiz/question/{id}` | Get checkpoint question by ID |
| GET | `/api/quiz/stats` | Quiz performance stats |
| GET | `/api/streak` | XP, streak, level, daily goal |
| POST | `/api/progress/mark` | Mark item as learned |
| GET | `/api/progress` | Get learning progress |

---

## 📁 Project Structure

```
GRCLearn/
├── backend/
│   ├── main.py                   # FastAPI application
│   ├── requirements.txt          # Python dependencies
│   ├── data/
│   │   ├── frameworks/           # Framework JSON files (7 frameworks, 305 controls)
│   │   ├── risks/                # Risk scenarios (20)
│   │   ├── policies/             # Policy templates (8)
│   │   ├── theory/               # Learning chapters (5 lessons)
│   │   ├── questions/            # Quiz questions (43)
│   │   ├── mappings.json         # Cross-framework mappings
│   │   └── phases.json           # GRC implementation phases
│   ├── models/                   # Database models
│   ├── routers/                  # API route handlers
│   ├── services/                 # Business logic
│   └── tests/                    # Test suite (28 tests)
├── frontend/
│   ├── src/
│   │   ├── components/           # React components (Sidebar, StreakBadge, etc.)
│   │   ├── pages/                # Page views (Dashboard, Learn, Quiz, etc.)
│   │   └── styles/               # Tailwind CSS with Aston Martin theme tokens
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── docs/
│   ├── screenshots/              # UI screenshots
│   └── ...                       # Design docs, PRD, TRD, plans
├── data/
│   └── database/                 # SQLite database
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🧪 Testing

```bash
cd backend
./venv/bin/python -m pytest tests/ -v
```

**28 tests passing** — API endpoints, control search, risk register, policy retrieval, audit checklist, quiz engine, progress tracking, streak system, lessons.

---

## 📖 Frameworks Covered

| Framework | Focus Area |
|-----------|-----------|
| NIST 800-53 | Federal information security controls |
| ISO 27001 | Information security management system |
| SOC 2 | Service organization trust criteria |
| PCI DSS | Payment card data security |
| HIPAA | Healthcare data protection |
| GDPR | EU data privacy regulation |
| CIS v8 | Critical security controls |

---

## 🎨 Design

**Aston Martin Design Language:**
- **Light theme** with bone-white (#F4EFE6) backgrounds
- **Racing Green** (#004D2B) as primary brand color
- **Champagne Gold** (#C9A96E) for accents and highlights
- **Warm Gray** (#8C8273) for secondary text
- **British Red** (#A52A2A) for errors and warnings
- Clean, editorial spacing with generous whitespace
- Elegant hover transitions and micro-interactions

---

## 🔒 Important

This is an **educational platform**. It does NOT:
- Perform actual compliance audits
- Generate legally binding policies
- Replace professional GRC consultants
- Use external AI APIs
- Require cloud or VMs

It teaches GRC concepts, explains frameworks, and builds understanding. Everything runs locally.

---

## 👤 Author

**Yash Patil** — B.Tech IT | CEH  
🌐 [yashpatil.online](https://www.yashpatil.online/) · 🐙 [GitHub](https://github.com/Yash-Patil-1) · 💼 [LinkedIn](https://www.linkedin.com/in/yash-patil-997357330/)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
