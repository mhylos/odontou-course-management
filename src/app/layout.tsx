import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const interRegular = localFont({
  src: "./fonts/Inter-Regular.woff",
  variable: "--font-inter-regular",
  weight: "100 900",
});

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
        className={`${interRegular.variable} ${interRegular.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
