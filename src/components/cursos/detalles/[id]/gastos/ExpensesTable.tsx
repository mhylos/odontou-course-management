"use client";

import { MultiplyWith, MultiplierTypes, Expenses } from "@prisma/client";
import Input from "@/components/common/Input";
import Table, { Cell, Row } from "@/components/common/Table/Table";
import {
  Control,
  Controller,
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useFieldArray,
  useForm,
  UseFormRegister,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import {
  ExpenseSchemaType,
  expensesSchema,
  ExpensesSchemaType,
} from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import RadioButton from "@/components/common/RadioButton";
import { convertToMoney, decimalNumberFormat, isPercentage } from "@/lib/utils";
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
import { MultiplyValues } from "@/lib/definitions";
import Decimal from "decimal.js";
import Section from "../Section";
import ExpenseAmount from "./ExpenseAmount";
import ExpensesTotal from "./ExpensesTotal";

interface ExpensesTableProps {
  expenses: Awaited<getCourseExpensesResponse>;
  courseId: number;
  multiplyValues: MultiplyValues;
}

export default function ExpensesTable({
  expenses,
  multiplyValues,
  courseId,
}: ExpensesTableProps) {
  const form = useForm<ExpensesSchemaType>({
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
    control: form.control,
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
          form.reset({
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

  return (
    <FormProvider {...form}>
      <form
        className="flex-1 overflow-auto"
        id="expenses-form"
        onSubmit={form.handleSubmit(onSubmit, onErrors)}
      >
        <Table
          headers={[
            { title: "Concepto", width: "20%" },
            { title: "Costo", width: "10%" },
            { title: "Cantidad", width: "20%" },
            { title: "Total", width: "10%" },
            { title: "", width: "5%" },
          ]}
        >
          {fields.map(({ name }, i) => {
            return (
              <Row currentRow={i + 1} key={name + i}>
                <Cell>
                  <Input {...form.register(`expenses.${i}.name`)} />
                </Cell>
                <Cell>
                  <Controller
                    name={`expenses.${i}.multiplier`}
                    control={form.control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        onChange={(e) => {
                          let value = e.target.value;
                          if (RegExp(/^[0-9]*$/).test(value)) {
                            form.setValue(
                              `expenses.${i}.type`,
                              MultiplierTypes.unit_cost
                            );
                          } else if (RegExp(/.%?$/).test(value)) {
                            form.setValue(
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
                  <Controller
                    name={`expenses.${i}.multiply`}
                    control={form.control}
                    render={({ field: { value, onChange } }) => {
                      const handleClick = (selected: MultiplyWith) => {
                        if (value === selected) onChange(null);
                      };

                      return (
                        <>
                          <RadioButton
                            label={"Ingresos de Arancel"}
                            description={`Multiplica por los ingresos del arancel (${convertToMoney(
                              Number(multiplyValues.enroll_incomes)
                            )})`}
                            inputProps={{
                              checked: value === MultiplyWith.enroll_incomes,
                              value: MultiplyWith.enroll_incomes,
                              id: `enroll_value_${i}`,
                              onChange: onChange,
                              onClick: () =>
                                handleClick(MultiplyWith.enroll_incomes),
                            }}
                          />
                          <RadioButton
                            label={"Estudiantes"}
                            description={`Multiplica por la cantidad de estudiantes (${multiplyValues.students_enrolled})`}
                            inputProps={{
                              checked: value === MultiplyWith.students_enrolled,
                              value: MultiplyWith.students_enrolled,
                              id: `students_${i}`,
                              onChange: onChange,
                              onClick: () =>
                                handleClick(MultiplyWith.students_enrolled),
                            }}
                          />
                          <RadioButton
                            label={"E-Learning"}
                            description={`Multiplica por la cantidad de horas no presenciales y por la cantidad de estudiantes inscritos ($${new Decimal(
                              multiplyValues.elearning_incomes
                            )
                              .toNumber()
                              .toLocaleString("es-CL")})`}
                            inputProps={{
                              checked: value === MultiplyWith.elearning_incomes,
                              value: MultiplyWith.elearning_incomes,
                              id: `elearning_${i}`,
                              onChange: onChange,
                              onClick: () =>
                                handleClick(MultiplyWith.elearning_incomes),
                            }}
                          />
                        </>
                      );
                    }}
                  />
                </Cell>
                <Cell>
                  <ExpenseAmount index={i} multiplyValues={multiplyValues} />
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
            multiply: MultiplyWith.students_enrolled,
            type: MultiplierTypes.unit_cost,
            amount: 0,
          })
        }
      >
        Agregar
      </Button>
      <div className="flex gap-2">
        <Section title="Total">
          <ExpensesTotal />
        </Section>
        {form.formState.isDirty &&
          (!form.formState.isSubmitting ? (
            <div className="flex flex-col gap-2 justify-center">
              <Button type="submit" form="expenses-form">
                Guardar
              </Button>
              <Button className="!bg-gray-500" onClick={() => form.reset()}>
                Deshacer
              </Button>
            </div>
          ) : (
            <LoadingSpinner />
          ))}
      </div>
    </FormProvider>
  );
}
