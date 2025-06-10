const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔄 Testing Supabase connection...');
console.log('URL:', supabaseUrl ? '✅ Found' : '❌ Missing');
console.log('Service Key:', supabaseServiceKey ? '✅ Found' : '❌ Missing');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('mock_endpoints')
      .select('count', { count: 'exact', head: true });
    
    if (error && error.code === '42P01') {
      console.log('⚠️  Table does not exist. Creating it...');
      await createTable();
      return;
    }
    
    if (error) {
      console.error('❌ Database error:', error);
      return;
    }
    
    console.log('✅ Connected successfully!');
    console.log(`📊 Current records: ${data || 0}`);
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  }
}

async function createTable() {
  try {
    const { error } = await supabase.rpc('exec_sql', { 
      sql: `
        CREATE TABLE IF NOT EXISTS mock_endpoints (
          id TEXT PRIMARY KEY,
          config JSONB NOT NULL,
          endpoint TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          expires_at TIMESTAMPTZ NOT NULL
        );
        
        ALTER TABLE mock_endpoints ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Allow all operations on mock_endpoints" ON mock_endpoints;
        CREATE POLICY "Allow all operations on mock_endpoints" 
        ON mock_endpoints FOR ALL TO public USING (true) WITH CHECK (true);
        
        CREATE INDEX IF NOT EXISTS idx_mock_endpoints_expires_at ON mock_endpoints(expires_at);
      `
    });
    
    if (error) {
      console.error('❌ Failed to create table:', error);
    } else {
      console.log('✅ Table created successfully!');
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

testConnection();
