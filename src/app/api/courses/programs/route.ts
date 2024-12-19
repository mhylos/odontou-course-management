import { getAllPrograms } from "@/services/courseServices";
import { NextResponse } from "next/server";

export async function GET() {
  const programs = await getAllPrograms();
  return NextResponse.json(programs);
}
