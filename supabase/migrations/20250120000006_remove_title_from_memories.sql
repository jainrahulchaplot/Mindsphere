-- Remove title column from user_memories table
ALTER TABLE public.user_memories DROP COLUMN IF EXISTS title;

-- Update the table to make content NOT NULL since it's now mandatory
ALTER TABLE public.user_memories ALTER COLUMN content SET NOT NULL;
