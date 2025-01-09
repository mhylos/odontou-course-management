"use client";

import Table, { Cell, Row } from "@/components/common/Table/Table";
import {
  getCourseIncomesResponse,
  updateIncomes,
} from "@/services/incomesServices";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Control,
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { incomesSchema, incomesSchemaType } from "@/lib/zod";
import { toast } from "react-toastify";
import Input from "@/components/common/Input";
import Section from "../Section";
import { convertToMoney } from "@/lib/utils";
import Button from "@/components/common/Button";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface IncomesTableProps {
  data: Awaited<getCourseIncomesResponse>;
  courseId: number;
}

function Total({ control }: { control: Control<incomesSchemaType> }) {
  const incomes = useWatch({ control, name: "incomes" });

  return (
    <Section title="Total">
      <span className="text-4xl font-light">
        {convertToMoney(
          incomes.reduce((acc, { amount }) => acc + Number(amount), 0)
        )}
      </span>
    </Section>
  );
}

export default function IncomesTable({ data, courseId }: IncomesTableProps) {
  const {
    handleSubmit,
    register,
    reset,
    formState: { isDirty, isSubmitting },
    control,
  } = useForm<incomesSchemaType>({
    resolver: zodResolver(incomesSchema),
    defaultValues: { incomes: data },
  });

  const { fields } = useFieldArray({
    control,
    name: "incomes",
  });

  const onSubmit: SubmitHandler<incomesSchemaType> = async (data) => {
    return new Promise(async () => {
      try {
        const response = await updateIncomes(data, courseId);
        toast(response.message, {
          type: response.success ? "success" : "error",
        });
        if (response.success) {
          reset({ incomes: data.incomes });
        }
      } catch (error) {
        console.error(error);
        toast.error("Error al guardar", { toastId: "error" });
      }
    });
  };

  const onErrors = () => {
    toast.error("Error en un campo", { toastId: "error" });
  };

  return (
    <>
      <form
        className="flex-1 overflow-auto"
        id="incomes-form"
        onSubmit={handleSubmit(onSubmit, onErrors)}
      >
        <Table
          headers={[
            { title: "Nombre", width: "40%" },
            { title: "Valor" },
            { title: "Comentario", width: "40%" },
          ]}
        >
          {fields.map(({ name, amount }, i) => (
            <Row currentRow={i + 1} key={name}>
              <Cell>{name}</Cell>
              <Cell>
                <div className="flex place-items-center gap-1">
                  <span className="text-xl font-extralight">$</span>
                  {!(name == "Ingresos arancel") ? (
                    <Controller
                      name={`incomes.${i}.amount`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          value={field.value.toLocaleString("es-CL")}
                          onChange={(e) => {
                            const value = Number(
                              e.target.value.replace(/[^0-9]/g, "")
                            );
                            field.onChange(value);
                          }}
                        />
                      )}
                    />
                  ) : (
                    amount.toLocaleString("es-CL")
                  )}
                </div>
              </Cell>
              <Cell>
                <Input {...register(`incomes.${i}.comment`)} />
              </Cell>
            </Row>
          ))}
        </Table>
      </form>

      <div className="flex gap-2">
        <Total control={control} />
        {isDirty &&
          (!isSubmitting ? (
            <div className="flex flex-col gap-2 justify-center">
              <Button type="submit" form="incomes-form">
                Guardar
              </Button>
              <Button className="!bg-gray-500" onClick={() => reset()}>
                Deshacer
              </Button>
            </div>
          ) : (
            <div className="grid place-items-center w-20">
              <LoadingSpinner />
            </div>
          ))}
      </div>
    </>
  );
}
