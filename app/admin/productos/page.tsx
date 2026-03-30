'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase'; // Asegúrate de que esta ruta sea correcta

interface Categoria {
  id_categoria: number;
  nombre: string;
}

export default function RegistroProducto() {
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  
  const [formData, setFormData] = useState({
    nombre: '',
    id_categoria: '', // Guardamos el ID seleccionado
    descripcion: '',
    precio: '',
    stock: 0,
    imagen_url: '',
    activo: true
  });

  // 1. Cargar categorías al iniciar
  useEffect(() => {
    const fetchCategorias = async () => {
      const { data, error } = await supabase
        .from('categorias')
        .select('id_categoria, nombre')
        .order('nombre', { ascending: true });

      if (error) {
        console.error('Error cargando categorías:', error.message);
      } else {
        setCategorias(data || []);
      }
    };

    fetchCategorias();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mapeo exacto a tu tabla public.productos
    const { error } = await supabase
      .from('productos')
      .insert([{
        nombre: formData.nombre,
        descripcion: formData.descripcion || null,
        id_categoria: formData.id_categoria ? parseInt(formData.id_categoria) : null,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock.toString()),
        imagen_url: formData.imagen_url || null,
        activo: formData.activo
      }]);

    if (error) {
      alert(`Error: ${error.message}`);
    } else {
      alert("✅ Producto añadido al inventario");
      setFormData({
        nombre: '', id_categoria: '', descripcion: '', 
        precio: '', stock: 0, imagen_url: '', activo: true 
      });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto my-10 p-8 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl">
      <h2 className="text-3xl font-black text-white italic mb-6 uppercase tracking-tighter border-b border-red-600 pb-2">
        📥 Registro de Inventario
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Nombre */}
          <div className="md:col-span-2">
            <label className="text-xs font-bold text-zinc-500 uppercase">Nombre del Producto</label>
            <input 
              required name="nombre" value={formData.nombre} onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white rounded mt-1 focus:border-red-500 outline-none"
              placeholder="Ej: Alerón de Fibra de Carbono"
            />
          </div>

          {/* Selector de Categoría (Item List) */}
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase">Categoría</label>
            <select 
              name="id_categoria" 
              value={formData.id_categoria} 
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white rounded mt-1 focus:border-red-500 outline-none appearance-none"
            >
              <option value="">Seleccionar categoría...</option>
              {categorias.map((cat) => (
                <option key={cat.id_categoria} value={cat.id_categoria}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Precio */}
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase">Precio ($)</label>
            <input 
              required type="number" step="0.01" name="precio" value={formData.precio} onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white rounded mt-1 focus:border-red-500 outline-none"
              placeholder="0.00"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase">Stock Inicial</label>
            <input 
              required type="number" name="stock" value={formData.stock} onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white rounded mt-1 focus:border-red-500 outline-none"
            />
          </div>

          {/* URL Imagen */}
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase">URL de Imagen</label>
            <input 
              type="url" name="imagen_url" value={formData.imagen_url} onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white rounded mt-1 focus:border-red-500 outline-none"
              placeholder="https://..."
            />
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="text-xs font-bold text-zinc-500 uppercase">Descripción</label>
          <textarea 
            name="descripcion" value={formData.descripcion} onChange={handleChange}
            className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white rounded mt-1 h-24 focus:border-red-500 outline-none"
          />
        </div>

        {/* Estado Activo */}
        <div className="flex items-center gap-3">
          <input 
            type="checkbox" name="activo" checked={formData.activo} onChange={handleChange}
            className="w-5 h-5 accent-red-600 cursor-pointer"
          />
          <span className="text-sm text-zinc-400">Marcar como producto activo</span>
        </div>

        <button 
          disabled={loading}
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded uppercase transition-all shadow-lg shadow-red-900/20 disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Registrar Producto'}
        </button>
      </form>
    </div>
  );
}