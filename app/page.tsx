'use client'
import { crearProducto } from '@/app/admin/productos/actions'
import { useRef } from 'react'
import { redirect } from 'next/navigation'

export default function AdminProductos() {
  redirect('/client/home')
  return null
}                                           
