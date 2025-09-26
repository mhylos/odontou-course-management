"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { twMerge } from "tailwind-merge";

interface PaginationProps {
  className?: string;
  currentPage: number;
  totalPages: number;
}

export default function Pagination({
  className,
  currentPage,
  totalPages,
}: PaginationProps) {
  const router = useRouter();
  const currentParams = new URLSearchParams(useSearchParams().toString());

  const onPageChange = (page: number) => {
    currentParams.set("pagina", page.toString());
    router.push(`?${currentParams.toString()}`);
  };

  return (
    <div
      className={twMerge(
        "flex items-center gap-4 rounded bg-white px-4 py-2 shadow-md backdrop-blur-sm",
        className
      )}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="disabled:opacity-20"
      >
        <span className="icon-[ph--caret-left] flex"></span>
      </button>
      <span>
        Página {currentPage} de {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="disabled:opacity-20"
      >
        <span className="icon-[ph--caret-right] flex"></span>
      </button>
    </div>
  );
}
