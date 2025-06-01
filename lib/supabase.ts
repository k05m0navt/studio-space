import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient, createServerComponentClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Client component client (for use in client components)
export const createSupabaseClient = () => {
  return createClientComponentClient<Database>()
}

// Server component client (for use in server components)
export const createSupabaseServerClient = async () => {
  const cookieStore = await cookies()
  return createServerComponentClient<Database>({
    cookies: () => cookieStore,
  })
} 