import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Define protected routes that require authentication
  const protectedRoutes = [
    '/dashboard',
    '/mock/create',
    '/mock/edit',
    '/profile',
    '/settings'
  ]

  // Define auth routes that should redirect if already authenticated
  const authRoutes = [
    '/auth/signin',
    '/auth/signup',
    '/auth/reset-password'
  ]

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // Check if user is authenticated and email is verified
  const isAuthenticated = user && user.email_confirmed_at

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && isAuthenticated) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/'
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect unauthenticated users to sign in
  if (isProtectedRoute && !isAuthenticated) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/auth/signin'
    
    // Preserve the original URL as a redirect parameter
    if (pathname !== '/') {
      redirectUrl.searchParams.set('redirect', pathname)
    }
    
    return NextResponse.redirect(redirectUrl)
  }

  // Special handling for email verification route
  if (pathname === '/auth/verify') {
    // Allow access to verification page regardless of auth status
    return supabaseResponse
  }

  // Check if user needs email verification for protected routes
  if (isProtectedRoute && user && !user.email_confirmed_at) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/auth/verify'
    return NextResponse.redirect(redirectUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     * - api/mock/[id] routes (public mock data endpoints)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/mock/[a-zA-Z0-9_-]+$).*)',
  ],
}
