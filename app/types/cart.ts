// app/types/cart.ts

export interface CartItem {
  id_producto: string; // o number, según tu DB
  nombre: string;
  precio: number;      // <--- Asegúrate de que esta línea exista
  quantity: number;
  imagen?: string;     // opcional
  // Si antes tenías 'price' en inglés, cámbialo o mantén ambos:
  // price: number; 
}