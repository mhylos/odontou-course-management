import Table, { Cell, Row } from "@/components/common/Table/Table";
import TitlePage from "@/components/common/TitlePage";
import { restoreRun } from "@/lib/utils";
import { getAllStudents } from "@/services/studentServices";

export default async function Students() {
  const students = await getAllStudents();

  return (
    <>
      <TitlePage>Estudiantes</TitlePage>
      <div className="flex flex-col gap-2 overflow-auto">
        <div className="flex-1 overflow-auto">
          <Table
            headers={[
              { title: "Nombre" },
              { title: "RUT" },
              { title: "Email" },
              { title: "Programas inscritos" },
            ]}
          >
            {students.map(({ name, rut, email, _count }, index) => (
              <Row key={rut} currentRow={index + 1}>
                <Cell className="capitalize">{name.toLowerCase()}</Cell>
                <Cell>{restoreRun(rut)}</Cell>
                <Cell>{email ?? ""}</Cell>
                <Cell>{_count.enrolled}</Cell>
              </Row>
            ))}
          </Table>
        </div>
      </div>
    </>
  );
}
