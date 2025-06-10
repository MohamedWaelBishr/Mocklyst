import { supabaseAdmin } from '../src/lib/supabase.js';

async function testConnection() {
  console.log('🔄 Testing Supabase connection...');
  
  try {
    // Try to query the database
    const { data, error } = await supabaseAdmin
      .from('mock_endpoints')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.log('⚠️  Table does not exist yet. Need to create it.');
      console.log('Error:', error.message);
      return false;
    }
    
    console.log('✅ Connected to Supabase successfully!');
    console.log(`📊 Current mock endpoints count: ${data}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to Supabase:', error);
    return false;
  }
}

async function createTable() {
  console.log('🏗️  Creating mock_endpoints table...');
  
  try {
    const { error } = await supabaseAdmin.rpc('sql', {
      query: `
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
        DROP POLICY IF EXISTS "Allow all operations on mock_endpoints" ON public.mock_endpoints;
        CREATE POLICY "Allow all operations on mock_endpoints" 
        ON public.mock_endpoints 
        FOR ALL 
        TO public 
        USING (true) 
        WITH CHECK (true);

        -- Create indexes for better performance
        CREATE INDEX IF NOT EXISTS idx_mock_endpoints_expires_at ON public.mock_endpoints(expires_at);
        CREATE INDEX IF NOT EXISTS idx_mock_endpoints_created_at ON public.mock_endpoints(created_at);
      `
    });
    
    if (error) {
      console.error('❌ Failed to create table:', error);
      return false;
    }
    
    console.log('✅ Table created successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error creating table:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 Setting up Supabase database for Mocklyst...\n');
  
  const connected = await testConnection();
  
  if (!connected) {
    console.log('\n📋 Attempting to create table...');
    const created = await createTable();
    
    if (created) {
      console.log('\n🔄 Testing connection again...');
      await testConnection();
    }
  }
  
  console.log('\n🎉 Database setup complete!');
}

main();
