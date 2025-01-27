import * as dotenv from 'dotenv'
import { resolve } from 'path'
import pgPromise from 'pg-promise'

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

// Extract host and database from Supabase URL
const url = new URL(supabaseUrl)
const host = url.hostname
const database = 'postgres'
const port = 5432

const pgp = pgPromise()
const db = pgp({
  host,
  port,
  database,
  user: 'postgres',
  password: supabaseServiceKey,
  ssl: true
})

async function createTable() {
  try {
    // Create the table using raw SQL
    await db.none(`
      CREATE TABLE IF NOT EXISTS public.user_roles (
        user_id UUID PRIMARY KEY REFERENCES auth.users(id),
        role TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
      );
    `)

    console.log('Successfully created user_roles table')
  } catch (error) {
    console.error('Error:', error)
  } finally {
    pgp.end()
  }
}

createTable() 