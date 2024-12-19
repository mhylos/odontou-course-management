import { getProgramsOptions } from "@/services/courseServices";

export async function GET() {
  const programs = await getProgramsOptions();
  return Response.json(programs);
}
