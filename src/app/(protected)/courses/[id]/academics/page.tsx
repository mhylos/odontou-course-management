"use client";

import Table from "@/components/common/Table/Table";
import TableDropdown from "@/components/courses/[id]/Subsection";
import { convertToMoney, dublicateItems } from "@/lib/utils";
import { useState } from "react";

const academicsFouch = dublicateItems(
  [
    {
      name: "Sylvia Osorio Muñoz",
      department: "Dpto. patología y medicina oral",
      hierarchy: "Profesor Asistente",
      dedicationHrs: 0,
      contractHrs: 22,
      fee: 0,
      otherProgramsHrs: 0,
    },
  ],
  10
);

const invitedAcademics = [];

export default function CourseAcademics() {
  const [academicMenuOpen, setAcademicMenuOpen] = useState(true);
  const [invitedMenuOpen, setInvitedMenuOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      <TableDropdown
        title="Académicos Fouch"
        isOpen={academicMenuOpen}
        isExpandable={true}
        setIsOpen={() => setAcademicMenuOpen(!academicMenuOpen)}
      >
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
      </TableDropdown>
      <TableDropdown
        title="Académicos Invitados"
        isOpen={invitedMenuOpen}
        isExpandable={true}
        setIsOpen={() => setInvitedMenuOpen(!invitedMenuOpen)}
      >
        <Table
          headers={[
            "Nombre",
            "RUT",
            "Hrs. de dedicación",
            "Correo electrónico",
            "Hrs. en otro programas",
          ]}
          rows={invitedAcademics.map((academic) => [
            academic.name,
            academic.department,
            academic.hierarchy,
            academic.dedicationHrs,
            academic.contractHrs,
            convertToMoney(academic.fee),
            academic.otherProgramsHrs,
          ])}
        />
      </TableDropdown>
    </div>
  );
}
