import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync } from 'fs'

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

async function executeSql() {
  try {
    // Read the SQL file
    const sql = readFileSync(resolve(process.cwd(), 'scripts/create-admin.sql'), 'utf8')
    
    // Get the project ID from the URL
    const projectId = supabaseUrl.split('.')[0].split('//')[1]
    
    // Execute the SQL using the Management API
    const managementApiUrl = `https://api.supabase.com/v1/projects/${projectId}/sql`

    const response = await fetch(managementApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`
      },
      body: JSON.stringify({ query: sql })
    })

    if (!response.ok) {
      console.error('Error executing SQL:', await response.text())
      return
    }

    console.log('Successfully created user_roles table with RLS policies')
  } catch (error) {
    console.error('Error:', error)
  }
}

executeSql() 