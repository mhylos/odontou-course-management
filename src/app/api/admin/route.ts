import { UserCreate } from "@/lib/definitions";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const body: UserCreate = await request.json();

  const admin = await prisma.administrator.create({
    data: {
      user: {
        create: {
          rut: body.rut,
          email: body.email,
          name: body.name,
          password: body.password,
        },
        connect: {
          rut: body.rut,
        },
      },
    },
  });

  return Response.json(admin);
}
