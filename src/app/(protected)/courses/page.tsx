import Button from "@/components/common/Button";
import Dropdown from "@/components/common/Dropdown";
import SearchInput from "@/components/common/SearchInput";
import TitlePage from "@/components/common/TitlePage";
import CoursePreview from "@/components/courses/CoursePreview";

export default function Courses() {
  return (
    <>
      <div className="grid grid-cols-[1fr_10rem] grid-rows-2 ">
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
      <div className="grid grid-cols-3 gap-2 h-full overflow-y-auto pe-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <CoursePreview key={index} />
        ))}
      </div>
    </>
  );
}
