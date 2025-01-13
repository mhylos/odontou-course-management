import DeleteRowButton from "@/components/common/Table/DeleteRowButton";
import Table, { Cell, Row } from "@/components/common/Table/Table";
import Actions from "@/components/cursos/detalles/[id]/academicos/Actions";
import TableDropdown from "@/components/cursos/detalles/[id]/DropdownSection";
import { restoreRun } from "@/lib/utils";
import { removeParticipation } from "@/services/academicsServices";
import { getAcademicsByCourse } from "@/services/courseServices";
import Link from "next/link";

interface CourseAcademicsProps {
  params: Promise<{ id: string }>;
}

export default async function CourseAcademics({
  params,
}: CourseAcademicsProps) {
  const id = (await params).id;
  const { academicsFouch, invitedAcademics } = await getAcademicsByCourse(
    parseInt(id)
  );

  return (
    <div className="flex flex-col gap-1 w-full h-full justify-between">
      <div className="flex flex-col gap-2 w-full h-full">
        <TableDropdown title="Académicos FOUCh">
          <Table
            headers={[
              { title: "Nombre", width: "30%" },
              { title: "Departamento", width: "20%" },
              { title: "Jerarquía" },
              { title: "Hrs. de dedicación", width: "10%" },
              { title: "Hrs. de contrato", width: "10%" },
              { title: "Acciones" },
            ]}
          >
            {academicsFouch.map((person, i) => (
              <Row key={person.academic.user.rut} currentRow={i + 1}>
                <Cell>
                  <span className="capitalize">
                    {person.academic.user.name?.toLowerCase()}
                  </span>
                </Cell>
                <Cell>{person.academic.department.name}</Cell>
                <Cell>{person.hierarchy_type.name}</Cell>
                <Cell>{person.dedicated_hours ?? ""}</Cell>
                <Cell>{person.contract_hours ?? ""}</Cell>
                <Cell>
                  <Actions
                    rut={person.academic.user.rut}
                    courseId={parseInt(id)}
                  />
                </Cell>
              </Row>
            ))}
          </Table>
        </TableDropdown>
        <TableDropdown title="Académicos Invitados">
          <Table
            headers={[
              { title: "Nombre", width: "30%" },
              { title: "RUT", width: "10%" },
              { title: "Hrs. de dedicación", width: "10%" },
              { title: "Correo electrónico", width: "20%" },
              { title: "Teléfono" },
              { title: "Acciones" },
            ]}
          >
            {invitedAcademics.map((person, i) => (
              <Row key={person.academic.user.rut} currentRow={i}>
                <Cell>
                  <span className="capitalize">
                    {person.academic.user.name?.toLowerCase()}
                  </span>
                </Cell>
                <Cell>{restoreRun(person.academic.user.rut)}</Cell>
                <Cell>{person.dedicated_hours ?? ""}</Cell>
                <Cell>{person.academic.user.email ?? ""}</Cell>
                <Cell>{person.academic.phone ?? ""}</Cell>
                <Cell>
                  <Actions
                    rut={person.academic.user.rut}
                    courseId={parseInt(id)}
                  />
                </Cell>
              </Row>
            ))}
          </Table>
        </TableDropdown>
      </div>
      <div className="flex h-max place-self-end">
        <Link href={"academicos/ingresar"} className="button">
          Agregar Académico
        </Link>
      </div>
    </div>
  );
}
