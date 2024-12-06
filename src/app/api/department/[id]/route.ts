import { DepartmentCreate } from "@/lib/definitions";
import prisma from "@/lib/prisma";

export async function PATCH(
  Request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const body: DepartmentCreate = await Request.json();
  const id = parseInt((await params).id);
  const department = await prisma.department.update({
    where: {
      id,
    },
    data: body,
  });
  return Response.json(department);
}
