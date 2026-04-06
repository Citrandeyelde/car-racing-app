import { createClient } from '@/app/lib/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

// --- COMPONENTE DEL MODAL (Server Component) ---
async function OrderModal({ orderId }: { orderId: string }) {
  const supabase = await createClient();

  // Dentro de la función OrderModal, cambia la consulta por esta:
const { data: order, error } = await supabase
  .from('pedidos')
  .select(`
    id_pedido,
    total,
    fecha_pedido,
    detalles_pedido (
      id_detalle,
      cantidad,
      precio_unitario,
      id_producto,
      productos (
        nombre
      )
    )
  `)
  .eq('id_pedido', orderId)
  .single();

  if (error || !order) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
      <div className="bg-zinc-900 border-2 border-red-600 w-full max-w-2xl shadow-[0_0_50px_rgba(220,38,38,0.3)]">
        {/* Header del Modal */}
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
          <div>
            <h2 className="text-2xl font-black italic uppercase text-white tracking-tighter">
              Detalle del Ticket <span className="text-red-600">#{orderId}</span>
            </h2>
            <p className="text-[10px] text-zinc-500 font-bold uppercase">
              {new Date(order.fecha_pedido).toLocaleString('es-ES')}
            </p>
          </div>
          <Link 
            href="/admin/orders" 
            scroll={false}
            className="bg-red-600 text-white px-4 py-2 font-black hover:bg-white hover:text-black transition-all uppercase italic text-xs"
          >
            Cerrar
          </Link>
        </div>
        
        {/* Cuerpo del Modal con Scroll si hay muchos productos */}
        <div className="p-6 max-h-[50vh] overflow-y-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-red-600 text-[10px] font-black uppercase italic border-b border-zinc-800">
                <th className="pb-4">Producto</th>
                <th className="pb-4 text-center">Cant.</th>
                <th className="pb-4 text-right">Precio Un.</th>
                <th className="pb-4 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {order.detalles_pedido?.map((item: any) => (
                <tr key={item.id_detalle} className="text-sm">
                  <td className="py-4 font-mono text-zinc-400 text-xs uppercase">{item.productos?.nombre || item.id_producto}</td>
                  <td className="py-4 text-center font-bold text-white">{item.cantidad}</td>
                  <td className="py-4 text-right text-zinc-500">${Number(item.precio_unitario).toFixed(2)}</td>
                  <td className="py-4 text-right font-black text-red-600 italic">
                    ${(item.cantidad * item.precio_unitario).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer del Modal */}
        <div className="p-6 bg-zinc-950 border-t border-zinc-800 flex justify-between items-end">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase text-zinc-500 italic">Status: <span className="text-green-500">Pagado</span></p>
            <p className="text-[10px] font-black uppercase text-zinc-500 italic">Origen: <span className="text-white">Online Store</span></p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase text-red-600 italic leading-none mb-1">Total Final</p>
            <p className="text-4xl font-black italic text-white leading-none">${Number(order.total).toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- PÁGINA PRINCIPAL ---
export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ show?: string }>;
}) {
  // Await necesario en Next.js 15+
  const resolvedParams = await searchParams;
  const showId = resolvedParams.show;

  const cookieStore = await cookies();
  const session = (await cookieStore).get('user_session')?.value;

  if (!session) {
    redirect('/admin/login');
  }

  const supabase = await createClient();

  const { data: orders, error } = await supabase
    .from('pedidos')
    .select(`
      id_pedido,
      fecha_pedido,
      estado,
      total
    `)
    .order('fecha_pedido', { ascending: false });

  if (error) return <div className="p-10 text-red-600 font-black">ERROR: {error.message}</div>;

  const ingresosTotales = orders?.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans selection:bg-red-600 selection:text-white">
      
      {/* RENDERIZADO DEL MODAL */}
      {showId && <OrderModal orderId={showId} />}

      <header className="mb-12 border-l-8 border-red-600 pl-6">
        <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-none">
          PITS <span className="text-red-600">PANEL</span>
        </h1>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em] mt-2">
          Control de Pedidos v1.0
        </p>
      </header>

      {/* DASHBOARD CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-zinc-900 border border-zinc-800 p-8 shadow-lg">
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2">Ingresos Totales</p>
          <p className="text-5xl font-black italic text-red-600 tracking-tighter">${ingresosTotales.toLocaleString()}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-8 shadow-lg">
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2">Total Tickets</p>
          <p className="text-5xl font-black italic text-white tracking-tighter">{orders?.length || 0}</p>
        </div>
      </div>

      {/* TABLA PRINCIPAL */}
      <div className="border border-zinc-800 bg-zinc-900/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-900 border-b-2 border-red-600">
                <th className="p-5 text-[11px] font-black uppercase italic text-red-600">ID Ticket</th>
                <th className="p-5 text-[11px] font-black uppercase italic">Fecha</th>
                <th className="p-5 text-[11px] font-black uppercase italic">Importe</th>
                <th className="p-5 text-[11px] font-black uppercase italic text-center">Estado</th>
                <th className="p-5 text-[11px] font-black uppercase italic text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {orders?.map((order) => (
                <tr key={order.id_pedido} className="hover:bg-red-600/5 transition-all group">
                  <td className="p-5 font-mono text-xs text-zinc-500 group-hover:text-white transition-colors">
                    #{order.id_pedido}
                  </td>
                  <td className="p-5 text-xs font-bold uppercase">
                    {new Date(order.fecha_pedido).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="p-5 font-black text-white italic text-lg">
                    ${Number(order.total).toFixed(2)}
                  </td>
                  <td className="p-5 text-center">
                    <span className="text-[10px] font-black uppercase px-3 py-1 bg-zinc-800 border border-zinc-700 text-zinc-400 italic">
                      {order.estado}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <Link 
                      href={`/admin/orders?show=${order.id_pedido}`}
                      scroll={false}
                      className="bg-white text-black text-[10px] font-black uppercase italic px-6 py-2 hover:bg-red-600 hover:text-white transition-all transform active:scale-95 inline-block"
                    >
                      Ver Detalle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}