// import { LoggerCreateBody } from "@/lib/definitions";
import prisma from "@/lib/prisma";

export async function checkStarted() {
  const response = await prisma.administrator.findMany();
  if (response.length > 0) {
    return true;
  } else {
    return false;
  }
}

export async function getPersonalInfo(rut: number) {
  const response = await prisma.user.findUnique({
    where: {
      rut: rut,
    },
    select: {
      name: true,
      email: true,
    },
  });
  return response;
}

// export function registerAction(body: Omit<LoggerCreateBody, "timestamp">) {
//   prisma.logger.create({
//     data: {
//       user: {
//         connect: {
//           rut: body.user_fk,
//         },
//       },
//       action: body.action,
//       description: body.description,
//       timestamp: new Date(),
//     },
//   });
// }
