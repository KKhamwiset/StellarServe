from fastapi import APIRouter
from datetime import datetime, timezone
import uuid

from app.schemas import OrderCreate, OrderResponse, OrderItemResponse

router = APIRouter()

# In-memory storage for orders (will be replaced by database)
orders_store: list[dict] = []

# Map of menu item IDs to their details (for order response)
MENU_ITEM_LOOKUP = {
    "item-001": {"name": "Tonkotsu Ramen", "price": 280.0},
    "item-002": {"name": "Miso Ramen", "price": 260.0},
    "item-003": {"name": "Gyoza (6 pcs)", "price": 120.0},
    "item-004": {"name": "Pad Thai", "price": 180.0},
    "item-005": {"name": "Green Curry", "price": 220.0},
    "item-006": {"name": "Mango Sticky Rice", "price": 140.0},
    "item-007": {"name": "Margherita Pizza", "price": 320.0},
    "item-008": {"name": "Pepperoni Pizza", "price": 350.0},
}

RESTAURANT_NAMES = {
    "rest-001": "Midnight Ramen House",
    "rest-002": "Moonlight Thai Kitchen",
    "rest-003": "Starlight Pizza",
}


@router.post("/", response_model=OrderResponse)
async def create_order(order: OrderCreate):
    """Create a new order."""
    order_id = f"ord-{uuid.uuid4().hex[:8]}"

    # Build order items with details
    items = []
    total = 0.0
    for item in order.items:
        menu_info = MENU_ITEM_LOOKUP.get(item.menu_item_id, {"name": "Unknown", "price": 0})
        subtotal = menu_info["price"] * item.quantity
        total += subtotal
        items.append(
            OrderItemResponse(
                menu_item_id=item.menu_item_id,
                name=menu_info["name"],
                quantity=item.quantity,
                price=menu_info["price"],
                subtotal=subtotal,
            )
        )

    order_data = OrderResponse(
        id=order_id,
        restaurant_id=order.restaurant_id,
        restaurant_name=RESTAURANT_NAMES.get(order.restaurant_id, "Unknown Restaurant"),
        items=items,
        total=total,
        status="pending",
        delivery_address=order.delivery_address,
        phone=order.phone,
        notes=order.notes,
        created_at=datetime.now(timezone.utc),
    )

    orders_store.append(order_data.model_dump())
    return order_data


@router.get("/", response_model=list[OrderResponse])
async def list_orders():
    """List all orders."""
    return orders_store


@router.get("/{order_id}", response_model=OrderResponse | dict)
async def get_order(order_id: str):
    """Get a specific order by ID."""
    for order in orders_store:
        if order["id"] == order_id:
            return order
    return {"error": "Order not found"}
