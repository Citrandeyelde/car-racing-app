
import "./globals.css";
import Navbar from "@/app/components/navbar";
import Footer from "./components/footpage";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        {children}
        <Footer/>
      </body>
    </html>
  );
}
