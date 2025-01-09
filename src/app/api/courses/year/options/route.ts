import { Option } from "@/components/common/Dropdown";
import prisma from "@/lib/prisma";

export async function GET() {
  const years = await prisma.course.findMany({
    select: { date_from: true },
    orderBy: { date_from: "desc" },
  });

  const uniqueYears = Array.from(
    new Set(years.map(({ date_from }) => date_from.getFullYear()))
  );

  const options: Option[] = uniqueYears.map((year) => ({
    value: year,
    name: year,
  }));

  return Response.json(options);
}
