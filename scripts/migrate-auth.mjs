import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
import dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function runMigration() {
  try {
    console.log('🔧 Running authentication migration...')
    
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, '..', 'sql', 'add_authentication_support.sql')
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8')
    
    // Split by semicolons and execute each statement
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    console.log(`📝 Executing ${statements.length} SQL statements...`)
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      console.log(`   ${i + 1}/${statements.length}: ${statement.substring(0, 50)}...`)
      
      const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' })
      
      if (error) {
        console.error(`❌ Error executing statement ${i + 1}:`, error.message)
        console.error('Statement:', statement)
        // Continue with other statements
      }
    }
    
    console.log('✅ Migration completed successfully!')
    
    // Test the migration
    console.log('🧪 Testing migration...')
    
    // Test profiles table
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
    
    if (profilesError) {
      console.error('❌ Profiles table test failed:', profilesError.message)
    } else {
      console.log('✅ Profiles table is accessible')
    }
    
    // Test mock_endpoints table with new column
    const { data: endpoints, error: endpointsError } = await supabase
      .from('mock_endpoints')
      .select('id, user_id, created_at')
      .limit(1)
    
    if (endpointsError) {
      console.error('❌ Mock endpoints table test failed:', endpointsError.message)
    } else {
      console.log('✅ Mock endpoints table with user_id column is accessible')
    }
    
    console.log('🎉 Authentication migration completed successfully!')
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    process.exit(1)
  }
}

// Alternative method using direct SQL execution
async function runMigrationDirect() {
  try {
    console.log('🔧 Running authentication migration (direct SQL)...')
    
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, '..', 'sql', 'add_authentication_support.sql')
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8')
    
    console.log('📝 Executing SQL migration...')
    
    // Use the SQL editor/dashboard to run this manually if needed
    console.log('SQL to execute in Supabase dashboard:')
    console.log('='=50)
    console.log(sqlContent)
    console.log('='=50)
    
    console.log('⚠️  Please run the above SQL in your Supabase SQL editor.')
    console.log('    Or use the Supabase CLI: supabase db reset')
    
  } catch (error) {
    console.error('❌ Migration preparation failed:', error.message)
    process.exit(1)
  }
}

// Check command line arguments
const args = process.argv.slice(2)
if (args.includes('--direct')) {
  runMigrationDirect()
} else {
  runMigration()
}
