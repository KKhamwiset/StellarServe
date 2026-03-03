from fastapi import APIRouter
from app.schemas import MenuItemResponse

router = APIRouter()

# Mock menu data
MOCK_MENUS: dict[str, list[dict]] = {
    "rest-001": [
        {
            "id": "item-001",
            "restaurant_id": "rest-001",
            "name": "Tonkotsu Ramen",
            "description": "Rich pork bone broth with chashu, egg, and nori",
            "price": 280.0,
            "category": "Ramen",
            "image_url": None,
            "is_available": True,
        },
        {
            "id": "item-002",
            "restaurant_id": "rest-001",
            "name": "Miso Ramen",
            "description": "Fermented soybean broth with corn and butter",
            "price": 260.0,
            "category": "Ramen",
            "image_url": None,
            "is_available": True,
        },
        {
            "id": "item-003",
            "restaurant_id": "rest-001",
            "name": "Gyoza (6 pcs)",
            "description": "Pan-fried pork dumplings",
            "price": 120.0,
            "category": "Sides",
            "image_url": None,
            "is_available": True,
        },
    ],
    "rest-002": [
        {
            "id": "item-004",
            "restaurant_id": "rest-002",
            "name": "Pad Thai",
            "description": "Classic stir-fried rice noodles with shrimp",
            "price": 180.0,
            "category": "Noodles",
            "image_url": None,
            "is_available": True,
        },
        {
            "id": "item-005",
            "restaurant_id": "rest-002",
            "name": "Green Curry",
            "description": "Spicy green curry with chicken and Thai basil",
            "price": 220.0,
            "category": "Curry",
            "image_url": None,
            "is_available": True,
        },
        {
            "id": "item-006",
            "restaurant_id": "rest-002",
            "name": "Mango Sticky Rice",
            "description": "Sweet coconut sticky rice with fresh mango",
            "price": 140.0,
            "category": "Dessert",
            "image_url": None,
            "is_available": True,
        },
    ],
    "rest-003": [
        {
            "id": "item-007",
            "restaurant_id": "rest-003",
            "name": "Margherita Pizza",
            "description": "San Marzano tomatoes, mozzarella, fresh basil",
            "price": 320.0,
            "category": "Pizza",
            "image_url": None,
            "is_available": True,
        },
        {
            "id": "item-008",
            "restaurant_id": "rest-003",
            "name": "Pepperoni Pizza",
            "description": "Classic pepperoni with mozzarella",
            "price": 350.0,
            "category": "Pizza",
            "image_url": None,
            "is_available": True,
        },
    ],
}


@router.get("/{restaurant_id}", response_model=list[MenuItemResponse])
async def get_menu(restaurant_id: str):
    """Get menu items for a specific restaurant."""
    items = MOCK_MENUS.get(restaurant_id, [])
    return items


@router.get("/{restaurant_id}/{item_id}", response_model=MenuItemResponse | dict)
async def get_menu_item(restaurant_id: str, item_id: str):
    """Get a specific menu item."""
    items = MOCK_MENUS.get(restaurant_id, [])
    for item in items:
        if item["id"] == item_id:
            return item
    return {"error": "Menu item not found"}
