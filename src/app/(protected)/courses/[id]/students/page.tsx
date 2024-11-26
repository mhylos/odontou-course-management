import Button from "@/components/common/Button";
import SearchInput from "@/components/common/SearchInput";
import Table from "@/components/common/Table/Table";
import { convertToMoney, dublicateItems } from "@/lib/utils";

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
  const ViewDetails = () => (
    <Button>
      <span className="icon-[mdi--account-details]"></span>
    </Button>
  );

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
          "Detalles",
        ]}
        rows={students.map((student) => [
          student.name,
          student.rut,
          student.status,
          student.nboleta,
          student.fechapago,
          `${student.dcto} %`,
          convertToMoney(student.total),
          ViewDetails(),
        ])}
      />
    </div>
  );
}
