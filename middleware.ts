import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. OBTENER LA COOKIE
  const session = request.cookies.get('user_session')?.value

  // 2. DEFINIR LA RUTA DE LOGIN (La tuya es /admin/login)
  const isLoginPage = pathname === '/admin/login'
  
  // 3. DEFINIR QUÉ RUTAS PROTEGEMOS (Todo lo que empiece con /admin)
  const isAdminRoute = pathname.startsWith('/admin')

  // --- LÓGICA ANTI-BUCLE ---

  // REGLA 1: Si intenta entrar a una ruta de admin, NO es la página de login y NO tiene sesión -> Al Login
  if (isAdminRoute && !isLoginPage && !session) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // REGLA 2: Si ya tiene sesión e intenta ir al login -> Al Home de Admin
  if (isLoginPage && session) {
    return NextResponse.redirect(new URL('/admin/home', request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Mantenemos el matcher para que no afecte a archivos estáticos
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}