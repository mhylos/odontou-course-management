"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Dropdown from "@/components/common/Dropdown";
import FloatingInput from "@/components/common/FloatingInput";
import { useDebouncedCallback } from "use-debounce";
import FetchDropdown from "../common/FetchDropdown";
import { Form, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { searchCourseSchema, SearchCourseSchemaType } from "@/lib/zod";

export default function SearchCourses() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const form = useForm<SearchCourseSchemaType>({
    resolver: zodResolver(searchCourseSchema),
  });

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
    <Form
      className="grid grid-cols-[2fr_1fr_1fr] gap-2 pe-2"
      control={form.control}
    >
      <FloatingInput
        label={"Buscar por nombre"}
        onChange={(e) => handleInput("nombre", e.target.value)}
      />
      <Dropdown
        id="pagos"
        label="Filtrar pagos"
        options={paymentsOptions}
        clearable={true}
        selected={paymentsOptions.find(
          (option) => option.value == parseInt(searchParams.get("pagos") ?? "")
        )}
        onChange={(value) => handleSearch("pagos", value.value.toString())}
        onRemove={() => handleSearch("pagos", "")}
      />
      <FetchDropdown
        label="Año"
        name="year"
        fetchUrl="/api/courses/year/options"
        control={form.control}
        clearable={true}
        onChange={(value) => handleSearch("fecha", value.value.toString())}
        onRemove={() => handleSearch("fecha", "")}
      />
    </Form>
  );
}
