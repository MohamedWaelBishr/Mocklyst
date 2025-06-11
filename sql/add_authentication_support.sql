-- Update mock_endpoints table to support user authentication
-- Add user_id column to associate endpoints with users

-- Add user_id column to mock_endpoints table
ALTER TABLE public.mock_endpoints 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for user_id for better performance
CREATE INDEX IF NOT EXISTS idx_mock_endpoints_user_id ON public.mock_endpoints(user_id);

-- Update RLS policies to support user authentication
-- First, drop the existing policy
DROP POLICY IF EXISTS "Allow all operations on mock_endpoints" ON public.mock_endpoints;

-- Create new policies for authenticated users
-- Policy for reading: users can read their own endpoints + anonymous can read anonymous endpoints
CREATE POLICY "Users can read own endpoints" 
ON public.mock_endpoints 
FOR SELECT 
TO public 
USING (
  user_id = auth.uid() OR 
  (user_id IS NULL AND auth.role() = 'anon')
);

-- Policy for inserting: authenticated users can create endpoints associated with their user_id
-- Anonymous users can create endpoints with user_id = NULL
CREATE POLICY "Users can create endpoints" 
ON public.mock_endpoints 
FOR INSERT 
TO public 
WITH CHECK (
  (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
  (auth.uid() IS NULL AND user_id IS NULL)
);

-- Policy for updating: users can only update their own endpoints
CREATE POLICY "Users can update own endpoints" 
ON public.mock_endpoints 
FOR UPDATE 
TO public 
USING (
  user_id = auth.uid() OR 
  (user_id IS NULL AND auth.role() = 'anon')
)
WITH CHECK (
  user_id = auth.uid() OR 
  (user_id IS NULL AND auth.role() = 'anon')
);

-- Policy for deleting: users can only delete their own endpoints
CREATE POLICY "Users can delete own endpoints" 
ON public.mock_endpoints 
FOR DELETE 
TO public 
USING (
  user_id = auth.uid() OR 
  (user_id IS NULL AND auth.role() = 'anon')
);

-- Create profiles table for additional user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile" 
ON public.profiles 
FOR SELECT 
TO public 
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
ON public.profiles 
FOR INSERT 
TO public 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
TO public 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Function to handle user profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update the cleanup function to work with new schema
CREATE OR REPLACE FUNCTION delete_expired_mock_endpoints()
RETURNS void AS $$
BEGIN
    DELETE FROM public.mock_endpoints 
    WHERE expires_at < CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
