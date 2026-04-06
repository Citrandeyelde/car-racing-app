"use client";
import { useEffect, useRef } from "react";
import { useCart } from "@/app/context/cartContext";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function SuccessPage() {
  const { clearCart } = useCart();
  const hasCleared = useRef(false); // Evita que se ejecute dos veces en React Strict Mode

  useEffect(() => {
    if (!hasCleared.current) {
      clearCart();
      hasCleared.current = true;
    }
  }, [clearCart]);
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-zinc-900 border-2 border-green-500 p-10 text-center shadow-[0_0_50px_rgba(34,197,94,0.2)]">
        <div className="flex justify-center mb-6">
    <CheckCircleIcon className="h-20 w-20 text-green-500 animate-bounce" />
        </div>
        
        <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2">
          ¡PAGO <span className="text-green-500">CONFIRMADO!</span>
        </h1>
        <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-8">
          Tu pedido ha sido registrado en los Pits.
        </p>

        <div className="space-y-4">
          <Link
            href="/client/home"
            className="block w-full bg-white text-black py-4 font-black italic uppercase hover:bg-green-500 hover:text-white transition-all transform active:scale-95"
          >
            Volver a la Tienda
          </Link>
          
          <p className="text-[10px] text-zinc-600 font-black uppercase italic">
            Recibirás un correo con los detalles de tu envío pronto.
          </p>
        </div>
      </div>
    </div>
  );
}