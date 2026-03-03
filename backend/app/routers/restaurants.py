from fastapi import APIRouter
from app.schemas import RestaurantResponse

router = APIRouter()

# Mock data for initial development
MOCK_RESTAURANTS = [
    {
        "id": "rest-001",
        "name": "Midnight Ramen House",
        "description": "Authentic Japanese ramen served fresh through the night",
        "cuisine_type": "Japanese",
        "address": "123 Night Market St",
        "phone": "+66-2-123-4567",
        "image_url": None,
        "rating": 4.7,
        "is_open": True,
        "opening_time": "18:00",
        "closing_time": "04:00",
        "created_at": "2026-01-01T18:00:00",
    },
    {
        "id": "rest-002",
        "name": "Moonlight Thai Kitchen",
        "description": "Late-night Thai street food favorites",
        "cuisine_type": "Thai",
        "address": "456 Soi Midnight",
        "phone": "+66-2-987-6543",
        "image_url": None,
        "rating": 4.5,
        "is_open": True,
        "opening_time": "20:00",
        "closing_time": "05:00",
        "created_at": "2026-01-15T20:00:00",
    },
    {
        "id": "rest-003",
        "name": "Starlight Pizza",
        "description": "Wood-fired pizzas under the stars",
        "cuisine_type": "Italian",
        "address": "789 Luna Ave",
        "phone": "+66-2-555-0123",
        "image_url": None,
        "rating": 4.3,
        "is_open": False,
        "opening_time": "19:00",
        "closing_time": "02:00",
        "created_at": "2026-02-01T19:00:00",
    },
]


@router.get("/", response_model=list[RestaurantResponse])
async def list_restaurants():
    """List all available restaurants."""
    return MOCK_RESTAURANTS


@router.get("/{restaurant_id}", response_model=RestaurantResponse)
async def get_restaurant(restaurant_id: str):
    """Get a specific restaurant by ID."""
    for restaurant in MOCK_RESTAURANTS:
        if restaurant["id"] == restaurant_id:
            return restaurant
    return {"error": "Restaurant not found"}
