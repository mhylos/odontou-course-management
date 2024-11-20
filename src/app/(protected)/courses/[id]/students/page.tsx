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

export default function CourseStudents() {
  students = dublicateItems(students, 15);

  const ViewDetails = () => (
    <Button>
      <span className="icon-[mdi--account-details]"></span>
    </Button>
  );

  return (
    <div className="flex flex-col gap-2">
      <SearchInput label={"Buscar"} />
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
