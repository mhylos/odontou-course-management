"use client";

import Link from "next/link";

interface EditRowButtonProps {
  onEdit?: () => void;
  href?: string;
}

export default function EditRowButton({ onEdit, href }: EditRowButtonProps) {
  if (href) {
    return (
      <Link
        href={href}
        className="button icon-[ph--note-pencil] text-primary grid place-items-center h-5 aspect-square p-2"
      ></Link>
    );
  }

  return (
    <button
      onClick={onEdit}
      className="button icon-[ph--note-pencil] grid place-items-center h-5 aspect-square p-2"
    ></button>
  );
}
