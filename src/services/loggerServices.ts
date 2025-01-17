"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Actions } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function registerAction(action: Actions, description: string) {
  console.log(`Action: ${action} - Description: ${description}`);
  const session = await auth();
  if (!session) {
    console.log("No session found");
    return;
  }

  await prisma.logger.create({
    data: {
      user: { connect: { rut: session.user.rut } },
      action: action,
      description: description,
    },
  });

  revalidatePath("/");
}

export async function getLogs() {
  const logs = await prisma.logger.findMany({
    include: { user: { select: { name: true } } },
    orderBy: { timestamp: "desc" },
    take: 10,
  });
  return logs;
}
