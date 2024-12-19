import { getDepartmentsOptions } from "@/services/courseServices";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const filter = req.nextUrl.searchParams.get("name");
  const departments = await getDepartmentsOptions(filter ?? "");
  return Response.json(departments);
}
