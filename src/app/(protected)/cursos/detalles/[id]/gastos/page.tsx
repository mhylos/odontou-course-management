import ExpensesTable from "@/components/cursos/detalles/[id]/gastos/ExpensesTable";
import { getIncomesValues } from "@/services/courseServices";
import { getCourseExpenses } from "@/services/expensesServices";

export default async function CourseExpenses({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  const expenses = await getCourseExpenses(parseInt(id));
  const incomesValues = await getIncomesValues(parseInt(id));
  const enrollValue = incomesValues?.enrollValue ?? 0;
  const students = incomesValues?.students ?? 0;

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      <ExpensesTable
        courseId={parseInt(id)}
        expenses={expenses}
        studentsQuantity={students}
        enrollValue={enrollValue}
      />
    </div>
  );
}
