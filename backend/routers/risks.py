from fastapi import APIRouter, Request
from models.database import get_connection
from pydantic import BaseModel
from typing import Optional
router = APIRouter()

class RiskEntry(BaseModel):
    name: str
    category: Optional[str] = None
    description: Optional[str] = None
    likelihood: int
    impact: int
    treatment: str
    treatment_plan: Optional[str] = None
    owner: Optional[str] = None

@router.get("")
async def list_risk_scenarios(request: Request):
    return {"risks": request.app.state.kb.risks, "total": len(request.app.state.kb.risks)}

@router.get("/register")
async def get_risk_register():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM risk_register ORDER BY (likelihood * impact) DESC").fetchall()
    conn.close()
    return {"entries": [dict(r) for r in rows]}

@router.post("/register")
async def add_risk(body: RiskEntry):
    score = body.likelihood * body.impact
    level = "Critical" if score >= 16 else "High" if score >= 10 else "Medium" if score >= 5 else "Low"
    conn = get_connection()
    conn.execute(
        "INSERT INTO risk_register (name, category, description, likelihood, impact, risk_level, treatment, treatment_plan, owner) VALUES (?,?,?,?,?,?,?,?,?)",
        (body.name, body.category, body.description, body.likelihood, body.impact, level, body.treatment, body.treatment_plan, body.owner)
    )
    conn.commit()
    conn.close()
    return {"status": "added", "risk_level": level, "risk_score": score}
