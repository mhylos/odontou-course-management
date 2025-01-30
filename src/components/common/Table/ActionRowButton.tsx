"use client";

import Link from "next/link";
import Button from "../Button";
import { twMerge } from "tailwind-merge";

interface AddBottomRowButtonProps
  extends React.ComponentPropsWithoutRef<"button"> {
  children?: React.ReactNode;
  href?: string;
}

export default function ActionRowButton({
  children,
  className = "",
  href,
  ...props
}: AddBottomRowButtonProps) {
  if (href) {
    return (
      <Link
        href={href}
        onClick={(e) => e.stopPropagation()}
        className={twMerge(
          `button !p-0 grid place-items-center h-10 aspect-square`,
          className
        )}
      >
        {children}
      </Link>
    );
  }

  return (
    <Button
      {...props}
      className={`!p-0 grid place-items-center h-10 aspect-square ${className}`.trimEnd()}
    >
      {children}
    </Button>
  );
}
