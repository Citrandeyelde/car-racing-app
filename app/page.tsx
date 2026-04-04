'use client'
import { redirect } from 'next/navigation'

export default function AdminProductos() {
  redirect('/client/home')
   // Redirige a la página de productos después de crear uno nuevo
  return null
}