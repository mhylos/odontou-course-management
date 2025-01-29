import RightSidebar from "@/components/common/RightSidebar";
import Overlay from "@/components/common/Overlay";
import AcademicForm from "@/components/forms/AcademicForm";

export default async function NewAcademic({}) {
  return (
    <>
      <Overlay backHref="/academicos" />
      <RightSidebar title="Nuevo académico" backHref="/academicos">
        <AcademicForm />
      </RightSidebar>
    </>
  );
}
