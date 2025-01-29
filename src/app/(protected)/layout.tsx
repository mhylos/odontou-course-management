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
            description: "Ultimas operaciones",
            href: "/",
            icon: <span className="icon-[ph--house]" />,
          },
          {
            title: "Cursos",
            description: "Gestión de cursos",
            href: "/cursos",
            icon: <span className="icon-[ph--graduation-cap]" />,
          },
          {
            title: "Académicos",
            description: "Gestión de académicos",
            href: "/academicos",
            icon: <span className="icon-[ph--users-three]" />,
          },
          {
            title: "Estudiantes",
            description: "Gestión de estudiantes",
            href: "/estudiantes",
            icon: <span className="icon-[ph--student]" />,
          },
          {
            title: "Departamentos",
            description: "Gestión de departamentos",
            href: "/departamentos",
            icon: <span className="icon-[ph--buildings]" />,
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
