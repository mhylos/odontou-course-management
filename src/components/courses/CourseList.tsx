import { getAllCourses } from "@/services/courseServices";
import CoursePreview from "@/components/courses/CoursePreview";

interface CourseListProps {
  filters?: { name?: string; payment: string };
}

export default async function CourseList({ filters }: CourseListProps) {
  const courses = await getAllCourses(filters?.name ?? "");

  return (
    <>
      {courses.map((course) => (
        <CoursePreview key={course.id} course={course} />
      ))}
    </>
  );
}
