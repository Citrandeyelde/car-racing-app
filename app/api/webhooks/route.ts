import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

// CLAVE: Usar SERVICE_ROLE_KEY para ignorar las políticas RLS de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const cartItems = JSON.parse(session.metadata?.cartItems || "[]");

    // 1. Insertar Pedido Principal
    const { data: pedido, error: errorPedido } = await supabase
      .from("pedidos")
      .insert({
        id_cliente: userId === "invitado" ? null : userId,
        total: (session.amount_total || 0) / 100,
        estado: "completado",
        metodo_pago: "STRIPE",
        fecha_pedido: new Date().toISOString(),
      })
      .select()
      .single();

    if (errorPedido) {
      console.error("❌ Error Supabase (Pedido):", errorPedido.message);
      // Devolvemos 200 a Stripe para que no reintente, pero logueamos el error
      return new NextResponse("Error en DB", { status: 200 });
    }

    // 2. Insertar Detalles del Pedido
    if (pedido && cartItems.length > 0) {
      const detalles = cartItems.map((item: any) => ({
        id_pedido: pedido.id_pedido, // Verifica que el nombre de columna sea correcto
        id_producto: item.id,
        cantidad: item.qty,
        precio_unitario: item.price,
      }));

      const { error: errorDetalles } = await supabase
        .from("detalles_pedido")
        .insert(detalles);

      if (errorDetalles) {
        console.error("❌ Error Supabase (Detalles):", errorDetalles.message);
      } else {
        console.log(`✅ Pedido #${pedido.id_pedido} creado con éxito.`);
      }
    }
  }

  return new NextResponse("Evento procesado", { status: 200 });
}