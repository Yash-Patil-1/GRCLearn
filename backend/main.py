"""
GRCLearn — Governance, Risk & Compliance Learning Platform
FastAPI Backend

Author: Yash Patil
Local-first. No cloud. Educational only.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

import logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')
logger = logging.getLogger(__name__)

from routers import frameworks, controls, risks, policies, audit, progress, quiz, streak, lessons
from models.database import init_db
from services.knowledge_base import GRCKnowledgeBase
from services.quiz_engine import QuizEngine


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Loading GRCLearn knowledge base...")
    app.state.kb = GRCKnowledgeBase()
    app.state.kb.load()
    logger.info("Loaded %d controls, %d risks, %d frameworks", app.state.kb.control_count, app.state.kb.risk_count, app.state.kb.framework_count)
    app.state.quiz_engine = QuizEngine(app.state.kb.questions if hasattr(app.state.kb, 'questions') else [])
    await init_db()
    logger.info("Database initialized.")
    yield
    logger.info("Shutting down GRCLearn.")


app = FastAPI(
    title="GRCLearn",
    description="Governance, Risk & Compliance Learning Platform",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(frameworks.router, prefix="/api/frameworks", tags=["Frameworks"])
app.include_router(controls.router, prefix="/api/controls", tags=["Controls"])
app.include_router(risks.router, prefix="/api/risks", tags=["Risks"])
app.include_router(policies.router, prefix="/api/policies", tags=["Policies"])
app.include_router(audit.router, prefix="/api/audit", tags=["Audit"])
app.include_router(progress.router, prefix="/api/progress", tags=["Progress"])
app.include_router(quiz.router, prefix="/api/quiz", tags=["Quiz"])
app.include_router(streak.router, prefix="/api/streak", tags=["Streak"])
app.include_router(lessons.router, prefix="/api/lessons", tags=["Lessons"])


@app.get("/")
async def root():
    return {"name": "GRCLearn", "version": "1.0.0", "author": "Yash Patil"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
