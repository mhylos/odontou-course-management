import RightSidebar from "@/components/common/RightSidebar";
import Overlay from "@/components/common/Overlay";
import DepartmentForm from "@/components/forms/DepartmentForm";
import { getDepartmentById } from "@/services/departmentServices";

export default async function EditDepartment({
  params,
}: {
  params: Promise<{ departmentId: string }>;
}) {
  const departmentId = Number((await params).departmentId);
  const department = await getDepartmentById(departmentId);
  if (!department) return null;

  return (
    <>
      <Overlay backHref="/departamentos" />
      <RightSidebar title="Modificar departamento" backHref="/departamentos">
        <DepartmentForm
          initialValues={{
            name: department.name,
            director_fk: Number(department.director?.rut),
          }}
        />
      </RightSidebar>
    </>
  );
}
