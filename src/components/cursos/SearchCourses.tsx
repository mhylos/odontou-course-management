"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Dropdown from "@/components/common/Dropdown";
import FloatingInput from "@/components/common/FloatingInput";
import { useDebouncedCallback } from "use-debounce";
import FetchDropdown from "../common/FetchDropdown";

export default function SearchCourses() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  // const form = useForm<SearchCourseSchemaType>({
  //   resolver: zodResolver(searchCourseSchema),
  // });

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
    { value: "cumplidos", name: "Al día" },
    { value: "atrasados", name: "Atrasados" },
  ];

  return (
    <div className="grid grid-cols-[2fr_1fr_1fr] gap-2 pe-2">
      <FloatingInput
        label={"Buscar por nombre"}
        onChange={(e) => handleInput("nombre", e.target.value)}
        defaultValue={searchParams.get("nombre") ?? ""}
      />
      <Dropdown
        id="pagos"
        label="Filtrar pagos"
        options={paymentsOptions}
        clearable={true}
        selected={paymentsOptions.find(
          (option) => option.value == (searchParams.get("pagos") ?? "")
        )}
        onChange={(value) => handleSearch("pagos", value.value.toString())}
        onRemove={() => handleSearch("pagos", "")}
      />
      <FetchDropdown
        label="Año"
        id="year"
        fetchUrl="/api/courses/year/options"
        clearable={true}
        onChange={(value) => handleSearch("fecha", value.value.toString())}
        onRemove={() => handleSearch("fecha", "")}
        fetchDefaultUrl={
          searchParams.get("fecha")
            ? `/api/courses/year/options/${searchParams.get("fecha")}`
            : undefined
        }
      />
    </div>
  );
}
