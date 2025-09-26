import { runToNumber } from "@/lib/utils";
import { getStudentsOptions } from "@/services/studentServices";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const filter = req.nextUrl.searchParams.get("rut");
  const rutWithoutDots = filter ? runToNumber(filter) : undefined;
  const students = await getStudentsOptions(rutWithoutDots);
  return NextResponse.json(students);
}
