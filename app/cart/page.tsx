"use client";
import { useCart } from "@/app/context/cartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CartPage() {
  const { cart, removeFromCart, totalItems, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Calcular el total del carrito para mostrarlo en pantalla
  const totalPrecio = cart.reduce(
    (acc, item) => acc + (item.precio || item.price || 0) * item.quantity,
    0,
  );

  const handleCheckout = async () => {
    setLoading(true);
    try {
      // 1. Obtenemos el ID del usuario del localStorage
      const userId = localStorage.getItem("user_id");

      // 2. IMPORTANTE: Mapeamos el carrito para que la API reciba nombres estandarizados
      // Esto evita el error de "undefined" en el backend
      const formattedCart = cart.map((item: any) => ({
        id_producto: item.id_producto || item.id,
        nombre: item.nombre || item.name || "Producto PITS",
        precio: item.precio || item.price || 0,
        quantity: item.quantity || 1,
      }));

      console.log("Enviando a Stripe:", { formattedCart, userId });

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: formattedCart,
          userId: userId,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url; // Redirección a Stripe
      } else {
        throw new Error(data.error || "Error al crear la sesión de pago");
      }
    } catch (error) {
      console.error("Error en el proceso de pago:", error);
      alert("Hubo un problema al conectar con la pasarela de pago.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-black italic mb-4">
          TU CARRITO ESTÁ VACÍO
        </h1>
        <button
          onClick={() => router.push("/shop")}
          className="bg-yellow-400 text-black px-6 py-2 font-bold hover:bg-yellow-500 transition"
        >
          VOLVER A LA TIENDA
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-black italic mb-8 border-b border-yellow-400 pb-2">
        CARRITO DE COMPRAS ({totalItems})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de Productos */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id_producto || item.id}
              className="bg-zinc-900 p-4 rounded-lg flex justify-between items-center border border-zinc-800"
            >
              <div>
                <h3 className="text-xl font-bold uppercase">
                  {item.nombre || item.name}
                </h3>
                <p className="text-yellow-400 font-mono">
                  ${(item.precio || item.price || 0).toFixed(2)} x{" "}
                  {item.quantity}
                </p>
              </div>
              <button
                onClick={() => removeFromCart(item.id_producto || item.id)}
                className="text-red-500 hover:text-red-400 font-bold text-sm underline"
              >
                ELIMINAR
              </button>
            </div>
          ))}
          <button
            onClick={clearCart}
            className="text-zinc-500 hover:text-white text-xs uppercase tracking-widest"
          >
            Limpiar Carrito
          </button>
        </div>

        {/* Resumen de Pago */}
        <div className="bg-zinc-900 p-6 rounded-xl border-2 border-yellow-400 h-fit">
          <h2 className="text-2xl font-black mb-4 italic">RESUMEN</h2>
          <div className="flex justify-between mb-6 text-lg">
            <span>TOTAL:</span>
            <span className="font-mono text-yellow-400 text-2xl">
              ${totalPrecio.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className={`w-full py-4 font-black text-black text-xl transition transform active:scale-95 ${
              loading
                ? "bg-zinc-600 cursor-not-allowed"
                : "bg-yellow-400 hover:bg-yellow-500 shadow-[0_0_20px_rgba(250,204,21,0.3)]"
            }`}
          >
            {loading ? "PROCESANDO..." : "FINALIZAR PEDIDO"}
          </button>

          <p className="mt-4 text-[10px] text-zinc-500 text-center uppercase">
            Pagos seguros procesados por Stripe
          </p>
        </div>
      </div>
    </div>
  );
}
