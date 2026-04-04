"use client";
export default function Footer() {
  return (
    <nav>
      <footer className="w-full p-4 bg-gray-900 text-white text-center mt-auto">
        <p>
          © {new Date().getFullYear()} Car Racing App - Todos los derechos
          reservados.
        </p>
      </footer>
    </nav>
  );
}
