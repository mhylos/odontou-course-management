"use client";

import Image from "next/image";
import SidebarItem from "./SidebarItem";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/app/context/sidebarContext";

interface SidebarProps {
  routes: Array<{
    title: string;
    href: string;
  }>;
}

const ITEM_HEIGHT = 80; // sidebar item height
const SIDEBAR_GAP = 10; // sidebar item gap

export default function Sidebar({ routes }: SidebarProps) {
  const { isOpen, toggle } = useSidebar();
  const pathname = usePathname();
  const currentSectionPath = `/${pathname.split("/")[1]}`;
  const activeIndex = routes.findIndex(
    (item) => item.href === currentSectionPath
  );

  return (
    <aside
      id="logo-sidebar"
      className={`z-10 h-full border-r-2 border-solid border-primary grid transition-[width] ${
        isOpen
          ? "w-[20rem] grid-rows-[200px_1fr]"
          : "w-[3rem] grid-rows-[200px_1fr]"
      }`}
    >
      <div className="relative bg-primary p-5 grid place-items-center">
        <Image
          src="/logo-sidebar.png"
          alt="Logo Sidebar"
          width={230}
          height={136}
          priority
          className={`object-scale-down ${isOpen ? "block" : "hidden"}`}
        />
        <span
          className={`${
            isOpen
              ? "icon-[material-symbols--left-panel-close-rounded] right-2"
              : "icon-[material-symbols--left-panel-open-rounded]"
          } opacity-60 text-2xl absolute top-2 text-white cursor-pointer`}
          onClick={toggle}
        />
      </div>
      <div className={`p-5 ${isOpen ? "block" : "hidden"}`}>
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
