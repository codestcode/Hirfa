import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  const role = searchParams.get('role') || 'client'

  if (code) {
    const supabase = await createClient()
    const { data: authData, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && authData.user) {
      const user = authData.user

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

      let finalRole = role

      if (!profile) {
        const name = user.user_metadata?.full_name || user.user_metadata?.name || 'مستخدم جديد'
        await supabase.from('profiles').insert({
          id: user.id,
          full_name: name,
          email: user.email,
          role: role,
        })
      } else {
        finalRole = profile.role || role
      }

      const redirectPath = finalRole === 'worker' ? '/home' : '/client-home'
      return NextResponse.redirect(`${origin}${redirectPath}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=CouldNotAuthenticate`)
}
