# 🏛️ GRCLearn — Governance, Risk & Compliance Learning Platform

> **Master GRC frameworks, controls, risk management, and compliance — with interactive exploration and policy templates.**

![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi)
![Tests](https://img.shields.io/badge/Tests-15%20passing-brightgreen)
![License](https://img.shields.io/badge/License-MIT-green)

---

## What is this?

GRCLearn is a local-first learning platform for Governance, Risk & Compliance. It covers major compliance frameworks (NIST, ISO 27001, SOC 2, PCI DSS, HIPAA, GDPR, CIS), risk assessment methodologies, policy templates, and audit preparation — all running on your machine.

**For each control, you get:**
- Framework mapping (which standard requires it)
- Implementation guidance
- Audit evidence requirements
- Risk context and impact
- Cross-framework mappings

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📋 Control Explorer | 305 controls across 7 frameworks |
| 🏗️ Framework Browser | NIST 800-53, ISO 27001, SOC 2, PCI DSS, HIPAA, GDPR, CIS v8 |
| ⚠️ Risk Scenarios | 20 real-world risk scenarios with assessment |
| 📝 Policy Templates | 8 ready-to-use policy templates |
| 📖 Theory Modules | 2 chapters on Governance & Risk fundamentals |
| 🧠 Quiz Engine | 28 quiz questions to test knowledge |
| 🔍 Cross-Mapping | See how controls map across frameworks |
| 📊 Progress Tracking | Track your learning journey |
| 🎨 Hyperstudio Theme | Monochrome terminal + amber accents |

---

## 📊 Platform Stats

| Metric | Count |
|--------|-------|
| Controls | 305 |
| Frameworks | 7 |
| Risk Scenarios | 20 |
| Policy Templates | 8 |
| Theory Chapters | 2 |
| Quiz Questions | 28 |
| Automated Tests | 15 |

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
./venv/bin/python -m uvicorn main:app --reload --port 8000

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open **http://localhost:5173**

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS v4 |
| Backend | FastAPI, Python 3.10+ |
| Database | SQLite (progress tracking) |
| Knowledge Base | JSON (controls, frameworks, risks, policies) |
| Design | Hyperstudio — monochrome terminal + amber (#E7C59A) + green (#00AC5C) |

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
| GET | `/api/quiz/questions` | Get quiz questions |
| POST | `/api/quiz/submit` | Submit quiz answers |
| POST | `/api/progress/mark` | Mark item as learned |
| GET | `/api/progress` | Get learning progress |

---

## 📁 Project Structure

```
GRCLearn/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── requirements.txt        # Python dependencies
│   ├── data/
│   │   ├── frameworks/         # Framework JSON files (7 frameworks, 305 controls)
│   │   ├── risks/              # Risk scenarios (20)
│   │   ├── policies/           # Policy templates (8)
│   │   ├── theory/             # Learning chapters (2)
│   │   ├── questions/          # Quiz questions (28)
│   │   ├── mappings.json       # Cross-framework mappings
│   │   └── phases.json         # GRC implementation phases
│   ├── models/                 # Database models
│   ├── routers/                # API route handlers
│   ├── services/               # Business logic
│   └── tests/                  # Test suite (15 tests)
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Page views
│   │   └── styles/             # Tailwind styles
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── data/
│   └── database/               # SQLite database
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

**15 tests passing** — API endpoints, control search, risk register, policy retrieval, audit checklist, progress tracking.

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

Hyperstudio design language:
- Dark monochrome terminal aesthetic
- Amber accent (#E7C59A) for highlights
- Green accent (#00AC5C) for success states
- Minimal, professional, distraction-free

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
