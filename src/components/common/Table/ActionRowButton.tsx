"use client";

import Button from "../Button";

interface AddBottomRowButtonProps
  extends React.ComponentPropsWithoutRef<"button"> {
  children?: React.ReactNode;
}

export default function ActionRowButton({
  children,
  className = "",
  ...props
}: AddBottomRowButtonProps) {
  return (
    <Button
      {...props}
      className={`!p-0 grid place-items-center h-10 aspect-square ${className}`.trimEnd()}
    >
      {children}
    </Button>
  );
}
