"use client";

import Button from "../Button";

interface AddBottomRowButtonProps
  extends React.ComponentPropsWithoutRef<"button"> {}

export default function AddBottomRowButton({
  ...props
}: AddBottomRowButtonProps) {
  return (
    <Button
      {...props}
      className="icon-[ph--plus-square] grid place-items-center h-5 aspect-square p-2"
    ></Button>
  );
}
