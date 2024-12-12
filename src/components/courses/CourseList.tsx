import { getAllCoursesResponse } from "@/services/courseServices";
import CoursePreview from "@/components/courses/CoursePreview";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";

export function CourseList() {
  const { data: courses, isLoading } = useSWR<Awaited<getAllCoursesResponse>>(
    "api/courses",
    fetcher
  );

  if (!courses) {
    return <div>No hay cursos</div>;
  }

  return (
    <ul className="grid grid-cols-3 gap-2 h-full overflow-y-auto pe-3">
      {isLoading && <div>Cargando...</div>}
      {courses.map((course) => (
        <CoursePreview key={course.id} course={course} />
      ))}
    </ul>
  );
}
