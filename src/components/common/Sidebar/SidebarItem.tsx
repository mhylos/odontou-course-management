"use client";

import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

interface SidebarItemProps extends LinkProps {
  title: string;
  activeIndicator: React.RefObject<HTMLDivElement>;
  className?: string;
}

export default function SidebarItem({
  title,
  className,
  activeIndicator,
  ...props
}: SidebarItemProps) {
  const isActive = usePathname() === props.href;
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (isActive && linkRef.current && activeIndicator.current) {
      const linkRect = linkRef.current.getBoundingClientRect();
      const indicatorRect = activeIndicator.current.getBoundingClientRect();
      const translateY =
        linkRect.top - indicatorRect.top < 0
          ? 0
          : linkRect.top - indicatorRect.top;
      const height = linkRect.height;
      const width = linkRect.width;

      activeIndicator.current.style.transform = `translateY(${translateY}px)`;
      activeIndicator.current.style.height = `${height}px`;
      activeIndicator.current.style.width = `${width}px`;
    }
  });

  return (
    <Link
      {...props}
      className={`text-xl text-center font-extralight py-5 transition-colors ${
        className ? className : ""
      }
      ${isActive ? "text-white z-10" : "hover:bg-gray-100"}`}
      ref={linkRef}
    >
      {title}
    </Link>
  );
}
