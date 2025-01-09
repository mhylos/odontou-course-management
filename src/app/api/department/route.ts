import { DepartmentCreate } from "@/lib/definitions";
import prisma from "@/lib/prisma";
import { getDepartments } from "@/services/departmentServices";
import { NextRequest } from "next/server";

export async function POST(request: Request) {
  const body: DepartmentCreate = await request.json();

  const department = await prisma.department.create({
    data: {
      name: body.name,
      director_fk: body.director_fk,
    },
  });

  return Response.json(department);
}

export async function GET(req: NextRequest) {
  const filter = req.nextUrl.searchParams.get("name");
  const departments = await getDepartments(filter ?? "");
  return Response.json(departments);
}
