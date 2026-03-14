from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from .user import UserSummary
from .restaurant import RestaurantResponse

class FavoriteBase(BaseModel):
    user_id: int
    restaurant_id: str

class FavoriteCreate(FavoriteBase):
    pass

class FavoriteResponse(FavoriteBase):
    id: int
    created_at: datetime
    user: UserSummary
    restaurant: RestaurantResponse

    class Config:
        from_attributes = True
