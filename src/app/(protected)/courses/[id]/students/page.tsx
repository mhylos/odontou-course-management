import Button from "@/components/common/Button";
import SearchInput from "@/components/common/SearchInput";
import Table from "@/components/common/Table/Table";
import { convertToMoney, dublicateItems } from "@/lib/utils";
import Link from "next/link";
import { format } from "rutility";

let students = [
  {
    name: "Paula",
    rut: "11.111.111-1",
    status: "Matriculado",
    nboleta: 1233213,
    fechapago: "11/11/2024",
    dcto: 10,
    total: 940000,
  },
];

students = dublicateItems(students, 10);

export default function CourseStudents() {
  const ViewDetails = (rut: number) => (
    <Link
      href={`students/${rut}`}
      className="bg-secondary text-white grid place-items-center h-full aspect-square p-2 rounded"
    >
      <span className="icon-[mdi--account-details] text-xl" />
    </Link>
  );

  const Actions = (rut: string) => {
    const rutFormatted = parseInt(format.notDotDash(rut));
    return <div className="flex gap-2">{ViewDetails(rutFormatted)}</div>;
  };

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      <div className="flex gap-2">
        <SearchInput label={"Buscar"} className="flex-1" />
        <Button className="max-w-max aspect-square group">
          <span className="icon-[ph--student] text-2xl group-hover:icon-[ph--student-fill]" />

          <span className="icon-[ph--plus] text-xs align-top group-hover:icon-[ph--plus-bold]" />
        </Button>
      </div>
      <Table
        headers={[
          "Nombre",
          "RUT",
          "Estado",
          "N° Boleta",
          "Fecha pago",
          "Dcto.",
          "Total",
          "Acciones",
        ]}
        rows={students.map((student) => [
          student.name,
          student.rut,
          student.status,
          student.nboleta,
          student.fechapago,
          `${student.dcto} %`,
          convertToMoney(student.total),
          Actions(student.rut),
        ])}
      />
    </div>
  );
}
