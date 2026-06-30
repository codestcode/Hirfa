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
        .select('role, profession, phone')
        .eq('id', user.id)
        .maybeSingle()

      let redirectPath = '/client/home'
      let needsCompletion = false
      let finalRole = role
      let finalProfession = null

      if (!profile) {
        needsCompletion = true
      } else {
        finalRole = profile.role || role
        finalProfession = profile.profession
        if (!profile.phone || (finalRole === 'worker' && !finalProfession)) {
          needsCompletion = true
        }
      }

      if (needsCompletion) {
        redirectPath = `/register/complete?role=${finalRole}`
      } else if (finalRole === 'admin') {
        redirectPath = finalProfession ? '/worker/home' : '/client/home'
      } else if (finalRole === 'worker') {
        redirectPath = '/worker/home'
      }
      return NextResponse.redirect(`${origin}${redirectPath}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=CouldNotAuthenticate`)
}
