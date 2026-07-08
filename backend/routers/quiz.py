"""Quiz router — scenario questions, control knowledge, low repetition."""
from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from models.database import get_connection
from services.stats import award_xp, XP_QUIZ_CORRECT

router = APIRouter()


class AnswerSubmit(BaseModel):
    question_id: str
    framework: str
    answer: str


@router.get("/next")
async def get_next_question(request: Request, framework: str):
    """Get next quiz question for a framework (respects repetition rules)."""
    conn = get_connection()
    rows = conn.execute(
        "SELECT question_id FROM quiz_seen WHERE framework = ? ORDER BY seen_at DESC",
        (framework,)
    ).fetchall()
    seen_ids = [r["question_id"] for r in rows]
    conn.close()

    question = request.app.state.quiz_engine.get_next_question(framework, seen_ids)
    if not question:
        raise HTTPException(404, "No questions available for this framework")

    conn = get_connection()
    conn.execute("INSERT INTO quiz_seen (framework, question_id) VALUES (?, ?)", (framework, question["id"]))
    conn.commit()
    conn.close()

    return {
        "id": question["id"],
        "framework": question.get("topic_id", framework),
        "type": question["type"],
        "difficulty": question["difficulty"],
        "question": question["question"],
        "hints": question.get("hints", []),
    }


@router.get("/question/{question_id}")
async def get_question(question_id: str, request: Request):
    """Get a single question by ID (for lesson checkpoints, no seen tracking)."""
    for q in request.app.state.kb.questions:
        if q["id"] == question_id:
            return {
                "id": q["id"],
                "topic_id": q.get("topic_id", "general"),
                "type": q.get("type", "theory"),
                "difficulty": q.get("difficulty", "medium"),
                "question": q["question"],
                "hints": q.get("hints", []),
            }
    raise HTTPException(404, "Question not found")


@router.post("/answer")
async def submit_answer(request: Request, body: AnswerSubmit):
    """Submit answer and get validation result."""
    questions = [q for q in request.app.state.kb.questions if q.get("topic_id") == body.framework]
    question = next((q for q in questions if q["id"] == body.question_id), None)
    if not question:
        raise HTTPException(404, "Question not found")

    result = request.app.state.quiz_engine.validate_answer(question, body.answer)

    conn = get_connection()
    conn.execute(
        "INSERT INTO quiz_history (question_id, framework, correct, user_answer) VALUES (?, ?, ?, ?)",
        (body.question_id, body.framework, 1 if result["correct"] else 0, body.answer)
    )
    conn.commit()
    conn.close()

    # Award XP if correct
    xp_result = {}
    if result["correct"]:
        xp_result = award_xp(XP_QUIZ_CORRECT, "quiz")

    return {**result, "xp_awarded": XP_QUIZ_CORRECT if result["correct"] else 0, **xp_result}


@router.get("/stats")
async def get_quiz_stats(request: Request, framework: str = None):
    """Get quiz performance stats."""
    conn = get_connection()
    if framework:
        total = conn.execute("SELECT COUNT(*) as c FROM quiz_history WHERE framework = ?", (framework,)).fetchone()["c"]
        correct = conn.execute("SELECT COUNT(*) as c FROM quiz_history WHERE framework = ? AND correct = 1", (framework,)).fetchone()["c"]
    else:
        total = conn.execute("SELECT COUNT(*) as c FROM quiz_history").fetchone()["c"]
        correct = conn.execute("SELECT COUNT(*) as c FROM quiz_history WHERE correct = 1").fetchone()["c"]
    conn.close()
    return {"total_answered": total, "correct": correct, "accuracy": round(correct / total * 100, 1) if total else 0}
