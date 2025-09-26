import SearchInput from "@/components/common/SearchInput";
import Table, { Cell, Row } from "@/components/common/Table/Table";
import Actions from "@/components/cursos/detalles/[id]/estudiantes/Actions";
import { convertToMoney, formatDate } from "@/lib/utils";
import { getStudentsEnrolled } from "@/services/courseServices";
import Link from "next/link";
import { format, calculateDv } from "rutility";

export default async function CourseStudents({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ nombre: string }>;
}) {
  const id = (await params).id;
  const enrolls = await getStudentsEnrolled(
    parseInt(id),
    (
      await searchParams
    ).nombre
  );

  if (!enrolls) {
    return <div>El curso no existe</div>;
  }

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      <div className="flex gap-2">
        <SearchInput
          label="Buscar por nombre"
          queryName={"nombre"}
          className="w-full"
        />
        <Link
          href={`/cursos/detalles/${id}/estudiantes/ingresar`}
          className="group bg-primary text-white rounded place-items-center flex flex-col justify-center px-2 text-center"
        >
          <div>
            <span className="icon-[ph--student] text-2xl group-hover:icon-[ph--student-fill]" />
            <span className="icon-[ph--plus] text-xs align-top group-hover:icon-[ph--plus-bold]" />
          </div>
          <span className="col-span-2 text-xs text-nowrap">
            (Agregar estudiante)
          </span>
        </Link>
      </div>
      <Table
        headers={[
          { title: "Nombre" },
          { title: "RUT" },
          { title: "Estado" },
          { title: "N° de boleta" },
          { title: "Fecha de pago" },
          { title: "Descuento" },
          { title: "Total" },
          { title: "Acciones" },
        ]}
      >
        {enrolls.map((enroll, i) => (
          <Row key={enroll.student.rut} currentRow={i + 1}>
            <Cell className="capitalize">
              {enroll.student.name.toLowerCase()}
            </Cell>
            <Cell className="text-nowrap">
              {format.dotDash(
                enroll.student.rut.toString() + calculateDv(enroll.student.rut)
              )}
            </Cell>
            <Cell className="capitalize">{enroll.detailed_status ?? ""}</Cell>
            <Cell>{enroll.ticket_num ?? ""}</Cell>
            <Cell>
              {enroll.payment_date
                ? formatDate(enroll.payment_date)
                : "Sin pago"}
            </Cell>
            <Cell>{`${enroll.discount} %`}</Cell>
            <Cell>{convertToMoney(enroll.total)}</Cell>
            <Cell>
              <Actions courseId={parseInt(id)} rut={enroll.student.rut} />
            </Cell>
          </Row>
        ))}
      </Table>
    </div>
  );
}
