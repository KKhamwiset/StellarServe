from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.schemas.user import UserSummary

class ReviewBase(BaseModel):
    rating: int
    comment: Optional[str] = None

class ReviewCreate(ReviewBase):
    pass


class ReviewResponse(ReviewBase):
    id: int
    user : UserSummary
    restaurant_id: str
    order_id: str
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True