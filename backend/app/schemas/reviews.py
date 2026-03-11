from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ReviewBase(BaseModel):
    rating: int
    comment: Optional[str] = None

class ReviewCreate(ReviewBase):
    restaurant_id: str

from app.schemas.user import UserResponse

class ReviewResponse(ReviewBase):
    id: int
    user_id: int
    user: UserResponse
    restaurant_id: str
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True