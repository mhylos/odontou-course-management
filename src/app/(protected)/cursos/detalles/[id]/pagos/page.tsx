import HonorariumForm from "@/components/cursos/detalles/[id]/pagos/HonorariumForm";
import {
  getAcademicsHonorariumsByCourse,
  getAcademicsHonorarium,
  getResponsiblesHonorariumsByCourse,
} from "@/services/honorariumServices";

export default async function CoursePayments({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = parseInt((await params).id);

  const academicHonorarium = await getAcademicsHonorarium(id);
  const academicsHonorariums = await getAcademicsHonorariumsByCourse(id);
  const responsiblesHonorariums = await getResponsiblesHonorariumsByCourse(id);

  return (
    <HonorariumForm
      totalHonorariums={academicHonorarium}
      academicsHonorariums={academicsHonorariums}
      responsiblesHonorariums={responsiblesHonorariums}
      courseId={id}
    />
  );
}
