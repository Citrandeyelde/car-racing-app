import { createClient } from '@/app/lib/server';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const cookieStore = await cookies();
  const session = cookieStore.get('user_session')?.value;
  if (!session) redirect('/admin/login');

  const supabase = await createClient();

  // Traemos el pedido y sus detalles haciendo un JOIN con la tabla detalles_pedido
  const { data: order, error } = await supabase
    .from('pedidos')
    .select(`
      id_pedido,
      fecha_pedido,
      estado,
      total,
      metodo_pago,
      detalles_pedido (
        id_detalle,
        id_producto,
        cantidad,
        precio_unitario
      )
    `)
    .eq('id_pedido', params.id)
    .single();

  if (error || !order) return notFound();

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => window.history.back()} 
          className="text-red-600 text-xs font-black uppercase mb-6 hover:underline"
        >
          ← Volver a la parrilla
        </button>

        <header className="mb-10 border-b border-zinc-800 pb-6">
          <h1 className="text-4xl font-black italic uppercase italic">Pedido #{order.id_pedido}</h1>
          <p className="text-zinc-500 text-sm mt-2">
            Realizado el {new Date(order.fecha_pedido).toLocaleString()}
          </p>
        </header>

        {/* TABLA DE PRODUCTOS DENTRO DEL PEDIDO */}
        <div className="bg-zinc-900 border border-zinc-800 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-800/50 text-red-600 border-b border-zinc-800">
                <th className="p-4 text-[10px] font-black uppercase italic">Producto ID</th>
                <th className="p-4 text-[10px] font-black uppercase italic">Cantidad</th>
                <th className="p-4 text-[10px] font-black uppercase italic">Precio Un.</th>
                <th className="p-4 text-[10px] font-black uppercase italic">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {order.detalles_pedido?.map((detalle: any) => (
                <tr key={detalle.id_detalle} className="hover:bg-black/40 transition-colors">
                  <td className="p-4 font-mono text-xs text-zinc-500">#{detalle.id_producto}</td>
                  <td className="p-4 text-xs font-bold uppercase">{detalle.cantidad}x</td>
                  <td className="p-4 text-xs font-bold uppercase text-zinc-400">
                    ${Number(detalle.precio_unitario).toFixed(2)}
                  </td>
                  <td className="p-4 font-black text-red-600 italic">
                    ${(detalle.cantidad * detalle.precio_unitario).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            {/* PIE DE TABLA CON EL TOTAL GENERAL */}
            <tfoot className="bg-zinc-800/20 border-t border-zinc-800">
              <tr>
                <td colSpan={3} className="p-4 text-right text-[10px] font-black uppercase text-zinc-500">
                  Total Final del Pedido
                </td>
                <td className="p-4 text-xl font-black text-white italic">
                  ${Number(order.total).toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}