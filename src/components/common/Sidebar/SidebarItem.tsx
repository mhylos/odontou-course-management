import Link, { LinkProps } from "next/link";
import { HTMLProps } from "react";

interface SidebarItemProps extends LinkProps {
  title: String;
  className?: string;
}

export default function SidebarItem({
  title,
  className,
  ...props
}: SidebarItemProps) {
  return (
    <Link
      className={`text-xl text-center font-extralight hover:bg-gray-100 mx-4 w-full grid-cols-1 ${
        className ? className : ""
      }`}
      {...props}
    >
      <h3 className="py-5">{title}</h3>
    </Link>
  );
}
