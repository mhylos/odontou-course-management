import { getCourseById } from "@/services/courseServices";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const course = await getCourseById(id);

  if (!course) {
    return Response.error();
  }

  return Response.json(course);
}
