import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Disabled for UI preview - uncomment when Supabase is configured
  // const { updateSession } = await import('@/lib/supabase/middleware')
  // return await updateSession(request)
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
