"use client";

import Button from "../Button";

export default function DeleteRowButton({
  ...props
}: React.ComponentPropsWithoutRef<"button">) {
  return (
    <Button
      {...props}
      className="icon-[ph--trash] grid place-items-center h-5 aspect-square p-2"
    ></Button>
  );
}
