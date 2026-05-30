from fastapi import APIRouter, Request, Query, HTTPException
from typing import Optional
router = APIRouter()

@router.get("")
async def list_controls(request: Request, framework: Optional[str] = None, family: Optional[str] = None, limit: int = Query(default=50, le=500), offset: int = 0):
    kb = request.app.state.kb
    results = kb.filter_controls(framework=framework, family=family)
    return {"controls": results[offset:offset+limit], "total": len(results)}

@router.get("/search")
async def search_controls(request: Request, q: str = ""):
    if len(q) < 2:
        return {"controls": [], "total": 0}
    results = request.app.state.kb.search_controls(q)
    return {"controls": results[:50], "total": len(results)}

@router.get("/families")
async def list_families(request: Request, framework: Optional[str] = None):
    return {"families": request.app.state.kb.get_families(framework)}

@router.get("/{control_id}")
async def get_control(request: Request, control_id: str):
    ctrl = request.app.state.kb.get_control(control_id)
    if not ctrl:
        raise HTTPException(404, "Control not found")
    return ctrl
