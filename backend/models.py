from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class User(BaseModel):
    username: str = Field(..., min_length=1)
    password: str = Field(..., min_length=1)  

class UserInDB(User):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class Companion(BaseModel):
    name: str = Field(..., example="Deniise")
    personality: str = Field(..., example="Friendly emotional support coach")
    language: str = Field("English", example="English")
    
    # Added these for response
    id: Optional[str] = None
    user_id: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
    

class Conversation(BaseModel):
    companion_id: str
    message: str  # User message; in real app, integrate AI response
    timestamp: datetime = Field(default_factory=datetime.utcnow)