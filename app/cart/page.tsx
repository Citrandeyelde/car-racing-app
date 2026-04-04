"use client";
import { useCart } from "@/app/context/cartContext";
import Link from "next/link";
import Image from "next/image";

import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export default function CartPage() {
  const { cart, removeFromCart, totalItems, addToCart } = useCart();

  const handleCheckout = async () => {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems: cart }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "No se pudo generar la sesión de pago");
      }
    } catch (err) {
      console.error("Error al procesar el pago:", err);
      alert("Hubo un problema al conectar con la pasarela de pago.");
    }
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Tu carrito está vacío
        </h1>
        <p className="text-gray-500 text-center px-4">
          Parece que aún no has añadido ningún accesorio para tu auto.
        </p>
        <Link
          href="/productos"
          className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition"
        >
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 lg:py-12">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900">
        Tu Carrito ({totalItems})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Lista de productos */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 border-b pb-6 last:border-0"
            >
              <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-800">
                  {item.name}
                </h3>
                <p className="text-gray-500 text-sm">
                  Precio unitario: ${item.price}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm font-medium">
                    Cantidad: {item.quantity}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 text-xs hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              </div>

              <div className="text-right font-bold text-gray-900 text-lg">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Resumen del pedido */}
        <div className="bg-gray-50 p-6 rounded-xl h-fit shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Resumen del pedido
          </h2>
          <div className="space-y-3 text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Envío</span>
              <span className="text-green-600 font-medium font-medium">
                Gratis
              </span>
            </div>
            <div className="border-t pt-3 flex justify-between text-xl font-bold text-gray-900">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full mt-8 bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition shadow-lg"
          >
            Pagar con Stripe
          </button>

          <Link
            href="/client/home"
            className="block text-center mt-4 text-sm text-blue-600 hover:underline"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
