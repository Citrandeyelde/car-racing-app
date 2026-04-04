'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { useRouter } from 'next/navigation';

interface Cliente {
  nombre_completo: string;
  email: string;
  telefono: string;
  direccion: string;
  creado_en: string;
}

export default function PerfilCliente() {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPerfil = async () => {
      const session = localStorage.getItem('user_session');
      if (!session) {
        router.push('/login');
        return;
      }

      const { id } = JSON.parse(session);

      const { data, error } = await supabase
        .from('clientes')
        .select('nombre_completo, email, telefono, direccion, creado_en')
        .eq('id_cliente', id)
        .single();

      if (error) {
        console.error('Error al obtener perfil:', error);
      } else {
        setCliente(data);
      }
      setLoading(false);
    };

    fetchPerfil();
  }, [router]);

  const cerrarSesion = () => {
    localStorage.removeItem('user_session');
    router.push('/login');
  };

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Cabecera del Dashboard */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
              Panel de <span className="text-red-600">Piloto</span>
            </h1>
            <p className="text-zinc-500 text-sm uppercase tracking-widest">Estadísticas y Datos de Cuenta</p>
          </div>
          <button 
            onClick={cerrarSesion}
            className="bg-zinc-800 hover:bg-red-600 text-white text-xs font-bold px-6 py-2 rounded-full transition-colors uppercase italic"
          >
            Finalizar Carrera (Salir)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card de Información Principal */}
          <div className="md:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
            </div>

            <div className="space-y-6 relative z-10">
              <div>
                <label className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Nombre del Titular</label>
                <p className="text-2xl font-bold text-white">{cliente?.nombre_completo}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Correo Electrónico</label>
                  <p className="text-white font-medium">{cliente?.email}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Teléfono de Contacto</label>
                  <p className="text-white font-medium">{cliente?.telefono || 'No registrado'}</p>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Dirección de Entrega</label>
                <p className="text-white font-medium bg-zinc-800/50 p-3 rounded-lg border border-zinc-700 mt-1">
                  {cliente?.direccion || 'Dirección no especificada'}
                </p>
              </div>
            </div>
          </div>

          {/* Card de Estado/Resumen */}
          <div className="bg-red-600 rounded-2xl p-8 flex flex-col justify-between text-white shadow-lg shadow-red-900/20">
            <div>
              <h3 className="font-black italic uppercase text-xl mb-1">Status: Ready</h3>
              <p className="text-red-100 text-xs">Tu cuenta está activa para realizar pedidos.</p>
            </div>
            
            <div className="mt-8">
              <p className="text-[10px] font-bold uppercase opacity-70">Miembro desde</p>
              <p className="text-lg font-bold">
                {cliente?.creado_en ? new Date(cliente.creado_en).toLocaleDateString('es-PE') : '---'}
              </p>
            </div>

            <button className="mt-6 bg-white text-red-600 font-black py-3 rounded-xl text-sm uppercase italic hover:bg-zinc-100 transition-colors">
              Editar Perfil
            </button>
          </div>

        </div>

        {/* Sección de Actividad Reciente (Placeholder) */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-white uppercase italic mb-6 border-b border-zinc-800 pb-2">
            Últimos Movimientos
          </h2>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
            <p className="text-zinc-500 text-sm italic">Aún no has realizado pedidos en esta temporada.</p>
            <button 
              onClick={() => router.push('/')}
              className="mt-4 text-red-500 font-bold uppercase text-xs hover:underline"
            >
              Ir a la tienda ahora →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}