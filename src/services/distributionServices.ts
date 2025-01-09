"use server";

import prisma from "@/lib/prisma";

export async function getDistributions(courseId: number) {
  const distributions = await prisma.distribution.findMany({
    where: { course_fk: courseId },
    select: {
      id: true,
      name: true,
      percentage: true,
    },
  });

  return distributions.map((distribution) => ({
    ...distribution,
    percentage: distribution.percentage.toString(),
  }));
}
