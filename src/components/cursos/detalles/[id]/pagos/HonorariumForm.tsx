"use client";

import { convertToMoney } from "@/lib/utils";
import Section from "../Section";
import DirectorCoordinatorInput from "./DirectorCoordinatorInput";
import Decimal from "decimal.js";
import Table, { Cell, Row } from "@/components/common/Table/Table";
import { Control, useFieldArray, useForm, useWatch } from "react-hook-form";
import { honorariumsSchemaType } from "@/lib/zod";
import { HONORARIUMS_FUNCTIONS_DICTIONARY } from "@/lib/constants";

interface HonorariumFormProps {
  academicHonorarium: string;
  values?: honorariumsSchemaType;
}

function TotalToDistribute({
  control,
  academicHonorarium,
}: {
  control: Control<honorariumsSchemaType>;
  academicHonorarium: string;
}) {
  const percetages = useWatch({
    name: ["director_percentage", "coordinator_percentage"],
    control,
  });

  const directorPercentage = new Decimal(percetages[0] || 0).div(100);
  const coordinatorPercentage = new Decimal(percetages[1] || 0).div(100);

  const directorAmount = Decimal.mul(academicHonorarium, directorPercentage);
  const coordinatorAmount = Decimal.mul(
    academicHonorarium,
    coordinatorPercentage
  );

  const total = directorAmount.add(coordinatorAmount);
  const toDistribute = new Decimal(academicHonorarium).sub(total);

  return (
    <span className="text-2xl font-light text-center self-center">
      {convertToMoney(toDistribute.toNumber())}
    </span>
  );
}

export default function HonorariumForm({
  academicHonorarium,
  values,
}: HonorariumFormProps) {
  const { control } = useForm<honorariumsSchemaType>({
    defaultValues: values,
  });

  const { fields } = useFieldArray({
    control,
    name: "honorariums",
  });

  console.log(values);

  return (
    <div className="grid grid-cols-[1fr_2fr] grid-rows-[1fr_3fr] gap-4 w-full">
      <Section title="Valor hora">
        <span className="text-4xl font-light">{convertToMoney(1)}</span>
      </Section>
      <Section title="">
        <div className="grid grid-cols-3 grid-rows-[max-content] gap-4">
          <span className="font-extralight text-center">
            Honorarios académicos
          </span>
          <span className="font-extralight text-center">Porcentajes</span>
          <span className="font-extralight text-center">
            Total a distribuir
          </span>

          <span className="text-2xl font-light text-center self-center">
            {convertToMoney(parseInt(academicHonorarium))}
          </span>
          <DirectorCoordinatorInput
            academicHonorarium={academicHonorarium}
            control={control}
          />
          <TotalToDistribute
            academicHonorarium={academicHonorarium}
            control={control}
          />
        </div>
      </Section>
      <Table
        className="col-span-2"
        headers={[
          { title: "Nombre" },
          { title: "Horas comprometidas" },
          { title: "Función" },
          { title: "Monto a pagar" },
          { title: "Fecha del último pago" },
        ]}
      >
        {fields.map((field, index) => (
          <Row currentRow={index + 1} key={field.id}>
            <Cell>
              <span>{field.academic_fk}</span>
            </Cell>
            <Cell>
              <span>{field.hours}</span>
            </Cell>
            <Cell>
              <span>{HONORARIUMS_FUNCTIONS_DICTIONARY[field.function]}</span>
            </Cell>
            <Cell>
              <div className="flex place-items-center gap-1">
                <span>{convertToMoney(field.hours)}</span>
              </div>
            </Cell>
          </Row>
        ))}
      </Table>
    </div>
  );
}
