'use client';

import { useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginCliente() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Consulta manual a tu tabla de clientes
    const { data, error } = await supabase
      .from('clientes')
      .select('id_cliente, nombre_completo, email, password, activo')
      .eq('email', email)
      .single(); // Esperamos un único resultado

    if (error || !data) {
      alert("⚠️ Piloto no encontrado. Verifica tus credenciales.");
      setLoading(false);
      return;
    }

    // Validación de password (Texto plano según tu configuración actual)
    if (data.password === password) {
      if (!data.activo) {
        alert("🚫 Tu cuenta de piloto está desactivada.");
        setLoading(false);
        return;
      }

      // Éxito: Guardamos la sesión de forma básica (puedes usar cookies o localStorage)
      localStorage.setItem('user_session', JSON.stringify({
        id: data.id_cliente,
        nombre: data.nombre_completo
      }));

      alert(`✅ ¡Bienvenido de nuevo, ${data.nombre_completo}!`);
      router.push('/client/profile'); // Redirigir al perfil del cliente
    } else {
      alert("❌ Contraseña incorrecta.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-sm mx-auto my-20 p-8 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl relative overflow-hidden">
      {/* Detalle visual superior */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
      
      <header className="mb-10 text-center">
        <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">
          Login <span className="text-red-600">Pit</span>
        </h2>
        <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] mt-2">Acceso a la Escudería</p>
      </header>

      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2 ml-1">Email Registrado</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white rounded-xl focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all"
            placeholder="piloto@racing.com"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2 ml-1">Contraseña</label>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white rounded-xl focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 text-white font-black py-4 rounded-xl uppercase italic tracking-widest transition-all shadow-[0_10px_20px_rgba(220,38,38,0.2)]"
        >
          {loading ? 'Validando...' : 'Iniciar Motor'}
        </button>

        <div className="text-center pt-4">
          <p className="text-zinc-500 text-xs">
            ¿No tienes cuenta? <a href="/registro" className="text-red-500 hover:underline font-bold italic">Regístrate aquí</a>
          </p>
        </div>
      </form>
    </div>
  );
}