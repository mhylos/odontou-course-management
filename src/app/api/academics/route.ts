import prisma from "@/lib/prisma";

// export async function POST(request: Request) {
//   const body: createAcademicSchemaType = await request.json();
//   const user = await createAcademic(body);
//   return NextResponse.json({ status: 201 });
// }

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
