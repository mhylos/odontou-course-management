"use client";

import Button from "../Button";

export default function AddBottomRowButton({
  ...props
}: React.ComponentPropsWithoutRef<"button">) {
  return (
    <Button
      {...props}
      className="icon-[ph--plus-square] grid place-items-center h-5 aspect-square p-2"
    ></Button>
  );
}
