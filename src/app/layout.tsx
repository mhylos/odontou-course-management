import type { Metadata } from "next";
import { Slide, ToastContainer } from "react-toastify";
import { SessionProvider } from "next-auth/react";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gestión de cobros y pagos",
  description:
    "Gestor de cursos de la Escuela de Graduados de Odontología de la Universidad de Chile",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="es">
        <body className={"antialiased"}>
          <ToastContainer
            hideProgressBar
            autoClose={2000}
            pauseOnFocusLoss={false}
            pauseOnHover={false}
            transition={Slide}
          />
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
