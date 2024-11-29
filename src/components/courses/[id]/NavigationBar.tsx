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
  "bg-primary border-primary text-white text-2xl pointer-events-none";
const INACTIVE_CLASS = "border-gray-100 text-sm h-max";

export default function NavigationBar({ routes }: NavigationBarProps) {
  const pathname = usePathname();
  const currentRoute = routes.find((route) => route.href === pathname);

  return (
    <div className="w-full h-max border-b-4 border-primary flex justify-between items-end">
      {routes.map((item) => (
        <Link
          href={item.href}
          key={item.title}
          className={`border-solid py-2 px-3 border-x-2 border-t-2 rounded-t transition-all text-center grid place-items-center 
            ${item === currentRoute ? ACTIVE_CLASS : INACTIVE_CLASS}`}
          onMouseEnter={(e) =>
            e.currentTarget.classList.add("text-xl", "bg-gray-100")
          }
          onMouseLeave={(e) =>
            e.currentTarget.classList.remove("text-xl", "bg-gray-100")
          }
        >
          {item.title}
        </Link>
      ))}
    </div>
  );
}
