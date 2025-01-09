import CreateCourseForm from "@/components/Forms/CourseForm";
import RightSidebar from "@/components/common/RightSidebar";

export default function CreateCourse() {
  return (
    <RightSidebar backRoute="/cursos" title="Ingresar Curso">
      <CreateCourseForm />
    </RightSidebar>
  );
}
