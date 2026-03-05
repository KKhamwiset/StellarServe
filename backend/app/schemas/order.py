from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class OrderItemBase(BaseModel):
    menu_item_id: str
    quantity: int

class OrderItemCreate(OrderItemBase):
    pass

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
