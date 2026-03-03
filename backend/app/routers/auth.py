from fastapi import APIRouter

router = APIRouter()


@router.post("/register", response_model=dict)
async def register():
    """Register a new user (placeholder)."""
    return {"message": "Registration endpoint — coming soon"}


@router.post("/login", response_model=dict)
async def login():
    """Login and get access token (placeholder)."""
    return {"message": "Login endpoint — coming soon"}


@router.get("/me", response_model=dict)
async def get_current_user():
    """Get current authenticated user (placeholder)."""
    return {"message": "User profile endpoint — coming soon"}
