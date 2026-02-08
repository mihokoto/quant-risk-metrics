-- Create pro_requests table
CREATE TABLE IF NOT EXISTS public.pro_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.pro_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert a request (guests and users)
CREATE POLICY "Anyone can insert pro requests"
    ON public.pro_requests
    FOR INSERT
    WITH CHECK (true);

-- Users can view their own requests
CREATE POLICY "Users can view own requests"
    ON public.pro_requests
    FOR SELECT
    USING (auth.uid() = user_id);

-- Add index for search
CREATE INDEX IF NOT EXISTS pro_requests_email_idx ON public.pro_requests(email);
