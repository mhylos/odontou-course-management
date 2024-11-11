import Image from "next/image";
import SidebarItem from "./SidebarItem";

interface SidebarProps {
  routes: Array<{
    title: string;
    href: string;
  }>;
}

export default function Sidebar({ routes }: SidebarProps) {
  return (
    <aside
      id="logo-sidebar"
      className="z-40 h-full border-r-2 border-solid border-primary grid grid-rows-[200px_1fr]"
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
      <nav className="flex flex-col py-5 h-full px-5">
        {routes.map((item) => (
          <SidebarItem
            key={item.title}
            title={item.title}
            href={item.href}
            className="border-b-2 border-solid border-primary"
          />
        ))}
        <SidebarItem
          title={"Cerrar Sesión"}
          href={"/logout"}
          className="mt-auto border-t-2 border-solid border-primary"
        />
      </nav>
    </aside>
  );
}
