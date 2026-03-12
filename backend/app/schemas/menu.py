from pydantic import BaseModel
from typing import Optional

class MenuItemBase(BaseModel):
    name: str
    description: str
    price: float
    category: str
    image_url: Optional[str] = None
    is_available: bool = True

class MenuItemCreate(MenuItemBase):
    restaurant_id: str

class MenuItemResponse(MenuItemBase):
    id: str
    restaurant_id: str

    class Config:
        from_attributes = True

class MenuItemSummary(BaseModel):
    name : str
    class Config:
        from_attributes = True