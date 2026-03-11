from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timezone
import uuid
from typing import List

from app.database import get_db
from app.models.user import User
from app.models.cart import Cart, CartItem
from app.models.order import Order, OrderItem
from app.models.restaurant import Restaurant, MenuItem
from app.schemas.order import OrderCreate, OrderResponse, OrderItemResponse
from .auth import get_current_user

router = APIRouter()


@router.post("/", response_model=OrderResponse)
async def create_order_from_cart(
    order_in: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new order from current cart (Checkout)."""
    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()
    
    if not cart or not cart.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    cart_items_for_restaurant = [item for item in cart.items if item.restaurant_id == order_in.restaurant_id]
    
    if not cart_items_for_restaurant:
        raise HTTPException(status_code=400, detail="No cart items found for the specified restaurant")

    order_id = f"ord-{uuid.uuid4().hex[:8]}"
    
    # Calculate total and prepare items using DB models
    total_price = 0.0
    new_order_items = []
    
    for cart_item in cart_items_for_restaurant:
        menu_item = db.query(MenuItem).filter(MenuItem.id == cart_item.menu_item_id).first()
        if not menu_item:
            raise HTTPException(status_code=404, detail=f"Menu item {cart_item.menu_item_id} not found")
            
        subtotal = menu_item.price * cart_item.quantity
        total_price += subtotal
        
        order_item = OrderItem(
            order_id=order_id,
            menu_item_id=menu_item.id,
            quantity=cart_item.quantity,
            price_at_purchase=menu_item.price
        )
        new_order_items.append(order_item)

    # Create the main order
    new_order = Order(
        id=order_id,
        user_id=current_user.id,
        restaurant_id=order_in.restaurant_id,
        total_price=total_price,
        status="pending",
    )

    db.add(new_order)
    db.add_all(new_order_items)
    
    # Clear the cart items for the specific restaurant
    db.query(CartItem).filter(
        CartItem.cart_id == cart.id,
        CartItem.restaurant_id == order_in.restaurant_id
    ).delete()
    
    db.commit()
    db.refresh(new_order)
    
    return _build_order_response(new_order, order_in, db)


@router.get("/", response_model=List[OrderResponse])
async def list_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all orders for current user."""
    orders = db.query(Order).filter(Order.user_id == current_user.id).all()
    
    response_list = []
    for order in orders:
        response_list.append(_build_order_response(order, None, db))
        
    return response_list


@router.get("/seller", response_model=List[OrderResponse])
async def list_seller_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all orders for the current seller's restaurant."""
    restaurant = db.query(Restaurant).filter(Restaurant.owner_id == current_user.id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="No restaurant found for this seller")

    orders = db.query(Order).filter(Order.restaurant_id == restaurant.id).order_by(Order.created_at.desc()).all()

    response_list = []
    for order in orders:
        response_list.append(_build_order_response(order, None, db))

    return response_list


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific order by ID."""
    order = db.query(Order).filter(Order.id == order_id).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    if order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this order")
        
    return _build_order_response(order, None, db)


def _build_order_response(order: Order, order_in: OrderCreate, db: Session) -> OrderResponse:
    """Helper to populate nested OrderResponse."""
    restaurant = db.query(Restaurant).filter(Restaurant.id == order.restaurant_id).first()
    restaurant_name = restaurant.name if restaurant else "Unknown Restaurant"
    
    items_response = []
    for item in order.items:
        menu_item = db.query(MenuItem).filter(MenuItem.id == item.menu_item_id).first()
        items_response.append(
            OrderItemResponse(
                menu_item_id=item.menu_item_id,
                name=menu_item.name if menu_item else "Unknown",
                quantity=item.quantity,
                price=item.price_at_purchase,
                subtotal=item.price_at_purchase * item.quantity
            )
        )
        
    delivery_address = order_in.delivery_address if order_in else ""
    phone = order_in.phone if order_in else ""
    notes = order_in.notes if order_in else ""

    return OrderResponse(
        id=order.id,
        restaurant_id=order.restaurant_id,
        restaurant_name=restaurant_name,
        delivery_address=delivery_address,
        phone=phone,
        notes=notes,
        status=order.status,
        total=order.total_price,
        items=items_response,
        created_at=order.created_at
    )
