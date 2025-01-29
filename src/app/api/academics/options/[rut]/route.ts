import { getAcademicOptionByRun } from "@/services/academicsServices";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ rut: string }> }
) {
  const rut = (await params).rut;
  const academic = await getAcademicOptionByRun(Number(rut));
  return Response.json(academic);
}
