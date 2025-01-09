import { getAllCourses } from "@/services/courseServices";
import CoursePreview from "@/components/cursos/CoursePreview";

interface CourseListProps {
  filters?: { nombre?: string; pagos: string; fecha?: string };
}

export default async function CourseList({ filters }: CourseListProps) {
  const courses = await getAllCourses(
    filters?.nombre ?? "",
    filters?.pagos ?? "",
    filters?.fecha ? parseInt(filters.fecha) : undefined
  );

  return (
    <>
      {courses.map((course) => (
        <CoursePreview key={course.id} course={course} />
      ))}
    </>
  );
}
