import Sidebar from "@/components/common/Sidebar/Sidebar";

interface RootLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default async function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <div className="grid grid-cols-[auto_1fr] h-screen">
      <Sidebar
        routes={[
          {
            title: "Inicio",
            href: "/",
          },
          {
            title: "Cursos",
            href: "/cursos",
          },
          {
            title: "Académicos",
            href: "/academicos",
          },
          {
            title: "Estudiantes",
            href: "/estudiantes",
          },
          {
            title: "Departamentos",
            href: "/departamentos",
          },
        ]}
      />
      {modal}
      <main className="p-5 grid grid-rows-[10rem_1fr] gap-2 h-screen">
        {children}
      </main>
    </div>
  );
}
