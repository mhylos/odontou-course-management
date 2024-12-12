import prisma from "@/lib/prisma";

export async function DELETE({ params }: { params: Promise<{ rut: string }> }) {
  const id = parseInt((await params).rut);
  const department = await prisma.department.delete({
    where: {
      id,
    },
  });
  return Response.json(department);
}
