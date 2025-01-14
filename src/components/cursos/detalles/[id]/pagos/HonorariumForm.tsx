"use client";

import { convertToMoney, restoreRun } from "@/lib/utils";
import Section from "@/components/cursos/detalles/[id]/Section";
import Decimal from "decimal.js";
import Table, { Cell, Row } from "@/components/common/Table/Table";
import {
  Control,
  Controller,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import {
  AcademicHonorariumSchemaType,
  HonorariumsSchemaType,
  ResponsibleHonorariumSchemaType,
} from "@/lib/zod";
import { HONORARIUMS_FUNCTIONS_DICTIONARY } from "@/lib/constants";
import Input from "@/components/common/Input";
import { AcademicFunctions } from "@prisma/client";
import Dropdown, { Option } from "@/components/common/Dropdown";
import { Fragment, useState } from "react";

interface HonorariumFormProps {
  totalHonorariums: string;
  academicsHonorariums: AcademicHonorariumSchemaType[];
  responsiblesHonorariums: ResponsibleHonorariumSchemaType[];
}

function getTotalToDistribute(
  control: Control<HonorariumsSchemaType>,
  academicHonorarium: string
) {
  const percentages = useWatch({
    name: "responsiblesHonorariums",
    control,
  });

  let totalToDistribute = new Decimal(academicHonorarium);

  percentages.forEach((percentage, i) => {
    const value = new Decimal(percentage.percentage || 0)
      .div(100)
      .times(totalToDistribute);
    totalToDistribute = totalToDistribute.sub(value);
  });
  return totalToDistribute;
}

function getTotalHours(control: Control<HonorariumsSchemaType>) {
  const honorariums = useWatch({ name: "academicsHonorariums", control });

  return honorariums.reduce(
    (acc, field) =>
      acc.plus(
        field.functions.reduce(
          (acc, field) => acc.plus(field.hours || 0),
          new Decimal(0)
        )
      ),
    new Decimal(0)
  );
}

function TotalToPayToResponsible({
  control,
  index,
  totalToDistribute,
}: {
  control: Control<HonorariumsSchemaType>;
  index: number;
  totalToDistribute: Decimal;
}) {
  const percentages = useWatch({ name: "responsiblesHonorariums", control });

  const total = new Decimal(percentages[index].percentage || 0)
    .div(100)
    .times(totalToDistribute);

  return <span>{convertToMoney(total.toNumber())}</span>;
}

function TotalToPayToAcademic({
  control,
  index,
  hourValue,
}: {
  control: Control<HonorariumsSchemaType>;
  index: number;
  hourValue: Decimal;
}) {
  const honorariums = useWatch({ name: "academicsHonorariums", control });

  const honorarium = Decimal.mul(
    honorariums[index].functions.reduce(
      (acc, field) => acc.plus(field.hours || 0),
      new Decimal(0)
    ),
    hourValue
  );

  return <span>{convertToMoney(honorarium.toNumber())}</span>;
}

const academicFunctionsOptions: Option[] = (
  Object.keys(AcademicFunctions) as Array<keyof typeof AcademicFunctions>
).map((key) => ({
  name: HONORARIUMS_FUNCTIONS_DICTIONARY[key],
  value: AcademicFunctions[key],
}));

function TotalByFunction({
  control,
  academicIndex,
  hourValue,
  functionIndex,
}: {
  control: Control<HonorariumsSchemaType>;
  academicIndex: number;
  hourValue: Decimal;
  functionIndex: number;
}) {
  const hours = useWatch({
    name: `academicsHonorariums.${academicIndex}.functions.${functionIndex}.hours`,
    control,
  });

  const total = hourValue.times(hours || 0);

  return <span>{convertToMoney(total.toNumber())}</span>;
}

export default function HonorariumForm({
  totalHonorariums,
  academicsHonorariums,
  responsiblesHonorariums,
}: HonorariumFormProps) {
  const { control, register } = useForm<HonorariumsSchemaType>({
    defaultValues: {
      academicsHonorariums: academicsHonorariums,
      responsiblesHonorariums: responsiblesHonorariums,
    },
  });

  const [expandedRow, setExpandedRow] = useState<number[]>([]);

  const { fields: academicFields, insert } = useFieldArray({
    control,
    name: "academicsHonorariums",
  });

  const { fields: responsibleFields } = useFieldArray({
    control,
    name: "responsiblesHonorariums",
  });

  const totalToDistribute = getTotalToDistribute(control, totalHonorariums);

  const totalHours = getTotalHours(control);

  const hourValue = totalToDistribute.div(totalHours);

  return (
    <div className="grid grid-cols-[3fr_1fr] grid-rows-[1.2fr_1fr_3fr] gap-4 w-full">
      <div className="row-span-2">
        <Section
          title="Honorarios administrativos"
          containerClassname="h-full"
          className=""
        >
          <Table
            headers={[
              { title: "Nombre" },
              { title: "Función" },
              { title: "Porcentaje" },
              { title: "Monto a pagar" },
              { title: "Detalles" },
            ]}
          >
            {responsibleFields.map((field, i) => (
              <Row currentRow={i + 1} key={field.id}>
                <Cell>
                  <span>{field.academic_name}</span>
                </Cell>
                <Cell>{HONORARIUMS_FUNCTIONS_DICTIONARY[field.function]}</Cell>
                <Cell>
                  <div className="relative grid place-items-center">
                    <Controller
                      control={control}
                      name={`responsiblesHonorariums.${i}.percentage`}
                      render={({ field: { onChange, value } }) => (
                        <Input
                          value={value || ""}
                          onChange={(e) => {
                            let value = e.currentTarget.value.replace(
                              /[^0-9.]/g,
                              ""
                            );
                            let n = new Decimal(value || 0);
                            if (n.greaterThan("100") || n.lessThan("0")) {
                              return;
                            }

                            onChange(value ?? 0);
                          }}
                        />
                      )}
                    />
                    <span className="absolute right-4 text-gray-400">%</span>
                  </div>
                </Cell>
                <Cell>
                  <TotalToPayToResponsible
                    control={control}
                    index={i}
                    totalToDistribute={totalToDistribute}
                  />
                </Cell>
                <Cell></Cell>
              </Row>
            ))}
          </Table>
        </Section>
      </div>
      <Section title="Distribución de honorarios" containerClassname="h-full">
        <div className="grid grid-cols-2 grid-rows-[max-content] gap-y-1 gap-x-2 font-extralight text-center text-sm">
          <span className="text-2xl font-light text-center self-center">
            {convertToMoney(parseInt(totalHonorariums))}
          </span>
          <span className="text-2xl font-light text-center self-center">
            {convertToMoney(totalToDistribute.toNumber())}
          </span>
          <span>Honorarios académicos</span>
          <span>Total a distribuir</span>
        </div>
      </Section>

      <Section
        title="Valor hora"
        containerClassname="h-full"
        className="overflow-hidden"
      >
        <div className="grid grid-cols-3 place-items-center w-max text-center self-center">
          <span className="font-extralight text-sm">Total a distribuir</span>
          <span className="row-span-2 icon-[iconamoon--sign-division-slash-thin] text-4xl" />
          <span className="font-extralight text-sm">Horas totales</span>
          <span className="text-2xl font-light overflow-hidden max-w-[5rem]">
            {convertToMoney(totalToDistribute.toNumber())}
          </span>
          <span className="text-2xl font-light max-w-[5rem]">
            {totalHours.toString()}
          </span>
        </div>
        <span className="text-4xl font-light">
          {convertToMoney(hourValue.toNumber())}
        </span>
      </Section>

      <div className="col-span-2 overflow-auto h-full">
        <Section title="Honorarios académicos" containerClassname="h-full">
          <Table
            headers={[
              { title: "Nombre", width: "25%" },
              { title: "RUT" },
              { title: "Monto a pagar total" },
              { title: "", width: "5%" },
            ]}
            className="h-full"
          >
            {academicFields.map((field, i) => (
              <Fragment key={field.id}>
                <Row
                  key={"row" + field.id}
                  currentRow={i + 1}
                  className="relative group cursor-pointer"
                  onClick={() => {
                    if (expandedRow.includes(i)) {
                      setExpandedRow((prev) => prev.filter((row) => row !== i));
                    } else {
                      setExpandedRow((prev) => [...prev, i]);
                    }
                  }}
                >
                  <Cell>
                    <span>{field.academic_name}</span>
                  </Cell>
                  <Cell>
                    <span>{restoreRun(field.academic_rut)}</span>
                  </Cell>
                  <Cell>
                    <TotalToPayToAcademic
                      control={control}
                      index={i}
                      hourValue={hourValue}
                    />
                  </Cell>
                  <Cell>
                    <span
                      className={`icon-[ci--chevron-down] text-gray-400 text-xl transition-transform ${
                        expandedRow.includes(i) ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </Cell>
                </Row>
                <Row className={`${expandedRow.includes(i) ? "" : "hidden"}`}>
                  <Cell />
                  <Cell colSpan={3} className="p-2 relative">
                    <Table
                      headers={[
                        { title: "Función" },
                        { title: "Horas comprometidas" },
                        { title: "Monto a pagar" },
                      ]}
                    >
                      {field.functions.map((func, j) => (
                        <Row
                          key={func.academic_honorarium_id ?? "0" + j}
                          currentRow={j + 1}
                        >
                          <Cell className="py-0">
                            <span>
                              {HONORARIUMS_FUNCTIONS_DICTIONARY[func.function]}
                            </span>
                          </Cell>
                          <Cell className="py-0">
                            <Input
                              {...register(
                                `academicsHonorariums.${i}.functions.${j}.hours`
                              )}
                            />
                          </Cell>
                          <Cell className="!py-0">
                            <TotalByFunction
                              control={control}
                              academicIndex={i}
                              hourValue={hourValue}
                              functionIndex={j}
                            />
                          </Cell>
                        </Row>
                      ))}
                    </Table>
                  </Cell>
                </Row>
              </Fragment>
            ))}
          </Table>
        </Section>
      </div>
    </div>
  );
}
