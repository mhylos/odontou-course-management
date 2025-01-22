import ExpensesTable from "@/components/cursos/detalles/[id]/gastos/ExpensesTable";
import {
  getCourseExpenses,
  getMultiplyValues,
} from "@/services/expensesServices";

export default async function CourseExpenses({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  const expenses = await getCourseExpenses(parseInt(id));
  const multiplyValues = await getMultiplyValues(parseInt(id));

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      <ExpensesTable
        courseId={parseInt(id)}
        expenses={expenses}
        multiplyValues={multiplyValues}
      />
    </div>
  );
}
