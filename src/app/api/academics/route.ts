import prisma from "@/lib/prisma";

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
