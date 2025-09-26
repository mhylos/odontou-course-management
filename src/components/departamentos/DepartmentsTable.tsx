import Table from "../common/Table/Table";
import DepartmentRow from "./DepartmentRow";
import { GetDepartmentsResponse } from "@/services/departmentServices";

interface DepartmentsTableProps {
  departments: Awaited<GetDepartmentsResponse>;
}

export default function DepartmentsTable({
  departments,
}: DepartmentsTableProps) {
  return (
    <Table
      headers={[
        { title: "Nombre", width: "40%" },
        { title: "Director", width: "25%" },
        { title: "Cursos" },
        { title: "Acciones", width: "15%" },
      ]}
      className="overflow-visible"
    >
      {departments.map((department) => {
        return <DepartmentRow key={department.id} department={department} />;
      })}
    </Table>
  );
}
