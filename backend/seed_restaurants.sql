-- Seed script: Update restaurants to have complete, usable data
-- Run with: psql -U <user> -d <database> -f seed_restaurants.sql

-- 1) Midnight Ramen House — fill in missing phone, opening & closing times
UPDATE restaurants
SET
    phone        = '(212) 555-0101',
    opening_time = '18:00',
    closing_time = '04:00',
    rating       = 4.5,
    updated_at   = NOW()
WHERE id = 'rest-001';

-- 2) TestingShop — fill in all empty/placeholder fields
UPDATE restaurants
SET
    name         = 'Golden Dragon Dumplings',
    description  = 'Hand-folded dumplings and dim sum made fresh to order.',
    cuisine_type = 'Chinese',
    address      = '15th Street, 50 W 15th St, NY',
    phone        = '(212) 555-0102',
    image_url    = 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?q=80&w=400&auto=format&fit=crop',
    rating       = 4.2,
    updated_at   = NOW()
WHERE id = 'rest-dd6b521d';

-- 3) Moonlight Thai Kitchen — fill in missing phone, opening & closing times
UPDATE restaurants
SET
    phone        = '(212) 555-0103',
    opening_time = '11:00',
    closing_time = '23:00',
    rating       = 4.7,
    updated_at   = NOW()
WHERE id = 'rest-002';

-- Verify results
SELECT id, name, cuisine_type, phone, opening_time, closing_time, rating
FROM restaurants
ORDER BY id;
