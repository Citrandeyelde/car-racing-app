'use client'
import { setCookie } from 'cookies-next';
import { supabase } from '@/app/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    // 1. Buscamos al trabajador en tu tabla manual
    const { data, error } = await supabase
      .from('trabajadores')
      .select('*')
      .eq('email', email)
      .eq('password_hash', password) // Idealmente aquí usarías bcrypt después
      .single();

    if (data) {
      // 2. Si existe, creamos una cookie que expire en 1 día
      setCookie('user_session', 'active', { maxAge: 60 * 60 * 24 });
      router.push('/admin/home'); // Redirigir al panel
    } else {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Contraseña" required />
      <button type="submit">Entrar</button>
    </form>
  );
}
