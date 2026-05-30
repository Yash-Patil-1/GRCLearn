from fastapi import APIRouter, Request, HTTPException
router = APIRouter()

@router.get("")
async def list_policies(request: Request):
    return {"policies": request.app.state.kb.policies}

@router.get("/{policy_id}")
async def get_policy(request: Request, policy_id: str):
    content = request.app.state.kb.get_policy_content(policy_id)
    if content is None:
        raise HTTPException(404, "Policy not found")
    return {"id": policy_id, "content": content}
