"use client";
import { useEffect, useRef } from "react";
import { useCart } from "@/app/context/cartContext";
import { useRouter } from "next/navigation";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

export default function SuccessPage() {
  const { clearCart } = useCart();
  const router = useRouter();
  const hasCleared = useRef(false);

  useEffect(() => {
    // Solo limpiamos el carrito una vez al cargar la página
    if (!hasCleared.current) {
      clearCart();
      hasCleared.current = true;
    }
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
      {/* Icono de Éxito Animado */}
      <div className="mb-6 animate-bounce">
        <CheckCircleIcon className="h-24 w-24 text-yellow-400 mx-auto" />
      </div>

      <h1 className="text-5xl md:text-7xl font-black italic mb-2 tracking-tighter">
        ¡PAGO CONFIRMADO!
      </h1>
      
      <p className="text-zinc-400 text-lg uppercase tracking-widest mb-8">
        Tu pedido ha sido procesado por el equipo de <span className="text-yellow-400">PITS</span>.
      </p>

      <div className="bg-zinc-900 border-l-4 border-yellow-400 p-6 mb-10 max-w-md w-full">
        <p className="text-sm text-zinc-300 font-mono">
          Recibirás un correo con el detalle de tu compra en unos minutos. 
          Ya puedes ver el estado de tu pedido en tu perfil de piloto.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full max-w-md">
        <button
          onClick={() => router.push("/profile")}
          className="flex-1 bg-yellow-400 text-black py-4 font-black italic text-xl hover:bg-yellow-500 transition-all transform active:scale-95 uppercase"
        >
          Ver mis pedidos
        </button>
        
        <button
          onClick={() => router.push("/shop")}
          className="flex-1 border-2 border-zinc-700 py-4 font-black italic text-xl hover:bg-white hover:text-black transition-all transform active:scale-95 uppercase"
        >
          Seguir comprando
        </button>
      </div>

      {/* Decoración de fondo */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-yellow-400 opacity-20 blur-sm"></div>
      <div className="fixed top-0 right-0 w-32 h-32 bg-yellow-400 opacity-5 blur-[100px] rounded-full"></div>
    </div>
  );
}