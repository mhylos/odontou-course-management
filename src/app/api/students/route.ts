import { auth } from "@/auth";
import { StudentCreateBody } from "@/lib/definitions";
import prisma from "@/lib/prisma";
import { getAllStudents } from "@/services/studentServices";
// import { registerAction } from "@/services/userServices";
import { NextResponse } from "next/server";

export async function GET() {
  const students = await getAllStudents();
  return Response.json(students);
}

export const POST = auth(async function POST(req) {
  if (!req.auth?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const body: StudentCreateBody = await req.json();
  const student = await prisma.student.create({
    data: body,
  });
  // registerAction({
  //   user_fk: req.auth.user.id,
  //   action: "Creación",
  //   description: `Se creó estudiante ${student.rut}`,
  // });
  return Response.json(student);
});
