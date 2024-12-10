"use client";

import Table from "@/components/common/Table/Table";
import TableDropdown from "@/components/courses/[id]/Subsection";
import { convertToMoney } from "@/lib/utils";
import {
  getAcademicsByCourse,
  getAcademicsByCourseResponse,
} from "@/services/courseServices";
import { useEffect, useState } from "react";

export default function CourseAcademics() {
  const [academicMenuOpen, setAcademicMenuOpen] = useState(true);
  const [invitedMenuOpen, setInvitedMenuOpen] = useState(false);
  const [academics, setAcademics] =
    useState<Awaited<getAcademicsByCourseResponse>>();

  useEffect(() => {
    const fetchData = async () => {
      setAcademics(await getAcademicsByCourse());
    };
    fetchData();
  }, []);

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
          rows={academics?.academicsFouch.map((academic) => [
            <span className="capitalize" key={academic.name}>
              {academic.name.toLowerCase()}
            </span>,
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
          rows={academics?.invitedAcademics.map(() => [])}
        />
      </TableDropdown>
    </div>
  );
}
