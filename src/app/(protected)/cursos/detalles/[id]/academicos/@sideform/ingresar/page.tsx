import AcademicParticipationForm from "@/components/forms/AcademicParticipationForm";
import RightSidebar from "@/components/common/RightSidebar";
import { getCourseById } from "@/services/courseServices";
import Overlay from "@/components/common/Overlay";

export default async function AddAcademic({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const course = await getCourseById(id);

  if (!course) {
    return <div>El curso no existe</div>;
  }

  return (
    <>
      <Overlay backHref={`/cursos/detalles/${id}/academicos`} />
      <RightSidebar
        title="Ingresar académico"
        backHref={`/cursos/detalles/${id}/academicos`}
      >
        <AcademicParticipationForm courseId={parseInt(id)} />
      </RightSidebar>
    </>
  );
}
