import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🔍 Testing authentication fix...')

// Check if the user exists and can be retrieved
try {
  const { data: { users }, error } = await supabase.auth.admin.listUsers()
  
  if (error) {
    console.error('❌ Error fetching users:', error.message)
  } else {
    console.log('✅ Found users in database:', users.length)
    const targetUser = users.find(u => u.id === '8e44b426-f23c-473e-adaf-de927863a692')
    if (targetUser) {
      console.log('✅ Target user found:', targetUser.email)
      console.log('✅ Email confirmed:', !!targetUser.email_confirmed_at)
    } else {
      console.log('❌ Target user not found')
    }
  }
} catch (error) {
  console.error('❌ Test failed:', error.message)
}

// Test creating a mock endpoint record to see what user_id it gets
console.log('\n🔍 Testing current database state...')
try {
  const { data: endpoints, error } = await supabase
    .from('mock_endpoints')
    .select('id, user_id, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  if (error) {
    console.error('❌ Error fetching endpoints:', error.message)
  } else {
    console.log('✅ Recent endpoints:')
    endpoints.forEach(endpoint => {
      console.log(`  - ID: ${endpoint.id}, User ID: ${endpoint.user_id || 'null'}, Created: ${endpoint.created_at}`)
    })
  }
} catch (error) {
  console.error('❌ Database test failed:', error.message)
}
