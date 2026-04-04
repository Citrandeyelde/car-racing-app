"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabase";

export default function RegistroCliente() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre_completo: "",
    email: "",
    password: "",
    telefono: "",
    direccion: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const nuevoId = crypto.randomUUID();

    const { error } = await supabase.from("clientes").insert([
      {
        id_cliente: nuevoId,
        nombre_completo: formData.nombre_completo,
        email: formData.email,
        password: formData.password,
        telefono: formData.telefono,
        direccion: formData.direccion,
        activo: true,
      },
    ]);

    if (error) {
      alert(`Error al registrar cliente: ${error.message}`);
    } else {
      alert("🏎️ ¡Piloto registrado con éxito en la base de datos!");
      setFormData({
        nombre_completo: "",
        email: "",
        password: "",
        telefono: "",
        direccion: "",
      });
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-zinc-900 border-b-4 border-red-600 rounded-xl shadow-2xl text-white">
      <h2 className="text-3xl font-black italic uppercase mb-2">
        Registro de Cliente
      </h2>
      <p className="text-zinc-500 text-xs mb-8 tracking-widest uppercase italic">
        Sistema de Gestión Interna
      </p>

      <form onSubmit={handleRegistro} className="space-y-4">
        <div>
          <label className="text-[10px] font-bold text-zinc-400 uppercase">
            Nombre Completo
          </label>
          <input
            required
            name="nombre_completo"
            value={formData.nombre_completo}
            onChange={handleChange}
            className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded focus:border-red-600 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="text-[10px] font-bold text-zinc-400 uppercase">
              Email Corporativo / Personal
            </label>
            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded focus:border-red-600 outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-zinc-400 uppercase">
              Contraseña de Acceso
            </label>
            <input
              required
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded focus:border-red-600 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-zinc-400 uppercase">
            Teléfono de Contacto
          </label>
          <input
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded focus:border-red-600 outline-none"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-zinc-400 uppercase">
            Dirección de Despacho
          </label>
          <textarea
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded h-20 focus:border-red-600 outline-none resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded uppercase italic transition-all shadow-lg"
        >
          {loading ? "Procesando..." : "Crear Cuenta de Cliente"}
        </button>
      </form>
    </div>
  );
}
