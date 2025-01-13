"use client";

import { MultiplyWith, MultiplierTypes, Expenses } from "@prisma/client";
import Input from "@/components/common/Input";
import Table, { Cell, Row } from "@/components/common/Table/Table";
import {
  Control,
  Controller,
  SubmitErrorHandler,
  SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import {
  ExpenseSchemaType,
  expensesSchema,
  ExpensesSchemaType,
} from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import RadioButton from "@/components/common/RadioButton";
import { convertToMoney, isPercentage } from "@/lib/utils";
import Section from "../Section";
import Button from "@/components/common/Button";
import { toast } from "react-toastify";
import { useState } from "react";
import {
  createOrUpdateExpenses,
  deleteExpense,
  getCourseExpensesResponse,
} from "@/services/expensesServices";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import DeleteRowButton from "@/components/common/Table/DeleteRowButton";

interface ExpensesTableProps {
  expenses: Awaited<getCourseExpensesResponse>;
  courseId: number;
  studentsQuantity: number;
  enrollValue: number;
}

function Total({
  control,
  calculateTotal,
}: {
  control: Control<ExpensesSchemaType>;
  calculateTotal: (expense: Partial<ExpenseSchemaType>) => number;
}) {
  const { expenses } = useWatch({ control });
  if (!expenses) return null;

  const total = expenses.reduce((acc, expense) => {
    const value = calculateTotal(expense);

    return acc + value;
  }, 0);

  return <span className="text-4xl font-light">{convertToMoney(total)}</span>;
}

function RowTotal({
  control,
  index,
  calculateTotal,
}: {
  control: Control<ExpensesSchemaType>;
  index: number;
  calculateTotal: (expense: Partial<ExpenseSchemaType>) => number;
}) {
  const expense = useWatch({
    control,
    name: `expenses.${index}`,
  });

  return <span>{convertToMoney(calculateTotal(expense))}</span>;
}

export default function ExpensesTable({
  expenses,
  studentsQuantity,
  enrollValue,
  courseId,
}: ExpensesTableProps) {
  const {
    reset,
    register,
    handleSubmit,
    formState: { isSubmitting, isDirty },
    control,
    setValue,
  } = useForm<ExpensesSchemaType>({
    resolver: zodResolver(expensesSchema),
    defaultValues: {
      expenses: expenses.map((expense) => ({
        ...expense,
        multiplier:
          expense.multiplier.toString() +
          (expense.type == MultiplierTypes.percentage ? "%" : ""),
      })),
    },
  });

  const [rowLoading, setRowLoading] = useState<number>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "expenses",
  });

  const onSubmit: SubmitHandler<ExpensesSchemaType> = (data) => {
    return new Promise(async (resolve) => {
      try {
        const response = await createOrUpdateExpenses(data, courseId);
        toast(response.message, {
          type: response.success ? "success" : "error",
        });
        if (response.success) {
          reset({
            expenses: data.expenses.map((expense) => ({
              ...expense,
              multiplier:
                expense.multiplier.toString() +
                (expense.type == MultiplierTypes.percentage ? "%" : ""),
            })),
          });
        }
        resolve(response);
      } catch (error) {
        console.error(error);
        toast.error("Error al guardar", { toastId: "error" });
        resolve({ success: false });
      }
    });
  };

  const onErrors: SubmitErrorHandler<ExpensesSchemaType> = () => {
    toast.error("Error en un campo", {
      toastId: "error",
    });
  };

  const onDelete = async (expenseId: Expenses["id"], index: number) => {
    setRowLoading(index);
    try {
      if (!confirm("¿Está seguro de eliminar este gasto?")) {
        setRowLoading(undefined);
        return;
      }
      const response = await deleteExpense(expenseId);
      toast(response.message, { type: response.success ? "success" : "error" });
      if (response.success) {
        remove(index);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar", { toastId: "error" });
    }
    setRowLoading(undefined);
  };

  const calculateTotal = (expense: Partial<ExpenseSchemaType>) => {
    if (!expense.multiplier || !expense.multiply) return 0;
    const cleanMultiplier = Number(expense.multiplier.replace(/[^0-9.]/g, ""));
    return (
      (cleanMultiplier / (isPercentage(expense.multiplier) ? 100 : 1)) *
      (expense.multiply === MultiplyWith.enroll_value
        ? enrollValue
        : studentsQuantity)
    );
  };

  return (
    <>
      <form
        className="flex-1 overflow-auto"
        id="expenses-form"
        onSubmit={handleSubmit(onSubmit, onErrors)}
      >
        <Table
          headers={[
            { title: "Concepto", width: "20%" },
            { title: "Costo", width: "5%" },
            { title: "Cantidad", width: "20%" },
            { title: "Total", width: "5%" },
            { title: "Acciones", width: "5%" },
          ]}
        >
          {fields.map(({ name }, i) => {
            return (
              <Row currentRow={i + 1} key={name + i}>
                <Cell>
                  <Input {...register(`expenses.${i}.name`)} />
                </Cell>
                <Cell>
                  <Controller
                    name={`expenses.${i}.multiplier`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        onChange={(e) => {
                          let value = e.target.value;
                          if (RegExp(/^[0-9]*$/).test(value)) {
                            setValue(
                              `expenses.${i}.type`,
                              MultiplierTypes.unit_cost
                            );
                          } else if (RegExp(/.%?$/).test(value)) {
                            setValue(
                              `expenses.${i}.type`,
                              isPercentage(value)
                                ? MultiplierTypes.percentage
                                : MultiplierTypes.unit_cost
                            );
                          }
                          field.onChange(value);
                        }}
                      />
                    )}
                  />
                </Cell>
                <Cell>
                  <RadioButton
                    label={"Arancel"}
                    description={`Multiplica por el valor del arancel (${convertToMoney(
                      enrollValue
                    )})`}
                    inputProps={{
                      ...register(`expenses.${i}.multiply`),
                      value: MultiplyWith.enroll_value,
                      id: `enroll_value_${i}`,
                    }}
                  />
                  <RadioButton
                    label={"Estudiantes"}
                    description={`Multiplica por la cantidad de estudiantes (${studentsQuantity})`}
                    inputProps={{
                      ...register(`expenses.${i}.multiply`),
                      value: MultiplyWith.students,
                      id: `students_${i}`,
                    }}
                  />
                </Cell>
                <Cell>
                  <RowTotal
                    control={control}
                    index={i}
                    calculateTotal={calculateTotal}
                  />
                </Cell>
                {expenses[i]?.id ? (
                  <Cell>
                    <DeleteRowButton
                      disabled={rowLoading === i}
                      onClick={() => onDelete(expenses[i].id, i)}
                      className={
                        rowLoading === i
                          ? "icon-[line-md--loading-loop]"
                          : "icon-[ph--trash]"
                      }
                    />
                  </Cell>
                ) : (
                  <Cell>
                    <DeleteRowButton onClick={() => remove(i)} />
                  </Cell>
                )}
              </Row>
            );
          })}
        </Table>
      </form>

      <Button
        type="button"
        onClick={() =>
          append({
            name: "",
            multiplier: "0",
            multiply: MultiplyWith.enroll_value,
            type: MultiplierTypes.unit_cost,
          })
        }
      >
        Agregar
      </Button>
      <div className="flex gap-2">
        <Section title="Total">
          <Total calculateTotal={calculateTotal} control={control} />
        </Section>
        {isDirty &&
          (!isSubmitting ? (
            <div className="flex flex-col gap-2 justify-center">
              <Button type="submit" form="expenses-form">
                Guardar
              </Button>
              <Button className="!bg-gray-500" onClick={() => reset()}>
                Deshacer
              </Button>
            </div>
          ) : (
            <LoadingSpinner />
          ))}
      </div>
    </>
  );
}
