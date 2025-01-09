import HonorariumForm from "@/components/cursos/detalles/[id]/pagos/HonorariumForm";
import { honorariumsSchemaType } from "@/lib/zod";
import { getResponsibles } from "@/services/courseServices";
import {
  getAcademicsHonorarium,
  getCourseHonorariums,
} from "@/services/honorariumServices";
import { FunctionTypes } from "@prisma/client";

export default async function CoursePayments({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = parseInt((await params).id);

  const academicHonorarium = await getAcademicsHonorarium(id);
  const honorariums = await getCourseHonorariums(id);

  console.log(honorariums);

  const values: honorariumsSchemaType = {
    coordinator_percentage:
      honorariums.find(
        (honorarium) => honorarium.function === FunctionTypes.coordinator
      )?.percentage ?? "0",
    director_percentage:
      honorariums.find(
        (honorarium) => honorarium.function === FunctionTypes.director
      )?.percentage ?? "0",

    honorariums: honorariums.map((honorarium) => ({
      academic_fk: honorarium.academic.academic_fk,
      participation_fk: honorarium.participation_fk,
      function: honorarium.function,
      hours: honorarium.hours,
      percentage: honorarium.percentage,
      id: honorarium.id,
    })),
  };

  return (
    <HonorariumForm academicHonorarium={academicHonorarium} values={values} />
  );
}
