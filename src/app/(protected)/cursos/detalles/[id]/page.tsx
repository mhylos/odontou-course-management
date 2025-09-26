import Section from "@/components/cursos/detalles/[id]/Section";
import SectionItem from "@/components/cursos/detalles/[id]/SectionItem";
import { convertToMoney, formatDate } from "@/lib/utils";
import { getCourseById } from "@/services/courseServices";
import { format } from "date-fns";
import Decimal from "decimal.js";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatInTimeZone } from "date-fns-tz";

function ItemDescription({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-w-32 min-h-6 border-b-2 border-gray-200 rounded px-2 py-1">
      {children}
    </div>
  );
}

export default async function CourseInfo({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const course = await getCourseById(id);

  if (!course) {
    notFound();
  }

  const total = Decimal.sum(
    course.direct_hours,
    course.inperson_hours,
    course.online_hours,
    course.indirect_hours
  );

  return (
    <div className="relative grid grid-cols-[1fr_2fr] gap-2 h-full w-full">
      <div className="flex flex-col justify-between">
        <Section title={"Responsables"}>
          <SectionItem title={"Departamento Ejecutor"}>
            <ItemDescription>{course.department.name}</ItemDescription>
          </SectionItem>
          <SectionItem title={"Nombre del Director del Departamento"}>
            <ItemDescription>
              <span className="capitalize">
                {course.department.director?.name?.toLowerCase() ?? "-"}
              </span>
            </ItemDescription>
          </SectionItem>
          <SectionItem title={"Nombre del Director del Programa"}>
            <ItemDescription>
              <span className="capitalize">
                {course.course_director.name?.toLowerCase()}
              </span>
            </ItemDescription>
          </SectionItem>
          <SectionItem title={"Nombre del Coordinador del Programa"}>
            <ItemDescription>
              <span className="capitalize">
                {course.coordinator.name?.toLowerCase()}
              </span>
            </ItemDescription>
          </SectionItem>
        </Section>
        <Section
          title={"Total de Horas"}
          className="grid auto-rows-max grid-cols-2 gap-2"
        >
          <SectionItem title={"Directas"}>
            <ItemDescription>{course.direct_hours.toString()}</ItemDescription>
          </SectionItem>
          <SectionItem title={"Presenciales"}>
            <ItemDescription>
              {course.inperson_hours.toString()}
            </ItemDescription>
          </SectionItem>
          <SectionItem title={"No Presenciales"}>
            <ItemDescription>{course.online_hours.toString()}</ItemDescription>
          </SectionItem>
          <SectionItem title={"Indirectas"}>
            <ItemDescription>
              {course.indirect_hours.toString()}
            </ItemDescription>
          </SectionItem>
          <div className="col-span-2 text-right text-xl font-light">
            <span className="block">Total</span>
            <span className="text-2xl border-b-2 border-secondary">
              {total.toString()}
            </span>
          </div>
        </Section>
      </div>

      <Section title={"Datos generales"} className="row-span-2">
        <SectionItem title={"Nombre del programa"}>
          <ItemDescription>{course.name}</ItemDescription>
        </SectionItem>
        <SectionItem title={"Objetivo del programa"}>
          <ItemDescription>{course.objective}</ItemDescription>
        </SectionItem>
        <SectionItem title={"Comentarios Relevantes"}>
          <ItemDescription>{course.additional_comments}</ItemDescription>
        </SectionItem>
        <SectionItem title={"Tipo de Programa"}>
          <ItemDescription>{course.program.name}</ItemDescription>
        </SectionItem>

        <div className="flex gap-2">
          <SectionItem title={"Inicio"}>
            {/* <ItemDescription>{format(course.date_from, "PP")}</ItemDescription> */}
            <ItemDescription>
              {formatInTimeZone(course.date_from, "UTC", "PPP")}
            </ItemDescription>
          </SectionItem>
          <SectionItem title={"Termino"}>
            <ItemDescription>
              {formatInTimeZone(course.date_to, "UTC", "PPP")}
            </ItemDescription>
          </SectionItem>
        </div>

        <SectionItem title={"Valor del arancel"}>
          <ItemDescription>
            {convertToMoney(course.enroll_value ?? 0)}
          </ItemDescription>
        </SectionItem>
      </Section>
      <Link
        className="fixed button w-max right-10 bottom-10"
        href={`${id}/editar`}
      >
        Editar
      </Link>
    </div>
  );
}
