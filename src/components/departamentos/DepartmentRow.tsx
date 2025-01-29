import { Row, Cell } from "../common/Table/Table";
import { GetDepartmentsResponse } from "@/services/departmentServices";
import { restoreRun } from "@/lib/utils";
import ActionRowButton from "../common/Table/ActionRowButton";
interface DepartmentRowProps {
  department: Awaited<GetDepartmentsResponse>[number];
}

export default function DepartmentRow({ department }: DepartmentRowProps) {
  return (
    <Row currentRow={department.id}>
      <Cell>{department.name}</Cell>
      <Cell>
        {department.director ? (
          <div className="flex flex-col">
            <span className="capitalize">{department.director.name}</span>
            <span className="text-xs text-gray-700">
              {restoreRun(department.director.rut)}
            </span>
          </div>
        ) : (
          <span className="text-gray-400">Sin director</span>
        )}
      </Cell>
      <Cell>{department._count.courses}</Cell>
      <Cell>{department._count.academic}</Cell>
      <Cell>
        <ActionRowButton href={`/departamentos/${department.id}`}>
          <span className="icon-[ph--note-pencil] text-xl" />
        </ActionRowButton>
      </Cell>
    </Row>
  );
}
