# Companion REST Endpoints

from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from bson import ObjectId
from ..models import Companion
from ..database import db
from ..auth import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/companions", tags=["companions"])

class MessageRequest(BaseModel):
    message: str
    
@router.post("/", response_model=Companion, status_code=status.HTTP_201_CREATED)
async def create_companion(
    companion: Companion,
    current_user: str = Depends(get_current_user)
):
    companion_dict = companion.dict()
    companion_dict["user_id"] = current_user
    companion_dict["created_at"] = datetime.utcnow()

    result = db.companions.insert_one(companion_dict)
    
    # Create a new copy with the MongoDB _id added as "id"
    created_companion = companion_dict.copy()
    created_companion["id"] = str(result.inserted_id)
    
    return created_companion

@router.get("/", response_model=List[Companion])
async def get_companions(current_user: str = Depends(get_current_user)):
    companions = list(db.companions.find({"user_id": current_user}))
    for comp in companions:
        comp["id"] = str(comp["_id"])
        del comp["_id"]
    return companions

from fastapi import Form


@router.post("/{companion_id}/converse")
async def start_conversation(
    companion_id: str,
    request: MessageRequest,                      # ← Accepts JSON body
    current_user: str = Depends(get_current_user)
):
    if not ObjectId.is_valid(companion_id):
        raise HTTPException(status_code=400, detail="Invalid companion_id")

    companion = db.companions.find_one({
        "_id": ObjectId(companion_id),
        "user_id": current_user
    })
    if not companion:
        raise HTTPException(status_code=404, detail="Companion not found")

    user_message = request.message
    mock_response = f"AI Companion {companion.get('name', 'Friend')} says: I hear you ❤️ You said: {user_message}"

    db.conversations.insert_one({
        "companion_id": companion_id,
        "user_id": current_user,
        "message": user_message,
        "response": mock_response,
        "timestamp": datetime.utcnow()
    })

    return {"response": mock_response}