"use client";

import Image from "next/image";
import SidebarItem from "./SidebarItem";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/app/context/sidebarContext";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ReactNode } from "react";
import SidebarItemDescription from "./SidebarItemDescription";
import Skeleton from "react-loading-skeleton";

export interface SidebarProps {
  routes: SidebarRoute[];
}

export interface SidebarRoute {
  title: string;
  description?: string;
  href: string;
  icon: ReactNode;
}

const ITEM_HEIGHT = 80; // sidebar item height
const SIDEBAR_GAP = 10; // sidebar item gap

export default function Sidebar({ routes }: SidebarProps) {
  const session = useSession();
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
          src="/logo-horizontal.png"
          alt="Logo Sidebar"
          width={250}
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
                  {/* {item.icon} */}
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
            isActive={activeIndex === -1}
            height={ITEM_HEIGHT}
          >
            <div
              className="flex flex-1 items-center gap-2 p-2"
              style={{ height: ITEM_HEIGHT }}
            >
              <span
                className={`icon-[ph--user-square-fill] text-4xl ${
                  activeIndex === -1 ? "text-white" : "text-primary"
                }`}
              />
              <div className="flex flex-col flex-1">
                <span className="font-semibold">
                  {session.status === "loading" ? (
                    <Skeleton />
                  ) : (
                    session.data?.user?.name
                  )}
                </span>
                <span
                  className={`text-xs ${
                    activeIndex === -1 ? "text-white" : "text-gray-500"
                  }`}
                >
                  {session.status === "loading" ? (
                    <Skeleton />
                  ) : (
                    session.data?.user?.email
                  )}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 px-3 py-4 text-xl justify-around">
              <Link
                href="/cambiar-clave"
                className={`icon-[ph--password] ${
                  activeIndex === -1 ? "text-white" : "text-primary"
                }`}
              />
              <Link
                href={`/logout`}
                className={`icon-[ph--sign-out] ${
                  activeIndex === -1 ? "text-white" : "text-primary"
                } `}
              />
            </div>
          </SidebarItem>
        </nav>
      </div>
    </aside>
  );
}
