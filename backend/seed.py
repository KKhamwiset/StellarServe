import os
import sys

# Add the directory containing the 'app' module to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, engine
from app.models.restaurant import Restaurant, MenuItem

def seed_db():
    db = SessionLocal()
    
    if db.query(Restaurant).first():
        print("Database already seeded")
        return
        
    print("Seeding database...")
    rest1 = Restaurant(
        id="rest-001",
        name="Midnight Ramen House",
        description="Authentic Japanese Ramen crafted for the night owl.",
        cuisine_type="Japanese",
        address="13th Street, 46 W 12th St, NY",
        image_url="https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=400&auto=format&fit=crop"
    )
    
    rest2 = Restaurant(
        id="rest-002",
        name="Moonlight Thai Kitchen",
        description="Spicy and flavorful Thai dishes to brighten your night.",
        cuisine_type="Thai",
        address="14th Street, 48 W 14th St, NY",
        image_url="https://images.unsplash.com/photo-1559314809-0d155014e29e?q=80&w=400&auto=format&fit=crop"
    )

    db.add(rest1)
    db.add(rest2)
    db.commit()
    
    menu1 = MenuItem(
        id="m-101",
        restaurant_id="rest-001",
        name="Tonkotsu Ramen",
        description="Rich pork broth with chashu, soft boiled egg.",
        price=18.50,
        category="Main",
        image_url="https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=400&auto=format&fit=crop"
    )
    menu2 = MenuItem(
        id="m-102",
        restaurant_id="rest-001",
        name="Spicy Miso Ramen",
        description="Signature spicy broth, roasted corn, pork.",
        price=19.50,
        category="Main",
        image_url="https://images.unsplash.com/photo-1526318896980-cf78c088247c?q=80&w=400&auto=format&fit=crop"
    )
    
    menu3 = MenuItem(
        id="m-201",
        restaurant_id="rest-002",
        name="Pad Thai",
        description="Stir-fried rice noodles with eggs and peanuts.",
        price=16.00,
        category="Main",
        image_url="https://images.unsplash.com/photo-1559314809-0d155014e29e?q=80&w=400&auto=format&fit=crop"
    )
    
    db.add_all([menu1, menu2, menu3])
    db.commit()
    print("Seeding complete!")

if __name__ == "__main__":
    seed_db()
