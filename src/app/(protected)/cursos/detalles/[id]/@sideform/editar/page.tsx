import CourseForm from "@/components/Forms/CourseForm";
import RightSidebar from "@/components/common/RightSidebar";
import { createCourseSchemaType } from "@/lib/zod";
import { getCourseById } from "@/services/courseServices";

export default async function EditCourse({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const course = await getCourseById(id);

  if (!course) {
    return <div>El curso no existe</div>;
  }

  const values: createCourseSchemaType = {
    additional_comments: course.additional_comments ?? "",
    coordinator_fk: course.coordinator.rut,
    course_director_fk: course.course_director.rut,
    department_fk: course.department.id,
    date_from: course.date_from,
    date_to: course.date_to,
    direct_hours: course.direct_hours,
    enroll_value: course.enroll_value,
    indirect_hours: course.indirect_hours,
    inperson_hours: course.inperson_hours,
    name: course.name,
    objective: course.objective,
    online_hours: course.online_hours,
    program_fk: course.program.id,
  };

  return (
    <RightSidebar backRoute={`/cursos/detalles/${id}`} title="Editar Curso">
      <CourseForm values={values} editId={parseInt(id)} />
    </RightSidebar>
  );
}
