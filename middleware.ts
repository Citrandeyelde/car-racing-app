import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('user_session');
  const { pathname } = request.nextUrl;

  // 1. EXCEPCIÓN: Si el usuario ya está en la página de login, déjalo pasar siempre.
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // 2. RESTRICCIÓN: Si intenta entrar a cualquier ruta de /admin y NO tiene la cookie...
  if (pathname.startsWith('/admin') && !session) {
    // Lo mandamos al login de admin
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // 3. MEJORA: Si ya está logueado e intenta ir al login, mándalo al dashboard
  if (pathname === '/admin/login' && session) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

// El matcher debe incluir /admin para que el middleware se active allí
export const config = {
  matcher: ['/admin/:path*'],
};
