import Link, { LinkProps } from "next/link";
import { ReactNode } from "react";

interface SidebarItemProps {
  children: ReactNode;
  isActive: boolean;
  height: number;
  className?: string;
}

export default function SidebarItem(props: SidebarItemProps) {
  return (
    <div
      className={`text-xl font-extralight transition-colors grid place-items-center z-10 ${
        props.className ? props.className : ""
      } ${props.isActive ? "text-white" : "hover:bg-gray-100"}`}
      style={{ height: props.height }}
    >
      {props.children}
    </div>
  );
}
