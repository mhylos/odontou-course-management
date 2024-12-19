"use client";

import { useCourse } from "@/app/context/courseProvider";
import Table from "@/components/common/Table/Table";
import TableDropdown from "@/components/courses/[id]/Subsection";
import { convertToMoney } from "@/lib/utils";
import {
  getAcademicsByCourse,
  getAcademicsByCourseResponse,
} from "@/services/courseServices";
import { useEffect, useState } from "react";

export default function CourseAcademics() {
  const { course } = useCourse();
  const [academicMenuOpen, setAcademicMenuOpen] = useState(true);
  const [invitedMenuOpen, setInvitedMenuOpen] = useState(false);
  const [academics, setAcademics] =
    useState<Awaited<getAcademicsByCourseResponse>>();

  useEffect(() => {
    if (!course) return;
    const fetchData = async () => {
      setAcademics(await getAcademicsByCourse(course?.id));
    };
    fetchData();
  }, [course]);

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
          ]}
          rows={academics?.academicsFouch.map((person) => [
            <span className="capitalize" key={person.academic.user_fk}>
              {person.academic.user.name?.toLowerCase()}
            </span>,
            person.academic.department.name,
            person.hierarchy_type.name,
            person.dedicated_hours,
            person.contract_hours,
            convertToMoney(person.paid),
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
