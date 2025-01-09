"use client";

import Button from "../Button";

interface DeleteRowButtonProps
  extends React.ComponentPropsWithoutRef<"button"> {}

export default function DeleteRowButton({ ...props }: DeleteRowButtonProps) {
  return (
    <Button
      {...props}
      className="icon-[ph--trash] grid place-items-center h-5 aspect-square p-2"
    ></Button>
  );
}
