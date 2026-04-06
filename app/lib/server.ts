// Importamos directamente de la librería oficial para evitar conflictos de nombres
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function createClient() {
  // Ahora usamos el alias 'createSupabaseClient' para evitar el error en el return
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}