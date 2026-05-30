from fastapi import APIRouter, Request
from typing import Optional
router = APIRouter()

@router.get("/checklist")
async def generate_checklist(request: Request, framework: Optional[str] = None):
    """Generate audit checklist from controls."""
    kb = request.app.state.kb
    controls = kb.filter_controls(framework=framework) if framework else kb.controls[:30]
    checklist = [
        {"control_id": c["control_id"], "name": c["name"], "family": c["family"],
         "evidence_required": c.get("audit_evidence", []), "status": "not_assessed"}
        for c in controls
    ]
    return {"checklist": checklist, "total": len(checklist), "framework": framework}
