"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/common/Button";
import Dropdown from "@/components/common/Dropdown";
import FloatingInput from "@/components/common/FloatingInput";
import { useDebouncedCallback } from "use-debounce";

export default function SearchCourses() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleSearch(type: string, term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set(type, term);
    } else {
      params.delete(type);
    }
    replace(`${pathname}?${params.toString()}`);
  }

  const handleInput = useDebouncedCallback((type: string, term: string) => {
    handleSearch(type, term);
  }, 500);

  const paymentsOptions = [
    { value: 1, name: "Completos" },
    { value: 0, name: "Pendientes" },
  ];

  return (
    <div className="grid grid-cols-[2fr_1fr] gap-2 pe-2">
      <div className="relative grid grid-cols-[1fr]">
        <FloatingInput
          label={"Buscar por nombre"}
          onChange={(e) => handleInput("name", e.target.value)}
        />
        <Button className="text-white absolute end-2.5 max-w-max grid place-items-center">
          <span className="icon-[ic--round-search] text-white text-xl" />
        </Button>
      </div>
      <Dropdown
        label="Filtrar pagos"
        options={paymentsOptions}
        clearable={true}
        selected={paymentsOptions.find(
          (option) =>
            option.value == parseInt(searchParams.get("payments") ?? "")
        )}
        onChange={(value) => handleSearch("payments", value.value.toString())}
        onRemove={() => handleSearch("payments", "")}
      />
    </div>
  );
}
