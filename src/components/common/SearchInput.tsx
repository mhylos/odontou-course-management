"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FloatingInput, {
  FloatingInputProps,
} from "@/components/common/FloatingInput";
import { useDebouncedCallback } from "use-debounce";

interface SearchInputProps extends FloatingInputProps {
  queryName: string;
}

export default function SearchInput({
  queryName,
  className,
  ...props
}: SearchInputProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set(queryName, term);
    } else {
      params.delete(queryName);
    }
    replace(`${pathname}?${params.toString()}`);
  }

  const handleInput = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const term = e.target.value;
      handleSearch(term);
    },
    500
  );

  return (
    <div className={className}>
      <FloatingInput {...props} onChange={handleInput} />
    </div>
  );
}
