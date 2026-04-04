import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

export async function POST(req: Request) {
  try {
    const { cartItems } = await req.json();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: "El carrito está vacío" },
        { status: 400 },
      );
    }

    const line_items = cartItems.map((item: any) => {
      const productData: any = {
        name: item.name,
      };

      if (
        item.image &&
        typeof item.image === "string" &&
        item.image.startsWith("http")
      ) {
        productData.images = [item.image];
      }

      return {
        price_data: {
          currency: "pen",
          product_data: productData,
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${req.headers.get("origin")}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/cart`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Error:", error);
    return NextResponse.json(
      { error: error.message || "Error interno del servidor" },
      { status: 500 },
    );
  }
}
