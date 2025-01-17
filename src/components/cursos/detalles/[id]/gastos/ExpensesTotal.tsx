import { convertToMoney } from "@/lib/utils";
import { ExpensesSchemaType } from "@/lib/zod";
import Decimal from "decimal.js";
import { useFormContext, useWatch } from "react-hook-form";

export default function ExpensesTotal() {
  const { control } = useFormContext<ExpensesSchemaType>();
  const { expenses } = useWatch({ control });
  if (!expenses) return null;

  const total = expenses.reduce((acc, expense) => {
    if (isNaN(Number(expense.amount))) return acc;

    const value = new Decimal(expense.amount ?? 0);

    return acc.plus(value);
  }, new Decimal(0));

  return (
    <span className="text-4xl font-light">
      {convertToMoney(total.toNumber())}
    </span>
  );
}
