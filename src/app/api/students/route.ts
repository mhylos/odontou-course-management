import { Student } from "@/lib/definitions";
import prisma from "@/lib/prisma";
import { getAllStudents } from "@/services/studentServices";

export async function GET() {
  const students = await getAllStudents();
  return Response.json(students);
}

export async function POST(request: Request) {
  const body: Student = await request.json();
  const student = await prisma.student.create({
    data: body,
  });
  return Response.json(student);
}
