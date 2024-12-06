import { CourseCreate } from "@/lib/definitions";
import prisma from "@/lib/prisma";

export const dynamic = "force-static";

export async function GET() {
  const courses = prisma.course.findMany();
  return courses;
}

export async function POST(request: Request) {
  const body: CourseCreate = await request.json();
  const course = await prisma.course.create({
    data: body,
  });
  return Response.json(course);
}
