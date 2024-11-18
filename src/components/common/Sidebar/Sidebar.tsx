"use client";

import Image from "next/image";
import SidebarItem from "./SidebarItem";
import { usePathname } from "next/navigation";

interface SidebarProps {
  routes: Array<{
    title: string;
    href: string;
  }>;
}

const ITEM_HEIGHT = 80; // sidebar item height
const SIDEBAR_GAP = 10; // sidebar item gap

export default function Sidebar({ routes }: SidebarProps) {
  const pathname = usePathname();
  const currentSectionPath = `/${pathname.split("/")[1]}`;
  const activeIndex = routes.findIndex(
    (item) => item.href === currentSectionPath
  );

  return (
    <aside
      id="logo-sidebar"
      className="z-40 h-full border-r-2 border-solid border-primary grid grid-rows-[200px_1fr]"
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
      <div className="p-5">
        <nav
          className="relative flex flex-col h-full"
          style={{ gap: SIDEBAR_GAP }}
        >
          <div
            className="absolute bg-primary rounded-md transition-all w-full"
            style={{
              height: ITEM_HEIGHT,
              top:
                activeIndex * (ITEM_HEIGHT + SIDEBAR_GAP) < 0
                  ? `calc(100% - ${ITEM_HEIGHT}px)`
                  : activeIndex * (ITEM_HEIGHT + SIDEBAR_GAP),
            }}
          />
          {routes.map((item) => {
            return (
              <SidebarItem
                key={item.title}
                title={item.title}
                href={item.href}
                isActive={currentSectionPath === item.href}
                height={ITEM_HEIGHT}
                className="border-b-2 border-solid border-primary rounded-md"
              />
            );
          })}
          <div className="mt-auto border-t-2 border-solid border-primary rounded-md z-10">
            <SidebarItem
              title={"Cerrar Sesión"}
              href={"/logout"}
              isActive={currentSectionPath === "/logout"}
              height={ITEM_HEIGHT}
            />
          </div>
        </nav>
      </div>
    </aside>
  );
}
