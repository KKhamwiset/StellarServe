from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from functools import wraps

from app.config import get_settings
from app.routers import auth, restaurants, menu, orders, cart, reviews, favorite

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    description="🌙 Food delivery API — focused on night-time dining",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(restaurants.router, prefix="/api/restaurants", tags=["Restaurants"])
app.include_router(menu.router, prefix="/api/menu", tags=["Menu"])
app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])
app.include_router(cart.router, prefix="/api/cart", tags=["Cart"])
app.include_router(reviews.router, prefix="/api/reviews", tags=["Reviews"])
app.include_router(favorite.router, prefix="/api/favorites", tags=["Favorites"])

@app.get("/", tags=["Health"])
async def root():
    """Root endpoint."""
    return {"message": "Welcome to StellarServe API"}

@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint."""
    return {
        "status": "ok",
        "app": settings.app_name,
        "environment": settings.app_env,
    }
