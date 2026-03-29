'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'; // Importamos la librería de cookies

interface Trabajador {
  id_trabajador: string;
  nombre_completo: string;
  rol: 'gerente' | 'trabajador';
  email: string;
  fecha_contratacion: string;
  activo: boolean;
}

export default function DashboardTrabajador() {
  const [user, setUser] = useState<Trabajador | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTrabajador = async () => {
      // 1. Obtener el ID del trabajador desde la Cookie
      // Asumiendo que tu cookie se llama 'worker_id' o 'worker_session'
      const workerId = Cookies.get('worker_id'); 

      if (!workerId) {
        console.warn("Sesión no encontrada en cookies.");
        router.push('/worker/login');
        return;
      }

      // 2. Consultar datos de la tabla trabajadores en Supabase
      const { data, error } = await supabase
        .from('trabajadores')
        .select('*')
        .eq('id_trabajador', workerId)
        .single();

      if (error || !data) {
        console.error('Error al recuperar datos del trabajador:', error?.message);
        router.push('/worker/login');
      } else {
        setUser(data);
      }
      setLoading(false);
    };

    fetchTrabajador();
  }, [router]);

  const handleLogout = () => {
    // Borrar la cookie al salir
    Cookies.remove('worker_id');
    router.push('/worker/login');
  };

  if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-red-600 font-black italic animate-pulse text-2xl">CARGANDO SISTEMA...</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      {/* Barra Lateral / Header de Estado */}
      <nav className="bg-zinc-900 border-b border-zinc-800 p-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-4">
          <div className="bg-red-600 px-3 py-1 rounded text-xs font-black italic uppercase">
            {user?.rol}
          </div>
          <h1 className="text-xl font-bold tracking-tighter uppercase italic">
            PIT <span className="text-red-600">CONTROL</span> CENTER
          </h1>
        </div>
        <button 
          onClick={handleLogout}
          className="text-zinc-500 hover:text-white text-xs font-bold uppercase transition-colors"
        >
          Cerrar Sesión [Esc]
        </button>
      </nav>

      <div className="max-w-7xl mx-auto p-6 lg:p-10">
        {/* Banner de Bienvenida */}
        <header className="mb-10">
          <h2 className="text-4xl font-black uppercase italic">Bienvenido, {user?.nombre_completo.split(' ')[0]}</h2>
          <p className="text-zinc-500 font-mono text-sm">ID Operativo: {user?.id_trabajador.slice(0, 8)}...</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Card: Perfil Rápido */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl">
            <h3 className="text-zinc-500 text-[10px] font-bold uppercase mb-4 tracking-widest">Ficha Técnica</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-zinc-400">Email</p>
                <p className="font-bold truncate">{user?.email}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-400">Contratado el</p>
                <p className="font-bold">{new Date(user?.fecha_contratacion || '').toLocaleDateString('es-PE')}</p>
              </div>
              <div className="pt-4 border-t border-zinc-800 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${user?.activo ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></div>
                <span className="text-xs font-bold uppercase tracking-tighter">Status: {user?.activo ? 'En Servicio' : 'Fuera de Servicio'}</span>
              </div>
            </div>
          </div>

          {/* Sección de Acciones Rápidas (Condicional según Rol) */}
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Acción 1: Inventario (Para ambos) */}
            <button 
              onClick={() => router.push('/admin/inventario')}
              className="bg-zinc-900 border border-zinc-800 hover:border-red-600 p-8 rounded-xl flex flex-col items-center justify-center transition-all group"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📦</div>
              <span className="font-black uppercase italic text-sm">Gestionar Inventario</span>
              <p className="text-[10px] text-zinc-500 mt-2">Añadir o editar productos</p>
            </button>

            {/* Acción 2: Pedidos (Para ambos) */}
            <button className="bg-zinc-900 border border-zinc-800 hover:border-red-600 p-8 rounded-xl flex flex-col items-center justify-center transition-all group">
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🏁</div>
              <span className="font-black uppercase italic text-sm">Ordenes de Venta</span>
              <p className="text-[10px] text-zinc-500 mt-2">Ver pedidos de clientes</p>
            </button>

            {/* Acción 3: Administración de Usuarios (Solo GERENTE) */}
            {user?.rol === 'gerente' && (
              <button 
                onClick={() => router.push('/admin/personal')}
                className="bg-red-600/10 border border-red-600/30 hover:bg-red-600 hover:text-white p-8 rounded-xl flex flex-col items-center justify-center transition-all group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform text-red-500 group-hover:text-white">🛠️</div>
                <span className="font-black uppercase italic text-sm">Gestión de Personal</span>
                <p className="text-[10px] text-zinc-400 group-hover:text-white mt-2 italic">Solo acceso Gerencial</p>
              </button>
            )}

            {/* Acción Extra para Trabajador: Mis Tareas */}
            {user?.rol === 'trabajador' && (
              <div className="bg-zinc-800/30 border border-zinc-700 p-8 rounded-xl flex flex-col items-center justify-center">
                <div className="text-3xl mb-2">⏱️</div>
                <span className="font-black uppercase italic text-sm">Mi Jornada</span>
                <p className="text-[10px] text-zinc-500 mt-2 italic text-center text-balance">Registra tus horas y actividades</p>
              </div>
            )}
          </div>

        </div>

        {/* Sección de Monitorización (Estadísticas rápidas) */}
        {user?.rol === 'gerente' && (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-900/50 p-6 border-l-2 border-red-600 rounded">
              <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Ventas del Día</p>
              <p className="text-2xl font-black tracking-tighter">S/ 4,250.00</p>
            </div>
            <div className="bg-zinc-900/50 p-6 border-l-2 border-zinc-700 rounded">
              <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Stock Crítico</p>
              <p className="text-2xl font-black tracking-tighter text-orange-500">12 Items</p>
            </div>
            <div className="bg-zinc-900/50 p-6 border-l-2 border-zinc-700 rounded">
              <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Clientes Nuevos</p>
              <p className="text-2xl font-black tracking-tighter">8 Registros</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}