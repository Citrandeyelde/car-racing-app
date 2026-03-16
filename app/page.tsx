'use client'
import { crearProducto } from '@/app/admin/productos/actions'
import { useRef } from 'react'

export default function AdminProductos() {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-black text-slate-900 mb-6 uppercase tracking-wider">
        🏎️ Car Racing - Gestión de Stock
      </h1>
      
      <form 
        ref={formRef}
        action={async (formData) => {
          const res = await crearProducto(formData)
          if (res?.success) {
            alert("Producto guardado con éxito")
            formRef.current?.reset() // Limpia el formulario
          } else {
            alert("Error: " + res?.error)
          }
        }} 
        className="flex flex-col gap-4 max-w-md bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-600"
      >
        <div className="flex flex-col">
          <label className="text-sm font-bold text-slate-600">Nombre del Repuesto</label>
          <input name="nombre" placeholder="Ej: Amortiguador Nitro" className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" required />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-bold text-slate-600">Descripción Técnica</label>
          <textarea name="descripcion" placeholder="Especificaciones del producto..." className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-bold text-slate-600">Precio ($)</label>
            <input name="precio" type="number" step="0.01" placeholder="0.00" className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" required />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-bold text-slate-600">Stock Inicial</label>
            <input name="stock" type="number" placeholder="0" className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" required />
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-bold text-slate-600">ID Categoría</label>
          <input name="id_categoria" type="number" placeholder="1 (Motores), 2 (Suspensión)..." className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" required />
        </div>
        
        <button type="submit" className="bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition-colors uppercase mt-2">
          Guardar en Inventario
        </button>
      </form>
    </div>
  )
}