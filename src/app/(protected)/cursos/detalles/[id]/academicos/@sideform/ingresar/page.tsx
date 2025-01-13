import AcademicParticipationForm from "@/components/forms/AcademicParticipationForm";
import RightSidebar from "@/components/common/RightSidebar";
import { getCourseById } from "@/services/courseServices";

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
    <RightSidebar
      backRoute={`/cursos/detalles/${id}/academicos`}
      title="Ingresar académico"
    >
      <AcademicParticipationForm courseId={parseInt(id)} />
    </RightSidebar>
  );
}
