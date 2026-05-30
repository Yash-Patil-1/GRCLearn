from fastapi import APIRouter, Request
router = APIRouter()

@router.get("")
async def list_frameworks(request: Request):
    return {"frameworks": request.app.state.kb.frameworks}
