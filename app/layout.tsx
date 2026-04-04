import "./globals.css";
import Navbar from "@/app/components/navbar";
import Footer from "./components/footpage";
import { CartProvider } from "./context/cartContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <CartProvider>
          <Navbar />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
