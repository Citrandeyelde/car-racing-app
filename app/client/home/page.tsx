'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';

interface Producto {
  id_producto: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen_url: string;
  activo: boolean;
}

export default function HomeClientes() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .eq('activo', true) // Solo mostrar productos marcados como activos
        .order('id_producto', { ascending: false });

      if (error) {
        console.error('Error al obtener productos:', error);
      } else {
        setProductos(data || []);
      }
      setLoading(false);
    };

    fetchProductos();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Sección Hero / Banner */}
      <section className="relative h-[40vh] flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1470')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">
            Racing <span className="text-red-600">Store</span>
          </h1>
          <p className="text-zinc-400 mt-2 uppercase tracking-[0.3em] text-sm">
            Componentes de precisión para la victoria
          </p>
        </div>
      </section>

      {/* Contenedor de Productos */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-10 border-l-4 border-red-600 pl-4">
          <h2 className="text-3xl font-bold uppercase italic">Catálogo de Piezas</h2>
          <span className="text-zinc-500 font-mono text-sm">{productos.length} Items Encontrados</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 bg-zinc-900 animate-pulse rounded-lg border border-zinc-800"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productos.map((item) => (
              <div 
                key={item.id_producto}
                className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-red-500 transition-all duration-300"
              >
                {/* Imagen con Aspect Ratio */}
                <div className="aspect-square overflow-hidden bg-zinc-800 relative">
                  <img 
                    src={item.imagen_url || 'https://via.placeholder.com/400x400?text=Sin+Imagen'} 
                    alt={item.nombre}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  />
                  {item.stock <= 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="bg-red-600 px-3 py-1 text-xs font-bold uppercase -rotate-12">Agotado</span>
                    </div>
                  )}
                </div>

                {/* Detalles */}
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-1 truncate group-hover:text-red-500 transition-colors">
                    {item.nombre}
                  </h3>
                  <p className="text-zinc-500 text-xs line-clamp-2 h-8 mb-4">
                    {item.descripcion || 'Especificaciones técnicas no disponibles.'}
                  </p>
                  
                  <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
                    <span className="text-2xl font-black text-white italic">
                      {Number(item.precio).toLocaleString('es-PE', {
                        style: 'currency',
                        currency: 'PEN',
                        minimumFractionDigits: 2,})}
                    </span>
                    <button 
                      disabled={item.stock <= 0}
                      className="bg-white text-black text-[10px] font-black px-4 py-2 rounded uppercase tracking-tighter hover:bg-red-600 hover:text-white transition-colors disabled:bg-zinc-800 disabled:text-zinc-600"
                    >
                      {item.stock > 0 ? 'Agregar' : 'N/A'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mensaje si no hay productos */}
        {!loading && productos.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-zinc-800 rounded-3xl">
            <p className="text-zinc-500 uppercase tracking-widest">No hay piezas disponibles en el inventario actual</p>
          </div>
        )}
      </div>
    </main>
  );
}