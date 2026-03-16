'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  
  // Verificamos si estamos en la zona de administración
  const isAdmin = pathname.startsWith('/admin')

  return (
    <nav className={`${isAdmin ? 'bg-slate-900' : 'bg-blue-700'} text-white py-4 px-8 shadow-lg sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-black italic tracking-tighter uppercase">
          🏎️ Car Racing <span className={isAdmin ? 'text-blue-500' : 'text-slate-900'}>Boutique</span>
        </Link>

        {/* Links Dinámicos */}
        <div className="space-x-6 font-bold text-sm uppercase">
          {isAdmin ? (
            <>
              <Link href="/admin/dashboard" className="hover:text-blue-400 transition">Dashboard</Link>
              <Link href="/admin/productos" className="hover:text-blue-400 transition">Inventario</Link>
              <Link href="/" className="bg-slate-700 px-3 py-1 rounded text-xs">Ver como Cliente</Link>
            </>
          ) : (
            <>
              <Link href="/" className="hover:text-slate-200 transition">Catálogo</Link>
              <Link href="/registro" className="hover:text-slate-200 transition">Registrarse</Link>
              <Link href="/admin/productos" className="bg-blue-800 px-3 py-1 rounded text-xs">Acceso Staff</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}