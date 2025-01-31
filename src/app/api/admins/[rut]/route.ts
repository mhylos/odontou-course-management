import { getPersonalInfo } from "@/services/userServices";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ rut: string }> }
) {
  const rut = (await params).rut;
  if (!rut) {
    return Response.error();
  }
  const admin = await getPersonalInfo(parseInt(rut));
  console.log(admin);

  return Response.json(admin);
}
