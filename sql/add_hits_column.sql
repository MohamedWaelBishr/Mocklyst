-- Add hits tracking to mock_endpoints table
-- This migration adds a hits column to track the number of requests per endpoint

-- Add hits column to mock_endpoints table
ALTER TABLE public.mock_endpoints 
ADD COLUMN IF NOT EXISTS hits BIGINT NOT NULL DEFAULT 0;

-- Create index for performance queries
CREATE INDEX IF NOT EXISTS idx_mock_endpoints_hits 
ON public.mock_endpoints(hits);

-- Update existing records to have 0 hits
UPDATE public.mock_endpoints 
SET hits = 0 
WHERE hits IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.mock_endpoints.hits IS 'Number of times this endpoint has been accessed';

-- Verify the change
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'mock_endpoints' AND column_name = 'hits';
