from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.schemas.menu import MenuItemSummary

class OrderItemBase(BaseModel):
    menu_item_id: str
    quantity: int

class OrderItemCreate(OrderItemBase):
    pass

class OrderItemSummary(OrderItemBase):
    menu_item: MenuItemSummary
    class Config:
        from_attributes = True

class OrderSummaryForReview(BaseModel):
    items : List[OrderItemSummary]
    class Config:
        from_attributes = True

class OrderItemResponse(OrderItemBase):
    name: str
    price: float
    subtotal: float

    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    restaurant_id: str
    delivery_address: str
    phone: str
    notes: Optional[str] = None

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

class OrderResponse(OrderBase):
    id: str
    restaurant_name: str
    items: List[OrderItemResponse]
    total: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
