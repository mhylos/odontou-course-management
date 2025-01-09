import { getStudentsOptions } from "@/services/studentServices";
import { NextResponse } from "next/server";

export async function GET() {
  const students = await getStudentsOptions();
  return NextResponse.json(students);
}
