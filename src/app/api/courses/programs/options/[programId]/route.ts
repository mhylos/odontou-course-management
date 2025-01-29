import { getProgramOptionById } from "@/services/courseServices";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ programId: string }> }
) {
  const programId = (await params).programId;
  const program = await getProgramOptionById(Number(programId));
  return Response.json(program);
}
