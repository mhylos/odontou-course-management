import Link, { LinkProps } from "next/link";

interface SidebarItemProps extends LinkProps {
  title: string;
  isActive: boolean;
  height: number;
  className?: string;
}

export default function SidebarItem(props: SidebarItemProps) {
  return (
    <Link
      className={`text-xl text-center font-extralight transition-colors grid place-items-center z-10 ${
        props.className ? props.className : ""
      } ${props.isActive ? "text-white" : "hover:bg-gray-100"}`}
      href={props.href}
      style={{ height: props.height }}
    >
      {props.title}
    </Link>
  );
}
