import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

export const metadata: Metadata = {
  title: "Escuela de Graduados",
  description: "Gestor de cursos de la Escuela de Graduados de Odontología de la Universidad de Chile",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={'antialiased'}
      >
        {children}
      </body>
    </html>
  );
}
