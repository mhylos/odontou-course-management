import IncomesTable from "@/components/cursos/detalles/[id]/ingresos/IncomesTable";
import { getCourseIncomes } from "@/services/incomesServices";

export default async function CourseIncomes({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  const incomes = await getCourseIncomes(parseInt(id));

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      <IncomesTable data={incomes} courseId={parseInt(id)} />
    </div>
  );
}
