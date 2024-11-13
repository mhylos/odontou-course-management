import TitlePage from "@/components/common/TitlePage";
import CoursePreview from "@/components/courses/CoursePreview";

export default function Courses() {
  return (
    <>
      <TitlePage>Cursos</TitlePage>
      <div className="grid">
        <CoursePreview />
      </div>
    </>
  );
}
