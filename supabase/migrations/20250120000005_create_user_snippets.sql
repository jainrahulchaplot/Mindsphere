-- Create user_snippets table for storing user's quick thoughts and notes
CREATE TABLE IF NOT EXISTS public.user_snippets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries by user_id
CREATE INDEX IF NOT EXISTS idx_user_snippets_user_id ON public.user_snippets(user_id);

-- Create index for faster queries by created_at
CREATE INDEX IF NOT EXISTS idx_user_snippets_created_at ON public.user_snippets(created_at);

-- Add check constraint for content length (max 500 characters)
ALTER TABLE public.user_snippets ADD CONSTRAINT check_content_length CHECK (char_length(content) <= 500);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.user_snippets ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to read their own snippets
CREATE POLICY "Users can read their own snippets" ON public.user_snippets
    FOR SELECT USING (auth.uid()::text = user_id);

-- Policy to allow users to insert their own snippets
CREATE POLICY "Users can insert their own snippets" ON public.user_snippets
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Policy to allow users to update their own snippets
CREATE POLICY "Users can update their own snippets" ON public.user_snippets
    FOR UPDATE USING (auth.uid()::text = user_id);

-- Policy to allow users to delete their own snippets
CREATE POLICY "Users can delete their own snippets" ON public.user_snippets
    FOR DELETE USING (auth.uid()::text = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_snippets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at on row updates
CREATE TRIGGER trigger_update_user_snippets_updated_at
    BEFORE UPDATE ON public.user_snippets
    FOR EACH ROW
    EXECUTE FUNCTION update_user_snippets_updated_at();
