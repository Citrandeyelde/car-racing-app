'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function DashboardTrabajador() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchWorkerData = async () => {
      const workerId = Cookies.get('user_session');

      if (!workerId) {
        router.push('/worker/login');
        return;
      }

      const { data, error } = await supabase
        .from('trabajadores')
        .select('*')
        .eq('id_trabajador', workerId)
        .single();

      if (error || !data) {
        Cookies.remove('user_session');
        router.push('/worker/login');
      } else {
        setUser(data);
      }
      setLoading(false);
    };

    fetchWorkerData();
  }, [router]);

  if (loading) return <div className="p-10 text-red-600 font-black animate-pulse">CARGANDO TELEMETRÍA...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-end border-b-2 border-red-600 pb-4 mb-10">
          <div>
            <p className="text-red-600 font-bold text-xs uppercase tracking-[0.3em]">Sistema de Gestión</p>
            <h1 className="text-4xl font-black italic uppercase italic tracking-tighter">
              {user.nombre_completo}
            </h1>
          </div>
          <div className="text-right">
            <p className="text-zinc-500 text-[10px] uppercase">Rango Operativo</p>
            <p className="font-bold text-lg uppercase italic text-red-500">{user.rol}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-zinc-900 p-8 rounded-sm border-l-4 border-red-600 hover:bg-zinc-800 transition-colors cursor-pointer">
            <h3 className="text-xl font-black uppercase italic mb-2">Gestionar Productos</h3>
            <p className="text-zinc-400 text-sm mb-4">Añadir, editar o eliminar repuestos del inventario general.</p>
            <button onClick={() => { router.push('/admin/productos'); }}
             className="text-red-500 font-bold text-xs uppercase tracking-widest hover:text-white">Acceder →</button>
          </div>

          {user.rol === 'gerente' && (
            <div className="bg-zinc-900 p-8 rounded-sm border-l-4 border-white hover:bg-zinc-800 transition-colors cursor-pointer">
              <h3 className="text-xl font-black uppercase italic mb-2">Control de Personal</h3>
              <p className="text-zinc-400 text-sm mb-4">Administrar cuentas de otros trabajadores y roles.</p>
              <button className="text-white font-bold text-xs uppercase tracking-widest hover:text-red-500">Administrar →</button>
            </div>
          )}
        </div>

        <button 
          onClick={() => { Cookies.remove('user_session'); router.push('/admin/login'); }}
          className="mt-12 text-zinc-600 hover:text-red-600 text-[10px] uppercase font-bold tracking-[0.2em] transition-colors"
        >
          [ Cerrar Sesión del Sistema ]
        </button>
      </div>
    </div>
  );
}