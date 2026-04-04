'use client'
import { useState } from 'react'
import { supabase } from '@/app/lib/supabase'

export default function RegistroTrabajador() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password:''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const { data, error } = await supabase
    .from('trabajadores') 
    .insert([
      { 
        nombre_completo: formData.nombre, 
        email: formData.email, 
        password_hash: formData.password 
      }
    ])

  if (error) {
    alert("Error: " + error.message)
  } else {
    setFormData({ nombre: '', email: '', password: '' })
    alert("¡Trabajador registrado con valores automáticos!")
  }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
  <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
    <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
      Registro de Trabajador
    </h1>
    
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Grupo: Nombre */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre y Apellido
        </label>
        <input 
          type="text" 
          name="nombre" 
          value={formData.nombre}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          placeholder="Ej. Juan Pérez"
          required 
        />
      </div>

      {/* Grupo: Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Corporativo
        </label>
        <input 
          type="email" 
          name="email" 
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          placeholder="juan@empresa.com"
          required 
        />
      </div>

      {/* Grupo: Contraseña */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Contraseña
        </label>
        <input 
          type="password" 
          name="password" 
          value={formData.password}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          placeholder="••••••••"
          required 
        />
      </div>

      {/* Botón */}
      <button 
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow transition duration-200 ease-in-out transform active:scale-[0.98] mt-2"
      >
        Registrar Trabajador
      </button>
    </form>
  </div>
</section>

  )
}
