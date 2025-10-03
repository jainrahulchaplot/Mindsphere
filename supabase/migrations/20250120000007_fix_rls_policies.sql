-- Temporarily disable RLS for testing, or update policies to work with demo users
-- Option 1: Disable RLS (for development/testing)
ALTER TABLE public.user_memories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_snippets DISABLE ROW LEVEL SECURITY;

-- Option 2: Update policies to allow any user_id (if you prefer to keep RLS)
-- DROP POLICY IF EXISTS "Users can view their own memories." ON public.user_memories;
-- DROP POLICY IF EXISTS "Users can create memories for themselves." ON public.user_memories;
-- DROP POLICY IF EXISTS "Users can update their own memories." ON public.user_memories;
-- DROP POLICY IF EXISTS "Users can delete their own memories." ON public.user_memories;

-- CREATE POLICY "Allow all operations for demo users" ON public.user_memories
--     FOR ALL USING (true);

-- DROP POLICY IF EXISTS "Users can view their own snippets." ON public.user_snippets;
-- DROP POLICY IF EXISTS "Users can create snippets for themselves." ON public.user_snippets;
-- DROP POLICY IF EXISTS "Users can update their own snippets." ON public.user_snippets;
-- DROP POLICY IF EXISTS "Users can delete their own snippets." ON public.user_snippets;

-- CREATE POLICY "Allow all operations for demo users" ON public.user_snippets
--     FOR ALL USING (true);
