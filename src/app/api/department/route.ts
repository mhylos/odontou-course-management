import { DepartmentCreate } from "@/lib/definitions";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const body: DepartmentCreate = await request.json();

  const department = await prisma.department.create({
    data: {
      name: body.name,
      director_fk: body.director_fk,
    },
  });

  return Response.json(department);
}

export async function GET() {
  const departments = await prisma.department.findMany();
  return Response.json(departments);
}
