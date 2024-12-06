import prisma from "@/lib/prisma";

export const dynamic = "force-static";

export async function GET() {
  const programs = await prisma.program.findMany();
  return Response.json(programs);
}
