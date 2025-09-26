import { getAllCourses, getCoursesCount } from "@/services/courseServices";
import CoursePreview from "@/components/cursos/CoursePreview";
import { Pagination } from "@/lib/definitions";

interface CourseListProps {
  filters?: CourseFilters;
}

export interface CourseFilters {
  name?: string;
  payments?: "cumplidos" | "atrasados";
  year?: number;
}

export default async function CourseList({
  filters,
  pagination,
}: {
  filters?: CourseFilters;
  pagination?: Pagination;
}) {
  const courses = await getAllCourses(filters, pagination);

  return (
    <>
      {courses.map((course) => (
        <CoursePreview key={course.id} course={course} />
      ))}
    </>
  );
}
