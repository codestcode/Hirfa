import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const authPaths = ['/login', '/register', '/forgot-password', '/reset-password', '/otp', '/check-email', '/Verification', '/Proffession', '/api/auth/signup', '/api/auth/send-otp']

const onboardingPaths = ['/', '/splash', '/welcome', '/intro', '/role', '/success']

export async function middleware(request: NextRequest) {
  const { supabase, supabaseResponse, user } = await updateSession(request)
  const path = request.nextUrl.pathname

  if (path.startsWith('/api/') && !path.startsWith('/api/auth/')) return supabaseResponse

  const getUserHome = async () => {
    if (!user) return null
    const { data: profile } = await supabase.from('profiles').select('role, profession').eq('id', user.id).maybeSingle()
    const role = profile?.role
    if (role === 'admin') {
      if (profile?.profession) return '/worker/home'
      return '/client/home'
    }
    if (role === 'worker') return '/worker/home'
    return '/client/home'
  }

  if (onboardingPaths.some(p => path === p)) {
    if (user) {
      const home = await getUserHome()
      return NextResponse.redirect(new URL(home || '/client/home', request.url))
    }
    return supabaseResponse
  }

  if (authPaths.some(p => path === p || path.startsWith(`${p}/`))) {
    if (user) {
      const home = await getUserHome()
      return NextResponse.redirect(new URL(home || '/client/home', request.url))
    }
    return supabaseResponse
  }

  if (!user) return NextResponse.redirect(new URL('/login', request.url))

  const { data: profile } = await supabase.from('profiles').select('role, verified').eq('id', user.id).maybeSingle()
  const role = profile?.role || 'client'
  const isWorkerPath = path.startsWith('/worker')
  const isAdminPath = path.startsWith('/admin')

  if (role !== 'admin' && isAdminPath) {
    if (role === 'worker') return NextResponse.redirect(new URL('/worker/home', request.url))
    return NextResponse.redirect(new URL('/client/home', request.url))
  }

  if (role === 'client' && isWorkerPath) return NextResponse.redirect(new URL('/client/home', request.url))
  if (role === 'worker' && path.startsWith('/client')) return NextResponse.redirect(new URL('/worker/home', request.url))

  if (role === 'worker' && !profile?.verified) {
    if (path !== '/worker/pending') {
      return NextResponse.redirect(new URL('/worker/pending', request.url))
    }
  }
  if (role === 'worker' && profile?.verified && path === '/worker/pending') {
    return NextResponse.redirect(new URL('/worker/home', request.url))
  }

  return supabaseResponse
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'] }
