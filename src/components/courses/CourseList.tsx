import { getAllCourses } from "@/services/courseServices";
import CoursePreview from "@/components/courses/CoursePreview";

export async function CourseList() {
  const courses = await getAllCourses();

  return (
    <ul className="grid grid-cols-3 gap-2 h-full overflow-y-auto pe-3">
      {courses.map((course) => (
        <CoursePreview key={course.id} course={course} />
      ))}
    </ul>
  );
}
