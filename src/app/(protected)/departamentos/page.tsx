import TitlePage from "@/components/common/TitlePage";
import DepartmentsTable from "@/components/departamentos/DepartmentsTable";
import { getDepartments } from "@/services/departmentServices";

export default async function Departments() {
  const departments = await getDepartments();

  return (
    <>
      <TitlePage>Departamentos</TitlePage>
      <div className="flex flex-col gap-2 overflow-auto">
        <div className="flex-1 overflow-auto">
          <DepartmentsTable departments={departments} />
        </div>
      </div>
    </>
  );
}
