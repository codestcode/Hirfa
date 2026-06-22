import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const publicPaths = ['/', '/splash', '/welcome', '/intro', '/role', '/success', '/login', '/register', '/forgot-password', '/reset-password', '/otp', '/check-email', '/Verification', '/Proffession', '/api/auth/signup']

export async function middleware(request: NextRequest) {
  const { supabase, supabaseResponse, user } = await updateSession(request)
  const path = request.nextUrl.pathname

  if (path.startsWith('/api/') || publicPaths.some(p => path === p || path.startsWith(`${p}/`))) return supabaseResponse
  if (!user) return NextResponse.redirect(new URL('/login', request.url))

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  const role = profile?.role
  const isWorkerPath = path.startsWith('/worker')

  if (role === 'client' && isWorkerPath) return NextResponse.redirect(new URL('/client/home', request.url))
  if (role === 'worker' && path.startsWith('/client')) return NextResponse.redirect(new URL('/worker/home', request.url))

  return supabaseResponse
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'] }
