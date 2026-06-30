import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fahbfbzxxpqlvhipbmtv.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhaGJmYnp4eHBxbHZoaXBibXR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5MDk0MjQsImV4cCI6MjA5NzQ4NTQyNH0.hYjH-lRHls2upvUapwaLwhdCwCODRiwXKK5-66D2TcM'
  )
}
