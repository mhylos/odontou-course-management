import { getStudentOptionByRut } from "@/services/studentServices";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ rut: string }> }
) {
  const rut = (await params).rut;
  const student = await getStudentOptionByRut(Number(rut));
  return Response.json(student);
}
