import CourseForm from "@/components/forms/CourseForm";
import RightSidebar from "@/components/common/RightSidebar";
import { getCourseById } from "@/services/courseServices";
import { notFound } from "next/navigation";
import Overlay from "@/components/common/Overlay";
import { formatInTimeZone } from "date-fns-tz/formatInTimeZone";
import { CreateCourseSchemaType } from "@/lib/zod";

export default async function EditCourse({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const course = await getCourseById(id);

  if (!course) {
    notFound();
  }

  const values: CreateCourseSchemaType = {
    ...course,
    additional_comments: course.additional_comments || "",
    coordinator_fk: course.coordinator.rut,
    course_director_fk: course.course_director.rut,
    department_fk: course.department.id,
    program_fk: course.program.id,
    // date_from: formatInTimeZone(course.date_from, "UTC", "yyyy-MM-dd"),
    // date_to: formatInTimeZone(course.date_to, "UTC", "yyyy-MM-dd"),
  };

  return (
    <>
      <Overlay backHref={`/cursos/detalles/${id}`} />
      <RightSidebar title="Editar Curso" backHref={`/cursos/detalles/${id}`}>
        <CourseForm values={values} editId={parseInt(id)} />
      </RightSidebar>
    </>
  );
}
