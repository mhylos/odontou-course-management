import Button from "@/components/common/Button";
import SearchInput from "@/components/common/SearchInput";
import SubtitlePage from "@/components/common/SubtitlePage";
import Table from "@/components/common/Table/Table";
import { convertToMoney, dublicateItems } from "@/lib/utils";

let academicsFouch = [
  {
    name: "Sylvia Osorio Muñoz",
    department: "Dpto. patología y medicina oral",
    hierarchy: "Profesor Asistente",
    dedicationHrs: 0,
    contractHrs: 22,
    fee: 0,
    otherProgramsHrs: 0,
  },
];

academicsFouch = dublicateItems(academicsFouch, 15);

const invitedAcademics = [];

export default function CourseAcademics() {
  // students = dublicateItems(students, 15);

  const ViewDetails = () => (
    <Button>
      <span className="icon-[mdi--account-details]"></span>
    </Button>
  );

  return (
    <div className="flex">
      <div className="flex flex-col gap-2">
        <SearchInput label={"Buscar"} />
        <Table
          headers={[
            "Nombre",
            "Departamento",
            "Jerarquía Académica",
            "Hrs. de dedicación",
            "Hrs. de contrato",
            "Cuota",
            "Hrs. en otro programas",
          ]}
          rows={academicsFouch.map((academic) => [
            academic.name,
            academic.department,
            academic.hierarchy,
            academic.dedicationHrs,
            academic.contractHrs,
            convertToMoney(academic.fee),
            academic.otherProgramsHrs,
          ])}
        />
      </div>
    </div>
  );
}
