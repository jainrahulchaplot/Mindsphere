-- Create user_memories table for storing user's personal information
CREATE TABLE IF NOT EXISTS public.user_memories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'general',
    importance INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries by user_id
CREATE INDEX IF NOT EXISTS idx_user_memories_user_id ON public.user_memories(user_id);

-- Create index for faster queries by category
CREATE INDEX IF NOT EXISTS idx_user_memories_category ON public.user_memories(category);

-- Create index for faster queries by created_at
CREATE INDEX IF NOT EXISTS idx_user_memories_created_at ON public.user_memories(created_at);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.user_memories ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to read their own memories
CREATE POLICY "Users can read their own memories" ON public.user_memories
    FOR SELECT USING (auth.uid()::text = user_id);

-- Policy to allow users to insert their own memories
CREATE POLICY "Users can insert their own memories" ON public.user_memories
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Policy to allow users to update their own memories
CREATE POLICY "Users can update their own memories" ON public.user_memories
    FOR UPDATE USING (auth.uid()::text = user_id);

-- Policy to allow users to delete their own memories
CREATE POLICY "Users can delete their own memories" ON public.user_memories
    FOR DELETE USING (auth.uid()::text = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_memories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at on row updates
CREATE TRIGGER trigger_update_user_memories_updated_at
    BEFORE UPDATE ON public.user_memories
    FOR EACH ROW
    EXECUTE FUNCTION update_user_memories_updated_at();
