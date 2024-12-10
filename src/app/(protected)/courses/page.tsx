import Button from "@/components/common/Button";
import Dropdown from "@/components/common/Dropdown";
import SearchInput from "@/components/common/SearchInput";
import TitlePage from "@/components/common/TitlePage";
import { CourseList } from "@/components/courses/CourseList";

export default function Courses() {
  return (
    <>
      <div className="grid grid-cols-[1fr_10rem] grid-rows-2">
        <TitlePage className="col-span-2 text-ellipsis overflow-hidden">
          Cursos
        </TitlePage>
        <div className="grid grid-cols-[2fr_1fr] gap-2 pe-2">
          <SearchInput
            label={"Buscar por nombre"}
            value={""}
            onChange={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
          <Dropdown
            label="Filtrar pagos"
            options={[
              { value: 1, name: "Pagados" },
              { value: 2, name: "Pendientes" },
            ]}
          />
        </div>
        <Button>Crear curso</Button>
      </div>
      <CourseList />
    </>
  );
}
