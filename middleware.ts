import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const publicPaths = [
    '/',
    '/splash',
    '/welcome',
    '/intro',
    '/role',
    '/success',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/otp',
    '/check-email',
    '/Verification',
    '/Proffession',
    '/api/auth/signup',
  ]

const workerPaths = ['/worker']
const clientPaths = ['/client']

export async function middleware(request: NextRequest) {
  const { supabase, supabaseResponse, user } = await updateSession(request)

  const { pathname } = request.nextUrl

  if (pathname.startsWith('/api/')) {
    return supabaseResponse
  }

  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path + '/')
  )
  const isWorkerPath = workerPaths.some((path) => pathname.startsWith(path))
  const isClientPath = clientPaths.some((path) => pathname === path || pathname.startsWith(path + '/'))

  if (isPublicPath) {
    return supabaseResponse
  }

  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  const role = profile?.role

  if (isWorkerPath && role === 'client') {
    const url = request.nextUrl.clone()
    url.pathname = '/client/home'
    return NextResponse.redirect(url)
  }

  if (isClientPath && role === 'worker') {
    const url = request.nextUrl.clone()
    url.pathname = '/worker/home'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
