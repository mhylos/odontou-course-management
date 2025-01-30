import EnrollModal from "@/components/cursos/detalles/[id]/estudiantes/EnrollModal";
import { restoreRun } from "@/lib/utils";
import { EnrollSchemaType, StudentSchemaType } from "@/lib/zod";
import { getCourseById } from "@/services/courseServices";
import { getEnroll } from "@/services/studentServices";

interface StudentDetailsProps {
  params: Promise<{ id: string; rut: string }>;
}

export default async function StudentDetails({ params }: StudentDetailsProps) {
  const { id, rut } = await params;

  const course = await getCourseById(id);

  if (!course) {
    return null;
  }

  const enroll = await getEnroll(parseInt(rut), parseInt(id));

  const values: { student: StudentSchemaType; enroll: EnrollSchemaType } = {
    student: {
      rut: restoreRun(parseInt(rut)),
      email: enroll?.student.email ?? "",
      name: enroll?.student.name ?? "",
      genre: enroll?.student.genre ?? null,
    },
    enroll: {
      status: enroll?.status ?? false,
      ticket_num: enroll?.ticket_num ?? null,
      payment_date: enroll?.payment_date ?? null,
      discount: enroll?.discount ?? "0",
      payment_type_fk: enroll?.payment_type_fk ?? undefined,
      total: enroll?.total ?? course.enroll_value,
      installments: enroll?.installments ?? 1,
      paid: enroll?.paid ?? 0,
      enroll_type: enroll?.enroll_type ?? "autofinanciado",
      observation: enroll?.observation ?? "",
      refund: enroll?.refund ?? false,
    },
  };

  return (
    <EnrollModal
      course={{
        id: course.id,
        enroll_value: course.enroll_value,
      }}
      values={values}
    />
  );
}
