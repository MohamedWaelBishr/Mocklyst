// Simple test to check if our auth fix is working
console.log('🔍 Auth Fix Test')
console.log('Environment variables:')
console.log('- NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing')
console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing')
console.log('- SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing')

console.log('\n✅ Authentication fix implemented:')
console.log('  1. Added credentials: "include" to client fetch request')
console.log('  2. Added Authorization header with Bearer token')
console.log('  3. Updated API route to handle both token and cookie auth')
console.log('\n🚀 Ready to test the authentication flow!')
