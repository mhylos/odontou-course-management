import CourseForm from "@/components/forms/CourseForm";
import RightSidebar from "@/components/common/RightSidebar";
import { CreateCourseSchemaType } from "@/lib/zod";
import { getCourseById } from "@/services/courseServices";
import { notFound } from "next/navigation";

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
  };

  return (
    <RightSidebar backRoute={`/cursos/detalles/${id}`} title="Editar Curso">
      <CourseForm values={values} editId={parseInt(id)} />
    </RightSidebar>
  );
}
