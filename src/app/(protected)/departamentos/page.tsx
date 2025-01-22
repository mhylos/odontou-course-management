import Table, { Cell, Row } from "@/components/common/Table/Table";
import TitlePage from "@/components/common/TitlePage";
import DepartmentsTable from "@/components/departamentos/DepartmentsTable";
import { getDepartments } from "@/services/departmentServices";

export default async function Students() {
  const departments = await getDepartments();

  return (
    <>
      <TitlePage>Departamentos</TitlePage>
      <div className="flex flex-col gap-2 overflow-auto">
        <div className="flex-1 overflow-auto">
          <DepartmentsTable
            departments={{
              departments: departments.map(({ id, name, director_fk }) => ({
                departmentId: id,
                name,
                directorId: director_fk,
              })),
            }}
          />
        </div>
      </div>
    </>
  );
}
