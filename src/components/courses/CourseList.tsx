import { getAllCourses } from "@/services/courseServices";
import CoursePreview from "@/components/courses/CoursePreview";

interface CourseListProps {
  filterName?: string;
}

export async function CourseList({ filterName }: CourseListProps) {
  const courses = await getAllCourses(filterName);

  return (
    <ul className="grid grid-cols-3 gap-2 h-full overflow-y-auto pe-3">
      {courses.map((course) => (
        <CoursePreview key={course.id} course={course} />
      ))}
    </ul>
  );
}
