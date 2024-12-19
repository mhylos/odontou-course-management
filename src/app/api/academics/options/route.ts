import { getAcademicsOptions } from "@/services/academicsServices";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const filter = req.nextUrl.searchParams.get("name");
  const academics = await getAcademicsOptions(filter ?? "");
  return Response.json(academics);
}
