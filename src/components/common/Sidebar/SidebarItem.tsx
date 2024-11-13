"use client";

import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";

interface SidebarItemProps extends LinkProps {
  title: string;
  className?: string;
}

export default function SidebarItem({
  title,
  className,
  ...props
}: SidebarItemProps) {
  const isActive = usePathname() === props.href;

  return (
    <Link
      className={`text-xl text-center font-extralight hover:bg-gray-100 py-5 ${
        className ? className : ""
      }
      ${isActive ? "bg-primary text-white" : ""}`}
      {...props}
    >
      {title}
    </Link>
  );
}
