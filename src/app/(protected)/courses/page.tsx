import CoursePreview from "@/components/courses/CoursePreview";

export default function Courses() {
  return (
    <main className="flex flex-col justify-center items-center w-full h-full">
      <h1 className="text-4xl font-bold text-gray-800">Cursos</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <CoursePreview />
        <CoursePreview />
        <CoursePreview />
        <CoursePreview />
        <CoursePreview />
        <CoursePreview />
      </div>
    </main>
  );
}
