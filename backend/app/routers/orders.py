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
from .notifications import create_notification

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

    # Auto-assign an available rider
    available_rider = db.query(User).filter(
        User.role == "rider",
        User.is_active == True,
        User.is_available == True
    ).first()

    # Compute final total
    total_price = subtotal + order_in.delivery_fee

    # Create the main order
    new_order = Order(
        id=order_id,
        user_id=current_user.id,
        restaurant_id=order_in.restaurant_id,
        total_price=total_price,
        delivery_fee=order_in.delivery_fee,
        status="pending",
        delivery_address=order_in.delivery_address,
        phone=order_in.phone,
        notes=order_in.notes,
        rider_id=available_rider.id if available_rider else None,
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

    # Send notifications
    restaurant = db.query(Restaurant).filter(Restaurant.id == order_in.restaurant_id).first()
    restaurant_name = restaurant.name if restaurant else "Restaurant"

    # Notify the restaurant owner
    if restaurant and restaurant.owner_id:
        create_notification(
            db,
            user_id=restaurant.owner_id,
            title="New Order Received",
            message=f"You have a new order #{order_id} worth ฿{total_price:.2f}",
            notification_type="new_order",
            order_id=order_id,
        )

    # Notify the assigned rider
    if available_rider:
        create_notification(
            db,
            user_id=available_rider.id,
            title="New Delivery Assigned",
            message=f"You have been assigned to deliver order #{order_id} from {restaurant_name}",
            notification_type="delivery",
            order_id=order_id,
        )

    db.commit()
    
    return _build_order_response(new_order, order_in, db)


@router.get("/", response_model=List[OrderResponse])
async def list_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all orders for current user."""
    orders = db.query(Order).filter(Order.user_id == current_user.id).order_by(Order.created_at.desc()).all()
    
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


@router.get("/rider", response_model=List[OrderResponse])
async def list_rider_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all orders assigned to the current rider."""
    if current_user.role != "rider":
        raise HTTPException(status_code=403, detail="Only riders can access this endpoint")
    
    orders = db.query(Order).filter(
        Order.rider_id == current_user.id
    ).order_by(Order.created_at.desc()).all()
    
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

@router.put("/{order_id}/status", response_model=OrderResponse)
async def update_order_status(
    order_id: str,
    status: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update the status of an order."""
    order = db.query(Order).filter(Order.id == order_id).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    restaurant = db.query(Restaurant).filter(Restaurant.owner_id == current_user.id).first()
    if not restaurant or order.restaurant_id != restaurant.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this order")
        
    order.status = status
    
    # Notify the consumer
    status_labels = {
        "confirmed": "Confirmed",
        "preparing": "Being Prepared",
        "ready": "Ready for Pickup",
        "delivering": "Out for Delivery",
        "delivered": "Delivered",
        "cancelled": "Cancelled",
    }
    label = status_labels.get(status, status.replace("_", " ").title())
    restaurant = db.query(Restaurant).filter(Restaurant.id == order.restaurant_id).first()
    restaurant_name = restaurant.name if restaurant else "Restaurant"

    create_notification(
        db,
        user_id=order.user_id,
        title=f"Order {label}",
        message=f"Your order #{order.id} from {restaurant_name} is now {label.lower()}",
        notification_type="order_update",
        order_id=order.id,
    )

    # Notify the rider if assigned
    if order.rider_id:
        create_notification(
            db,
            user_id=order.rider_id,
            title=f"Order {label}",
            message=f"Order #{order.id} from {restaurant_name} is now {label.lower()}",
            notification_type="order_update",
            order_id=order.id,
        )

    db.commit()
    db.refresh(order)
    
    return _build_order_response(order, None, db)



@router.put("/{order_id}/rider-status", response_model=OrderResponse)
async def update_order_status_by_rider(
    order_id: str,
    status: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update the status of an order by the assigned rider."""
    if current_user.role != "rider":
        raise HTTPException(status_code=403, detail="Only riders can access this endpoint")
    
    order = db.query(Order).filter(Order.id == order_id).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order.rider_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this order")
    
    valid_statuses = ["picked_up", "delivering", "delivered"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Status must be one of: {', '.join(valid_statuses)}")
    
    order.status = status

    # Notify the consumer
    status_labels = {
        "picked_up": "Picked Up",
        "delivering": "Out for Delivery",
        "delivered": "Delivered",
    }
    label = status_labels.get(status, status.replace("_", " ").title())
    restaurant = db.query(Restaurant).filter(Restaurant.id == order.restaurant_id).first()
    restaurant_name = restaurant.name if restaurant else "Restaurant"

    create_notification(
        db,
        user_id=order.user_id,
        title=f"Order {label}",
        message=f"Your order #{order.id} from {restaurant_name} has been {label.lower()} by your rider",
        notification_type="order_update",
        order_id=order.id,
    )

    # Notify the restaurant owner
    if restaurant and restaurant.owner_id:
        create_notification(
            db,
            user_id=restaurant.owner_id,
            title=f"Delivery {label}",
            message=f"Order #{order.id} has been {label.lower()} by the rider",
            notification_type="order_update",
            order_id=order.id,
        )

    db.commit()
    db.refresh(order)
    
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
    
    # Use stored values from DB, fallback to order_in for backward compat
    delivery_address = order.delivery_address or (order_in.delivery_address if order_in else "")
    phone = order.phone or (order_in.phone if order_in else "")
    notes = order.notes or (order_in.notes if order_in else "")

    # Get rider info
    rider_name = None
    rider_phone = None
    if order.rider_id:
        rider = db.query(User).filter(User.id == order.rider_id).first()
        if rider:
            rider_name = rider.full_name or rider.username
            rider_phone = rider.phone

    return OrderResponse(
        id=order.id,
        restaurant_id=order.restaurant_id,
        restaurant_name=restaurant_name,
        delivery_address=delivery_address,
        phone=phone,
        notes=notes,
        status=order.status,
        total=order.total_price,
        delivery_fee=order.delivery_fee or 0,
        items=items_response,
        rider_id=order.rider_id,
        rider_name=rider_name,
        rider_phone=rider_phone,
        customer_name=order.user.full_name,
        created_at=order.created_at
    )
