"use client";

import Image from "next/image";
import SidebarItem from "./SidebarItem";
import { useRef } from "react";

interface SidebarProps {
  routes: Array<{
    title: string;
    href: string;
  }>;
}

export default function Sidebar({ routes }: SidebarProps) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <aside
      id="logo-sidebar"
      className="z-40 h-full border-r-2 border-solid border-primary grid grid-rows-[200px_1fr]"
      aria-label="Sidebar"
    >
      <div className="bg-primary p-5 grid place-items-center">
        <Image
          src="/logo-sidebar.png"
          alt="Logo Sidebar"
          width={230}
          height={136}
          className="object-scale-down"
        />
      </div>
      <nav className="relative flex flex-col py-5 h-full px-5 gap-3">
        <div
          ref={ref}
          className="absolute bg-primary rounded-md transition-transform"
        />
        {routes.map((item) => (
          <SidebarItem
            key={item.title}
            title={item.title}
            href={item.href}
            activeIndicator={ref}
            className="border-b-2 border-solid border-primary rounded-md"
          />
        ))}
        <SidebarItem
          title={"Cerrar Sesión"}
          href={"/logout"}
          activeIndicator={ref}
          className="mt-auto border-t-2 border-solid border-primary rounded-md"
        />
      </nav>
    </aside>
  );
}
