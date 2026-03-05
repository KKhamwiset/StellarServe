from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class RestaurantBase(BaseModel):
    name: str
    description: str
    cuisine_type: str
    address: str
    phone: str
    image_url: Optional[str] = None
    rating: float = 0.0
    is_open: bool = True
    opening_time: str
    closing_time: str

class RestaurantCreate(RestaurantBase):
    pass

class RestaurantResponse(RestaurantBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True
