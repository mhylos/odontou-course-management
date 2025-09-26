import EnrollModal from "@/components/cursos/detalles/[id]/estudiantes/EnrollModal";
import { getCourseById } from "@/services/courseServices";

interface AddStudentProps {
  params: Promise<{ id: string }>;
}

export default async function AddStudent({ params }: AddStudentProps) {
  const id = (await params).id;
  const course = await getCourseById(id);

  if (!course) {
    return null;
  }

  return (
    <EnrollModal
      course={{
        id: course.id,
        enroll_value: course.enroll_value,
      }}
    />
  );
}
