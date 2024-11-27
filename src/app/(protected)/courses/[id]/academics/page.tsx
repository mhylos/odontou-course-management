"use client";

import Subtitle from "@/components/common/Subtitle";
import Table from "@/components/common/Table/Table";
import TableDropdown from "@/components/courses/[id]/ExpandableSection";
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
  console.log(academicsFouch);

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      <TableDropdown
        isOpen={academicMenuOpen}
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
        isOpen={invitedMenuOpen}
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
