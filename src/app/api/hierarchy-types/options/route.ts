import { getHierarchyOptions } from "@/services/academicsServices";
import { NextResponse } from "next/server";

export async function GET() {
  const departments = await getHierarchyOptions();
  return NextResponse.json(departments);
}
