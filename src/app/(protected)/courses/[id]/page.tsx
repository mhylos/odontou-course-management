"use client";

import ItemInput from "@/components/courses/[id]/ItemInput";
import Section from "@/components/courses/[id]/Section";
import SectionItem from "@/components/courses/[id]/SectionItem";
import { convertToMoney, formatDate } from "@/lib/utils";
import { useCourse } from "@/app/context/courseProvider";

export default function CourseInfo() {
  const course = useCourse();

  return (
    <div className="grid grid-cols-[1fr_2fr] gap-2 h-full w-full">
      <div className="flex flex-col gap-10 justify-between">
        <Section title={"Responsables"} className="flex flex-col gap-2">
          <SectionItem title={"Departamento Ejecutor"}>
            <ItemInput isEditing={false} value={course?.department.name} />
          </SectionItem>
          <SectionItem title={"Nombre del Director del Departamento"}>
            <ItemInput
              isEditing={false}
              value={course?.department.director?.name}
            />
          </SectionItem>
          <SectionItem title={"Nombre del Director del Programa"}>
            <ItemInput isEditing={false} value={course?.course_director.name} />
          </SectionItem>
          <SectionItem title={"Nombre del Coordinador del Programa"}>
            <ItemInput isEditing={false} value={course?.coordinator.name} />
          </SectionItem>
        </Section>
        <Section
          title={"Total de Horas"}
          className="grid grid-rows-3 grid-cols-2 gap-2"
        >
          <SectionItem title={"Directas"}>
            <ItemInput
              isEditing={false}
              value={course?.direct_hours.toString()}
            />
          </SectionItem>
          <SectionItem title={"Presenciales"}>
            <ItemInput
              isEditing={false}
              value={course?.inperson_hours.toString()}
            />
          </SectionItem>
          <SectionItem title={"No Presenciales"}>
            <ItemInput
              isEditing={false}
              value={course?.online_hours.toString()}
            />
          </SectionItem>
          <SectionItem title={"Indirectas"}>
            <ItemInput
              isEditing={false}
              value={course?.indirect_hours.toString()}
            />
          </SectionItem>
          <div className="col-span-2 text-right text-xl font-light">
            <span className="block">Total</span>
            <span className="text-2xl border-b-2 border-secondary">
              {(
                (course?.direct_hours ?? 0) +
                (course?.inperson_hours ?? 0) +
                (course?.online_hours ?? 0) +
                (course?.indirect_hours ?? 0)
              ).toFixed(1)}
            </span>
          </div>
        </Section>
      </div>

      <Section
        title={"Datos generales"}
        className="row-span-2 flex flex-col gap-2"
      >
        <SectionItem title={"Nombre del programa"}>
          <ItemInput isEditing={false} value={course?.name} />
        </SectionItem>
        <SectionItem title={"Objetivo del programa"}>
          <ItemInput isEditing={false} value={course?.objective} />
        </SectionItem>
        <SectionItem title={"Comentarios Relevantes"}>
          <ItemInput
            isEditing={false}
            value={
              course?.additional_comments ? course?.additional_comments : "-"
            }
            className=""
          />
        </SectionItem>
        <SectionItem title={"Tipo de Programa"}>
          <ItemInput isEditing={false} value={course?.program.name} />
        </SectionItem>

        <div className="flex">
          <SectionItem title={"Inicio"}>
            <ItemInput
              isEditing={false}
              value={formatDate(course?.date_from ?? "")}
            />
          </SectionItem>
          <SectionItem title={"Termino"}>
            <ItemInput
              isEditing={false}
              value={formatDate(course?.date_to ?? "")}
            />
          </SectionItem>
        </div>

        <SectionItem title={"Valor del arancel"}>
          <ItemInput
            isEditing={false}
            value={convertToMoney(course?.enroll_value ?? 0)}
          />
        </SectionItem>
      </Section>
    </div>
  );
}
