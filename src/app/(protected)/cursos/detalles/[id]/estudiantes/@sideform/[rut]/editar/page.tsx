import Overlay from "@/components/common/Overlay";
import RightSidebar from "@/components/common/RightSidebar";
import EnrollModal from "@/components/cursos/detalles/[id]/estudiantes/EnrollModal";
import StudentEnrollForm from "@/components/forms/StudentEnrollForm";
import { restoreRun } from "@/lib/utils";
import {
  EnrollSchemaType,
  StudentEnrollSchemaType,
  StudentSchemaType,
} from "@/lib/zod";
import { getCourseById } from "@/services/courseServices";
import { getEnroll } from "@/services/studentServices";

interface StudentDetailsProps {
  params: Promise<{ id: string; rut: string }>;
}

export default async function StudentDetails({ params }: StudentDetailsProps) {
  const { id, rut } = await params;

  const course = await getCourseById(id);

  if (!course) {
    return null;
  }

  const enroll = await getEnroll(parseInt(rut), parseInt(id));

  const values: Partial<StudentEnrollSchemaType> = {
    rut: Number(rut),
    enroll: {
      ...enroll,
      detailed_status: enroll?.detailed_status ?? "activo",
      discount: enroll?.discount.toString() ?? "0",
      student_fk: undefined,
      course_fk: undefined,
    } as EnrollSchemaType,
  };

  return (
    <>
      <Overlay backHref={`/cursos/detalles/${id}/estudiantes`} />
      <RightSidebar
        title="Modificar matrícula"
        backHref={`/cursos/detalles/${id}/estudiantes`}
      >
        <StudentEnrollForm
          courseId={parseInt(id)}
          enrollValue={course.enroll_value}
          values={values}
        />
      </RightSidebar>
    </>
  );
}
