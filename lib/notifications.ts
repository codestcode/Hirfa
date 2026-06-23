import { createClient } from '@/lib/supabase/client'

export async function createNotification(
  userId: string,
  title: string,
  body?: string
) {
  const supabase = createClient()
  const { error } = await supabase.from('notifications').insert({
    user_id: userId,
    title,
    body: body || null,
    is_read: false,
  })
  if (error) {
    console.warn('createNotification error:', error.message)
  }
}
