"""Guided lessons router for GRCLearn — wraps theory content + quiz checkpoints."""

from fastapi import APIRouter, Request, HTTPException
from services.stats import award_xp, XP_LESSON_COMPLETE

router = APIRouter()

# Lesson ID → question topic IDs for checkpoints
LESSON_QUESTION_TOPICS = {
    "phase1": ["nist", "iso27001", "compliance"],
    "phase2": ["risk"],
    "audit_evidence": ["audit", "audit_evidence"],
    "access_control": ["compliance", "access_control"],
    "cross_framework_mapping": ["nist", "iso27001", "framework_mapping"],
}


@router.get("")
async def list_lessons(request: Request):
    """List all lessons with section counts and progress."""
    kb = request.app.state.kb
    lessons = []

    for theory in kb.theory:
        phase_id = theory.get("phase_id", theory.get("id", "unknown"))
        sections = theory.get("sections", [])
        # Count checkpoints for this lesson
        lesson_id = f"phase{phase_id}" if isinstance(phase_id, int) else str(phase_id)
        checkpoint_topics = LESSON_QUESTION_TOPICS.get(lesson_id, [])
        checkpoint_count = sum(
            1 for q in kb.questions if q.get("topic_id") in checkpoint_topics
        )
        lessons.append({
            "id": lesson_id,
            "title": theory.get("title", ""),
            "section_count": len(sections),
            "checkpoint_count": checkpoint_count,
            "phase_id": phase_id,
        })

    # Add planned lessons that exist in the mapping but not yet in theory
    existing_ids = {l["id"] for l in lessons}
    planned = {
        "audit_evidence": "Audit Evidence — Collecting, Evaluating, and Presenting Audit Proof",
        "access_control": "Access Control — Managing Identities, Permissions, and Segregation of Duties",
        "cross_framework_mapping": "Cross-Framework Mapping — NIST, ISO, CIS, and Beyond",
    }
    for pid, ptitle in planned.items():
        if pid not in existing_ids:
            lessons.append({
                "id": pid,
                "title": ptitle,
                "section_count": 0,
                "checkpoint_count": 0,
                "phase_id": None,
            })

    return {"lessons": lessons}


@router.get("/{lesson_id}")
async def get_lesson(lesson_id: str, request: Request):
    """Get full lesson content with sections and checkpoint question ids."""
    kb = request.app.state.kb

    # Map lesson_id to theory data
    theory = None
    for t in kb.theory:
        phase_id = t.get("phase_id", t.get("id", ""))
        expected = f"phase{phase_id}" if isinstance(phase_id, int) else str(phase_id)
        if expected == lesson_id:
            theory = t
            break

    if not theory:
        raise HTTPException(404, f"Lesson '{lesson_id}' not found")

    sections = theory.get("sections", [])
    if not sections:
        raise HTTPException(404, f"Lesson '{lesson_id}' has no content yet")

    # Find checkpoint questions for this lesson
    checkpoint_topics = LESSON_QUESTION_TOPICS.get(lesson_id, [])
    checkpoint_question_ids = []
    for q in kb.questions:
        if q.get("topic_id") in checkpoint_topics:
            checkpoint_question_ids.append(q["id"])

    return {
        "id": lesson_id,
        "title": theory.get("title", ""),
        "sections": sections,
        "checkpoint_question_ids": checkpoint_question_ids,
        "checkpoint_topics": checkpoint_topics,
    }


@router.post("/{lesson_id}/complete")
async def complete_lesson(lesson_id: str, request: Request):
    """Mark lesson as complete and award lesson XP."""
    kb = request.app.state.kb

    # Verify lesson exists
    theory = None
    for t in kb.theory:
        phase_id = t.get("phase_id", t.get("id", ""))
        expected = f"phase{phase_id}" if isinstance(phase_id, int) else str(phase_id)
        if expected == lesson_id:
            theory = t
            break

    if not theory:
        raise HTTPException(404, f"Lesson '{lesson_id}' not found")

    # Award XP
    result = award_xp(XP_LESSON_COMPLETE, "lesson")

    # Mark progress
    from models.database import get_connection
    conn = get_connection()
    conn.execute(
        "INSERT OR IGNORE INTO progress (item_id, item_type) VALUES (?, ?)",
        (lesson_id, "lesson")
    )
    conn.commit()
    conn.close()

    return {
        "status": "completed",
        "xp_awarded": XP_LESSON_COMPLETE,
        **result,
    }
