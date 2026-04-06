import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  try {
    const { cartItems, userId } = await req.json();

    // LOG DE CONTROL: Revisa en tu terminal si el precio llega correctamente
    console.log("🛒 Items recibidos para Checkout:", cartItems);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      // app/api/checkout/route.ts

      line_items: cartItems.map((item: any) => {
        // Intentamos leer 'precio' o 'price' o 'unit_price'
        const precioRaw = item.precio || item.price || item.unit_price;
        const precioNumerico = parseFloat(precioRaw);

        // Intentamos leer 'nombre' o 'name' o 'title'
        const nombreProducto =
          item.nombre || item.name || item.title || "Producto PITS";

        if (isNaN(precioNumerico)) {
          console.error("❌ Error con el producto:", item); // Esto te dirá exactamente qué trae el objeto
          throw new Error(
            `El producto "${nombreProducto}" tiene un precio inválido.`,
          );
        }

        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: nombreProducto,
            },
            unit_amount: Math.round(precioNumerico * 100),
          },
          quantity: item.quantity || 1,
        };
      }),
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
      metadata: {
        // Guardamos el UUID para el Webhook
        userId: userId || "invitado",
        cartItems: JSON.stringify(
          cartItems.map((item: any) => ({
            id: item.id_producto,
            qty: item.quantity,
            price: item.precio, // Guardamos el precio original para el detalle del pedido
          })),
        ),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("❌ Error en Checkout Session:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
