"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationBarProps {
  routes: Array<{
    title: string;
    href: string;
  }>;
}

const ACTIVE_CLASS =
  "bg-primary border-primary text-white text-base xl:text-xl pointer-events-none";
const INACTIVE_CLASS = "border-gray-100 text-xs xl:text-sm h-max";

export default function NavigationBar({ routes }: NavigationBarProps) {
  const pathname = usePathname();
  const splitPath = pathname.split("/");
  const currentSectionPath = splitPath[4] ?? splitPath[3];

  return (
    <div className="w-full h-max border-b-4 border-primary flex justify-between items-end gap-1 flex-wrap">
      {routes.map((item) => {
        const isActive = item.href.split("/").pop() === currentSectionPath;
        return (
          <Link
            href={item.href}
            key={item.title}
            className={`border-solid py-2 px-3 border-x-2 border-t-2 rounded-t transition-all text-center ${
              isActive ? ACTIVE_CLASS : INACTIVE_CLASS
            }`}
            onMouseEnter={(e) =>
              e.currentTarget.classList.add("text-[1.1rem]", "bg-gray-100")
            }
            onMouseLeave={(e) =>
              e.currentTarget.classList.remove("text-[1.1rem]", "bg-gray-100")
            }
          >
            {item.title}
          </Link>
        );
      })}
    </div>
  );
}
