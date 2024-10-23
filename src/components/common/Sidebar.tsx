import Image from "next/image";
import Link from "next/link";

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
      <nav className="flex flex-col gap-5 p-5">
        {items.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="text-xl text-center font-extralight"
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
