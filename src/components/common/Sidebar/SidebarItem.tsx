import Link, { LinkProps } from "next/link";

interface SidebarItemProps extends LinkProps {
  title: string;
  className?: string;
}

export default function SidebarItem({
  title,
  className,
  ...props
}: SidebarItemProps) {
  return (
    <Link
      className={`text-xl text-center font-extralight hover:bg-gray-100 py-5 ${
        className ? className : ""
      }`}
      {...props}
    >
      {title}
    </Link>
  );
}
