-- Create the mock_endpoints table
CREATE TABLE IF NOT EXISTS public.mock_endpoints (
    id TEXT PRIMARY KEY,
    config JSONB NOT NULL,
    endpoint TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.mock_endpoints ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all operations for now (since no auth is required)
CREATE POLICY "Allow all operations on mock_endpoints" 
ON public.mock_endpoints 
FOR ALL 
TO public 
USING (true) 
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mock_endpoints_expires_at ON public.mock_endpoints(expires_at);
CREATE INDEX IF NOT EXISTS idx_mock_endpoints_created_at ON public.mock_endpoints(created_at);

-- Function to automatically delete expired endpoints
CREATE OR REPLACE FUNCTION delete_expired_mock_endpoints()
RETURNS void AS $$
BEGIN
    DELETE FROM public.mock_endpoints 
    WHERE expires_at < CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled function to run cleanup (optional - can be called manually)
-- Note: This requires the pg_cron extension to be enabled in Supabase
-- SELECT cron.schedule('cleanup-expired-mocks', '0 0 * * *', 'SELECT delete_expired_mock_endpoints();');
