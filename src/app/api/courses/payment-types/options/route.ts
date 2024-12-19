import { getPaymentOptions } from "@/services/courseServices";

export async function GET() {
  const programs = await getPaymentOptions();
  return Response.json(programs);
}
