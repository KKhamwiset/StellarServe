"""Run seed updates for restaurants."""
from app.database import engine
from sqlalchemy import text

statements = [
    # 1) Midnight Ramen House
    text("""
        UPDATE restaurants SET
            phone        = '(212) 555-0101',
            opening_time = '18:00',
            closing_time = '04:00',
            rating       = 4.5,
            updated_at   = NOW()
        WHERE id = 'rest-001'
    """),
    # 2) TestingShop -> Golden Dragon Dumplings
    text("""
        UPDATE restaurants SET
            name         = 'Golden Dragon Dumplings',
            description  = 'Hand-folded dumplings and dim sum made fresh to order.',
            cuisine_type = 'Chinese',
            address      = '15th Street, 50 W 15th St, NY',
            phone        = '(212) 555-0102',
            image_url    = 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?q=80&w=400&auto=format&fit=crop',
            rating       = 4.2,
            updated_at   = NOW()
        WHERE id = 'rest-dd6b521d'
    """),
    # 3) Moonlight Thai Kitchen
    text("""
        UPDATE restaurants SET
            phone        = '(212) 555-0103',
            opening_time = '11:00',
            closing_time = '23:00',
            rating       = 4.7,
            updated_at   = NOW()
        WHERE id = 'rest-002'
    """),
]

with engine.connect() as conn:
    for stmt in statements:
        result = conn.execute(stmt)
        print(f"Updated {result.rowcount} row(s)")
    conn.commit()

    # Verify
    rows = conn.execute(text(
        "SELECT id, name, cuisine_type, phone, opening_time, closing_time, rating FROM restaurants ORDER BY id"
    ))
    print("\n--- Restaurants after update ---")
    for row in rows:
        print(f"  {row.id} | {row.name} | {row.cuisine_type} | {row.phone} | {row.opening_time}-{row.closing_time} | ★{row.rating}")

print("\nDone!")
