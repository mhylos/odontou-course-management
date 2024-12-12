"use client";

import Dropdown from "@/components/common/Dropdown";
import SearchInput from "@/components/common/SearchInput";
import TitlePage from "@/components/common/TitlePage";
import { CourseList } from "@/components/courses/CourseList";
import Link from "next/link";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function Courses() {
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

  return (
    <>
      <div className="grid grid-cols-[1fr_10rem] grid-rows-2">
        <TitlePage className="col-span-2 text-ellipsis overflow-hidden">
          Cursos
        </TitlePage>
        <div className="grid grid-cols-[2fr_1fr] gap-2 pe-2">
          <SearchInput label={"Buscar por nombre"} value={""} />
          <Dropdown
            label="Filtrar pagos"
            options={[
              { value: 1, name: "Completos" },
              { value: 0, name: "Pendientes" },
            ]}
            clearable={true}
            onChange={(value) =>
              handleSearch("payments", value.value.toString())
            }
            onRemove={() => handleSearch("payments", "")}
          />
        </div>
        <Link
          href="courses/create"
          className="bg-primary hover:brightness-90 text-white py-2 px-4 rounded grid place-items-center"
        >
          Crear curso
        </Link>
      </div>
      <CourseList />
    </>
  );
}
