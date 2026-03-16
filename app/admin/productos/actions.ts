
'use server' // O puedes usar 'use server' si prefieres manejarlo 100% en el servidor
import { supabase } from "@/app/lib/supabase"
import { revalidatePath } from 'next/cache'

interface ActionResponse {
  success?: boolean;
  error?: string;
}

export async function crearProducto(formData: FormData): Promise<ActionResponse> {
  const nombre = formData.get('nombre') as string
  const descripcion = formData.get('descripcion') as string
  const precio = parseFloat(formData.get('precio') as string)
  const stock = parseInt(formData.get('stock') as string)
  const id_categoria = parseInt(formData.get('id_categoria') as string)

  const { error } = await supabase
    .from('productos')
    .insert([{ 
        nombre, 
        descripcion, 
        precio, 
        stock, 
        id_categoria 
    }])

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/productos') 
  return { success: true }
}