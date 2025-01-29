import AcademicParticipationForm from "@/components/forms/AcademicParticipationForm";
import RightSidebar from "@/components/common/RightSidebar";
import { runToNumber } from "@/lib/utils";
import { getParticipation } from "@/services/academicsServices";
import { getCourseById } from "@/services/courseServices";
import Overlay from "@/components/common/Overlay";

export default async function EditAcademic({
  params,
}: {
  params: Promise<{ id: string; rut: string }>;
}) {
  const { id, rut } = await params;
  const course = await getCourseById(id);
  const participation = await getParticipation(runToNumber(rut), parseInt(id));

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
        <AcademicParticipationForm
          courseId={parseInt(id)}
          values={participation ?? undefined}
        />
      </RightSidebar>
    </>
  );
}
