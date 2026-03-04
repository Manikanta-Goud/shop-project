-- ================================================================
-- MIGRATION: RENAME GAJULU TO BANGLES
-- ================================================================
-- Run this in your Supabase SQL Editor to update existing data
-- ================================================================

-- Update products table - change type from 'Gajulu' to 'Bangles'
UPDATE products 
SET type = 'Bangles' 
WHERE type = 'Gajulu';

-- Update products table - change category containing 'Gajulu' to 'Bangles'
UPDATE products 
SET category = REPLACE(category, 'Gajulu', 'Bangles');

-- Update product names containing 'Gajulu'
UPDATE products 
SET name = REPLACE(name, 'Gajulu', 'Bangles')
WHERE name LIKE '%Gajulu%';

-- Update offers table - change category from 'Gajulu' to 'Bangles'
UPDATE offers 
SET category = 'Bangles' 
WHERE category = 'Gajulu';

-- Update offer titles containing 'Gajulu'
UPDATE offers 
SET title = REPLACE(title, 'Gajulu', 'Bangles')
WHERE title LIKE '%Gajulu%';

-- Update offer descriptions containing 'Gajulu'
UPDATE offers 
SET description = REPLACE(description, 'Gajulu', 'Bangles')
WHERE description LIKE '%Gajulu%';

-- Verification Query
SELECT 'Products' as table_name, COUNT(*) as bangles_count 
FROM products WHERE type = 'Bangles'
UNION ALL
SELECT 'Offers' as table_name, COUNT(*) as bangles_count 
FROM offers WHERE category = 'Bangles';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ MIGRATION COMPLETE';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '✓ All "Gajulu" references changed to "Bangles"';
    RAISE NOTICE '✓ Product types updated';
    RAISE NOTICE '✓ Offer categories updated';
    RAISE NOTICE '✓ Names and descriptions updated';
    RAISE NOTICE '';
    RAISE NOTICE '🎉 Your app now uses "Bangles" instead of "Gajulu"';
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
END $$;
