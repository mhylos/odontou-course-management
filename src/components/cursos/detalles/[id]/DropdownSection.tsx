"use client";

import Subtitle from "@/components/common/Subtitle";
import { useState } from "react";

interface SubsectionProps {
  title: string;
  children: React.ReactNode;
}

export default function DropdownSection({ title, children }: SubsectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <div
        className={`bg-secondary rounded-t flex justify-between items-center px-2 py-1 cursor-pointer transition-[border-radius] ${
          isOpen ? "rounded-t" : "rounded"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Subtitle>{title}</Subtitle>
        <span
          className={`icon-[ci--chevron-down] text-white text-xl transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        ></span>
      </div>
      <div
        className={`transition-[height] ease-out duration-200 ${
          isOpen ? "h-full overflow-auto" : "h-0 overflow-hidden"
        }`}
      >
        {children}
      </div>
    </>
  );
}
