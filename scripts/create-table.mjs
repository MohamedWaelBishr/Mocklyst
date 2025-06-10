import { supabaseAdmin } from '../src/lib/supabase.js';

console.log('🚀 Creating mock_endpoints table in Supabase...');

const createTableSQL = `
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

  -- Drop existing policy if it exists
  DROP POLICY IF EXISTS "Allow all operations on mock_endpoints" ON public.mock_endpoints;

  -- Create a policy to allow all operations for now (since no auth is required)
  CREATE POLICY "Allow all operations on mock_endpoints" 
  ON public.mock_endpoints 
  FOR ALL 
  TO anon, authenticated
  USING (true) 
  WITH CHECK (true);

  -- Create indexes for better performance
  CREATE INDEX IF NOT EXISTS idx_mock_endpoints_expires_at ON public.mock_endpoints(expires_at);
  CREATE INDEX IF NOT EXISTS idx_mock_endpoints_created_at ON public.mock_endpoints(created_at);
`;

async function createTable() {
  try {
    console.log('Executing SQL...');
    
    // Execute the SQL using the admin client
    const { data, error } = await supabaseAdmin.rpc('exec_sql', {
      sql: createTableSQL
    });
    
    if (error) {
      console.error('❌ Error creating table:', error);
      console.log('Trying alternative approach...');
      
      // Try creating table without the RPC function
      const { error: createError } = await supabaseAdmin
        .from('mock_endpoints')
        .select('*')
        .limit(1);
        
      if (createError && createError.code === '42P01') {
        console.log('Table does not exist. Please create it manually in Supabase dashboard.');
        console.log('SQL to execute:');
        console.log(createTableSQL);
      }
    } else {
      console.log('✅ Table created successfully!');
    }
    
    // Test the table by checking if we can query it
    const { data: testData, error: testError } = await supabaseAdmin
      .from('mock_endpoints')
      .select('count', { count: 'exact', head: true });
      
    if (testError) {
      console.error('❌ Failed to query table:', testError);
    } else {
      console.log('✅ Table is accessible and ready to use!');
      console.log(`📊 Current records count: ${testData || 0}`);
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

createTable();
