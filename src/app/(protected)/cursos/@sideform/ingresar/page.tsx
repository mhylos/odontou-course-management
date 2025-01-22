import CreateCourseForm from "@/components/forms/CourseForm";
import RightSidebar from "@/components/common/RightSidebar";
import Overlay from "@/components/common/Overlay";

export default function CreateCourse() {
  return (
    <>
      <Overlay href="/cursos" />
      <RightSidebar title="Ingresar Curso">
        <CreateCourseForm />
      </RightSidebar>
    </>
  );
}
