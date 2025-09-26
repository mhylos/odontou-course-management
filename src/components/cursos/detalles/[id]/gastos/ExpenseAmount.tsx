import Input from "@/components/common/Input";
import { MultiplyValues } from "@/lib/definitions";
import { decimalNumberFormat, isPercentage } from "@/lib/utils";
import { ExpensesSchemaType } from "@/lib/zod";
import { MultiplyWith } from "@prisma/client";
import Decimal from "decimal.js";
import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";

interface ExpenseAmountProps {
  index: number;
  multiplyValues: MultiplyValues;
}

export default function ExpenseAmount({
  index,
  multiplyValues,
}: ExpenseAmountProps) {
  const { control, setValue, register } = useFormContext<ExpensesSchemaType>();

  const multiplier = useWatch({
    control,
    name: `expenses.${index}.multiplier`,
  });
  const multiply = useWatch({ control, name: `expenses.${index}.multiply` });

  useEffect(() => {
    if (multiply !== MultiplyWith.manual) {
      const cleanMultiplier = multiplier.replace(/[^0-9.]/g, "");
      if (
        !multiplier ||
        isNaN(Number(cleanMultiplier)) ||
        cleanMultiplier === ""
      )
        return;

      const decimalMultiplier = new Decimal(
        decimalNumberFormat(cleanMultiplier)
      );
      const multiplyValue = new Decimal(multiplyValues[multiply]);
      const amount = multiplyValue.times(
        decimalMultiplier.div(isPercentage(multiplier) ? 100 : 1)
      );
      setValue(`expenses.${index}.amount`, amount.toNumber());
    }
  }, [multiply, multiplier, multiplyValues, index, setValue]);

  return (
    <div className="flex gap-2 items-center">
      <span className="text-xl font-light">$</span>
      <Input
        {...register(`expenses.${index}.amount`)}
        disabled={multiply !== MultiplyWith.manual}
      />
    </div>
  );
}
