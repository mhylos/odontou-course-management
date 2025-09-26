"use server";

import { auth } from "@/auth";
import { RECORDS_PER_PAGE } from "@/lib/constants";
import { Pagination } from "@/lib/definitions";
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

export async function getLogs(
  pagination: Pagination = { page: 1, pageSize: RECORDS_PER_PAGE }
) {
  const skip = (pagination.page - 1) * pagination.pageSize;
  const take = pagination.pageSize;

  const logs = await prisma.logger.findMany({
    include: { user: { select: { name: true } } },
    orderBy: { timestamp: "desc" },
    skip,
    take,
  });

  const count = await prisma.logger.count();

  return { logs, count };
}
