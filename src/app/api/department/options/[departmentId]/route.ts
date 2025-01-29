import { getDepartmentOptionById } from "@/services/departmentServices";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ departmentId: string }> }
) {
  const departmentId = (await params).departmentId;
  const department = await getDepartmentOptionById(Number(departmentId));
  return Response.json(department);
}
