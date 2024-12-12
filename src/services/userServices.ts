import prisma from "@/lib/prisma";

export async function checkStarted() {
  const response = await prisma.administrator.findMany();
  if (response.length > 0) {
    return true;
  } else {
    return false;
  }
}
