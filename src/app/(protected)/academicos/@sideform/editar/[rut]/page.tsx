import Overlay from "@/components/common/Overlay";
import RightSidebar from "@/components/common/RightSidebar";
import AcademicForm from "@/components/forms/AcademicForm";
import { getAcademicToEdit } from "@/services/academicsServices";

export default async function EditAcademic({
  params,
}: {
  params: Promise<{ rut: string }>;
}) {
  const rut = Number((await params).rut);
  const academic = await getAcademicToEdit(rut);
  if (!academic) return null;

  return (
    <>
      <Overlay backHref="/academicos" />
      <RightSidebar title="Modificar académico" backHref="/academicos">
        <AcademicForm defaultValues={academic} />
      </RightSidebar>
    </>
  );
}
