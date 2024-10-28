import Image from "next/image";
import Link from "next/link";
import SidebarItem from "./SidebarItem";

const items = [
  {
    title: "Inicio",
    href: "/",
  },
  {
    title: "Usuarios",
    href: "/users",
  },
  {
    title: "Cursos",
    href: "/courses",
  },
];

export default function Sidebar() {
  return (
    <aside
      id="logo-sidebar"
      className="fixed top-0 left-0 z-40 w-72 h-screen transition-transform -translate-x-full sm:translate-x-0 border-r-2 border-solid border-primary"
      aria-label="Sidebar"
    >
      <div className="bg-primary p-5">
        <Image
          src="/logo-sidebar.png"
          alt="Logo Sidebar"
          width={230}
          height={136}
          className="object-scale-down"
        />
      </div>
      <nav className="grid gap-1 justify-between">
        {items.map((item) => (
          <SidebarItem
            key={item.title}
            title={item.title}
            href={item}
            className="border-b-2 border-solid border-primary"
          />
        ))}
        <SidebarItem
          title={"Cerrar Sesión"}
          href={"/logout"}
          className="row-end-[-1]"
        />
      </nav>
    </aside>
  );
}
