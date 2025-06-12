import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://fsgzjqdpqhsjfttwjqnt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzZ3pqcWRwcWhzamZ0dHdqcW50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5MTU5NjUsImV4cCI6MjA0OTQ5MTk2NX0.y7lJR47vGBRmJMPWZ8-Jvpdc_qnKTwXl9tNF6ZJ8rqs'
);

async function testAuth() {
  console.log('🔍 Testing current mock endpoints with user_id...');
  
  const { data, error } = await supabase
    .from('mock_endpoints')
    .select('id, user_id, created_at')
    .order('created_at', { ascending: false })
    .limit(10);
  
  if (error) {
    console.error('❌ Error:', error);
  } else {
    console.log('📊 Recent endpoints:');
    data.forEach(endpoint => {
      console.log(`  - ID: ${endpoint.id}, user_id: ${endpoint.user_id || 'NULL'}, created: ${endpoint.created_at}`);
    });
    
    // Count endpoints by user_id
    const withUserId = data.filter(e => e.user_id !== null).length;
    const withoutUserId = data.filter(e => e.user_id === null).length;
    console.log(`\n📈 Summary: ${withUserId} with user_id, ${withoutUserId} without user_id`);
  }
}

testAuth().catch(console.error);
