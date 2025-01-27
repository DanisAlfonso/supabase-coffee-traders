import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { createInterface } from 'readline'

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Create readline interface
const rl = createInterface({
  input: process.stdin,
  output: process.stdout
})

// Promisify readline question
const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  })
}

async function setupAdmin() {
  try {
    console.log('\nThis script will make you an admin user.')
    console.log('Please enter your application login credentials')
    console.log('(These are the same credentials you use to sign in at http://localhost:3000/auth)\n')

    // Get email and password from user
    const email = await question('Enter your application login email: ')
    const password = await question('Enter your application login password: ')

    // Sign in with email and password
    const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (signInError || !user) {
      console.error('\nError signing in:', signInError)
      console.log('\nPlease make sure:')
      console.log('1. You have already signed up at http://localhost:3000/auth')
      console.log('2. You are using the correct email and password')
      return
    }

    console.log('\nSigned in successfully as:', user.email)

    // Try to upsert the admin role (this will create the table if it doesn't exist)
    const { error: upsertError } = await supabase
      .from('user_roles')
      .upsert([{ user_id: user.id, role: 'admin' }], {
        onConflict: 'user_id'
      })

    if (upsertError) {
      // If the table doesn't exist, create it
      if (upsertError.code === '42P01') {
        console.log('\nCreating user_roles table...')
        
        // Get the project ID from the URL
        const projectId = supabaseUrl.split('.')[0].split('//')[1]
        
        // Create the table using the Management API
        const managementApiUrl = `https://api.supabase.com/v1/projects/${projectId}/sql`

        const response = await fetch(managementApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`
          },
          body: JSON.stringify({
            query: `
              CREATE TABLE IF NOT EXISTS public.user_roles (
                user_id UUID PRIMARY KEY REFERENCES auth.users(id),
                role TEXT NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
              );
            `
          })
        })

        if (!response.ok) {
          console.error('\nError creating table:', await response.text())
          return
        }

        // Try inserting again
        const { error: retryError } = await supabase
          .from('user_roles')
          .upsert([{ user_id: user.id, role: 'admin' }], {
            onConflict: 'user_id'
          })

        if (retryError) {
          console.error('\nError setting admin role after table creation:', retryError)
          return
        }
      } else {
        console.error('\nError setting admin role:', upsertError)
        return
      }
    }

    console.log('\nSuccessfully set up admin role for user:', user.id)
    console.log('You can now access the admin dashboard at http://localhost:3000/admin')
  } catch (error) {
    console.error('\nError:', error)
  } finally {
    rl.close()
  }
}

setupAdmin() 