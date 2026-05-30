from fastapi import APIRouter, Request
router = APIRouter()

@router.get("/{control_id}")
async def get_mapping(request: Request, control_id: str):
    mapping = request.app.state.kb.get_mapping(control_id)
    return {"control_id": control_id, "mappings": mapping}
