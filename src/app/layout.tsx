import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Escuela de Graduados",
  description:
    "Gestor de cursos de la Escuela de Graduados de Odontología de la Universidad de Chile",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={"antialiased"}>
        <ToastContainer />
        {children}
      </body>
    </html>
  );
}
