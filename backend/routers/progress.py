from fastapi import APIRouter, Request
from models.database import get_connection
from pydantic import BaseModel
router = APIRouter()

class ProgressMark(BaseModel):
    item_id: str
    item_type: str = "control"

@router.get("")
async def get_progress(request: Request):
    kb = request.app.state.kb
    conn = get_connection()
    learned = conn.execute("SELECT COUNT(*) as c FROM progress").fetchone()["c"]
    conn.close()
    total = kb.control_count
    return {"total": total, "learned": learned, "percentage": round(learned/total*100, 1) if total else 0}

@router.post("/mark")
async def mark_learned(body: ProgressMark):
    conn = get_connection()
    conn.execute("INSERT OR IGNORE INTO progress (item_id, item_type) VALUES (?,?)", (body.item_id, body.item_type))
    conn.commit()
    conn.close()
    return {"status": "marked"}
