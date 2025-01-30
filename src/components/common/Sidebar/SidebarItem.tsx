import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface SidebarItemProps {
  children: ReactNode;
  isActive: boolean;
  height: number;
  className?: string;
}

export default function SidebarItem(props: SidebarItemProps) {
  return (
    <div
      className={twMerge(
        `text-xl font-extralight transition-colors grid place-items-center z-10`,
        props.className,
        props.isActive ? "text-white" : "hover:bg-gray-100"
      )}
      style={{ height: props.height }}
    >
      {props.children}
    </div>
  );
}
