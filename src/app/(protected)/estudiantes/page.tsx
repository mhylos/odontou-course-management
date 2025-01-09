import Table, { Cell, Row } from "@/components/common/Table/Table";
import TitlePage from "@/components/common/TitlePage";
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
            {students.map(({ name, rut, email, enrolled }, index) => (
              <Row key={rut} currentRow={index + 1}>
                <Cell>{name}</Cell>
                <Cell>{rut}</Cell>
                <Cell>{email}</Cell>
                <Cell>{enrolled.length}</Cell>
              </Row>
            ))}
          </Table>
        </div>
      </div>
    </>
  );
}
