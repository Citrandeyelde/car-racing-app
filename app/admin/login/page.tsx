'use client';

import { useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function WorkerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from('trabajadores')
      .select('id_trabajador, password_hash, activo')
      .eq('email', email)
      .single();

    if (data && data.password_hash === password) {
      if (!data.activo) return alert("Cuenta desactivada");

      Cookies.set('user_session', data.id_trabajador, { expires: 1,path: '/'});
      router.push('/admin/home');
      
    } else {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form onSubmit={handleLogin} className="p-8 bg-zinc-900 rounded-lg border border-red-600">
        <h1 className="text-white font-black italic mb-4 uppercase">Login Staff</h1>
        <input 
          type="email" 
          placeholder="Email" 
          className="w-full p-2 mb-2 bg-black text-white border border-zinc-800"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="w-full p-2 mb-4 bg-black text-white border border-zinc-800"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-red-600 text-white font-bold py-2 italic uppercase">
          Entrar a Pits
        </button>
      </form>
    </div>
  );
}