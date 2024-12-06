import prisma from "@/lib/prisma";
import { AcademicCreate } from "@/lib/definitions";

export async function POST(request: Request) {
  const body: AcademicCreate = await request.json();

  const academic = await prisma.user.create({
    data: {
      rut: body.rut,
      name: body.name,
      email: body.email,
      password: body.password,
      academic: {
        create: {
          isFOUCH: body.isFOUCH,
          department: { connect: { id: body.department_fk } },
        },
      },
    },
  });
  return Response.json(academic);
}

export async function GET() {
  const academics = await prisma.academic.findMany({
    omit: { user_fk: true, department_fk: true },
    include: {
      user: { select: { rut: true, name: true } },
      manages: true,
      department: { select: { name: true } },
    },
  });
  return Response.json(academics);
}
