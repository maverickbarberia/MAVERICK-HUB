import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
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
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
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

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const clientId = request.cookies.get('client_session')?.value
  const isAdminLogged = !!user
  const isClientLogged = !!clientId
  
  const pathname = request.nextUrl.pathname
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register')
  
  // No hay sesión activa de ningún tipo, pero la ruta es protegida
  if (
    !isAdminLogged && 
    !isClientLogged &&
    !isAuthRoute &&
    !pathname.startsWith('/promo') &&
    pathname !== '/'
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // Redirigir a usuarios logueados lejos de SUS RESPECTIVAS rutas de auth
  if (pathname.startsWith('/login/admin') && isAdminLogged) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }
  
  if ((pathname.startsWith('/login/client') || pathname.startsWith('/register')) && isClientLogged) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Proteger la ruta de administrador
  if (pathname.startsWith('/admin')) {
    if (!isAdminLogged) {
      const url = request.nextUrl.clone()
      url.pathname = isClientLogged ? '/dashboard' : '/login/admin'
      return NextResponse.redirect(url)
    }
  }

  // Proteger la ruta de cliente (dashboard)
  if (pathname.startsWith('/dashboard')) {
    if (!isClientLogged) {
      const url = request.nextUrl.clone()
      url.pathname = isAdminLogged ? '/admin' : '/login/client'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
