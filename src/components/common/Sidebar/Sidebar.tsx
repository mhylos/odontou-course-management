"use client";

import Image from "next/image";
import SidebarItem from "./SidebarItem";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "@/app/context/sidebarContext";
import { useSession } from "next-auth/react";
import Button from "../Button";
import Link from "next/link";
import { ReactNode } from "react";
import SidebarItemDescription from "./SidebarItemDescription";

interface SidebarProps {
  routes: Array<{
    title: string;
    description?: string;
    href: string;
    icon: ReactNode;
  }>;
}

const ITEM_HEIGHT = 80; // sidebar item height
const SIDEBAR_GAP = 10; // sidebar item gap

export default function Sidebar({ routes }: SidebarProps) {
  const session = useSession();
  const { push } = useRouter();
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
            const isActive = currentSectionPath === item.href;
            return (
              <SidebarItem
                key={item.title}
                isActive={isActive}
                height={ITEM_HEIGHT}
                className="border-b-2 border-solid border-primary rounded-md"
              >
                <Link
                  href={item.href}
                  className="w-full h-full flex items-center ps-5 gap-3"
                >
                  {item.icon}
                  <div className="flex flex-col">
                    {item.title}
                    <SidebarItemDescription isActive={isActive}>
                      {item.description}
                    </SidebarItemDescription>
                  </div>
                </Link>
              </SidebarItem>
            );
          })}
          <SidebarItem
            className="mt-auto border-2 border-solid border-primary rounded-md flex justify-between"
            isActive={false}
            height={ITEM_HEIGHT}
          >
            <div
              className="flex items-center gap-2 p-2"
              style={{ height: ITEM_HEIGHT }}
            >
              <span
                className={`icon-[ph--user-square-fill] text-primary text-4xl`}
              />
              <div className="flex flex-col">
                <span className="font-semibold">
                  {session.data?.user?.name}
                </span>
                <span className="text-xs text-gray-500">
                  {session.data?.user?.email}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 p-2 py-4 text-xl justify-around">
              <Button
                className="icon-[ph--password]"
                onClick={() => push("cambiar-contraseña")}
              />
              <Button
                className="icon-[ph--sign-out]"
                onClick={() => push("logout")}
              />
            </div>
          </SidebarItem>
        </nav>
      </div>
    </aside>
  );
}
