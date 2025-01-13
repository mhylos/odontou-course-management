"use client";

import { convertToMoney } from "@/lib/utils";
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
  const hours = useWatch({ name: "academicsHonorariums", control });

  return hours.reduce(
    (acc, field) => acc.plus(field.hours || 0),
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

  const honorarium = Decimal.mul(honorariums[index].hours || 0, hourValue);

  return <span>{convertToMoney(honorarium.toNumber())}</span>;
}

const academicFunctionsOptions: Option[] = (
  Object.keys(AcademicFunctions) as Array<keyof typeof AcademicFunctions>
).map((key) => ({
  name: HONORARIUMS_FUNCTIONS_DICTIONARY[key],
  value: AcademicFunctions[key],
}));

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
                    <span className="absolute right-2 text-gray-400">%</span>
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

      <Section title="Valor hora" containerClassname="h-full">
        <div className="grid grid-cols-3 place-items-center w-max text-center self-center">
          <span className="font-extralight text-sm">Total a distribuir</span>
          <span className="row-span-2 icon-[iconamoon--sign-division-slash-thin] text-4xl" />
          <span className="font-extralight text-sm">Horas totales</span>
          <span className="text-2xl font-light">
            {convertToMoney(totalToDistribute.toNumber())}
          </span>
          <span className="text-2xl font-light">{totalHours.toString()}</span>
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
              { title: "Horas comprometidas" },
              { title: "Función", width: "20%" },
              { title: "Monto a pagar" },
              { title: "Detalles" },
            ]}
            className="h-full"
          >
            {academicFields.map((field, index) => (
              <Row currentRow={index + 1} key={field.id}>
                <Cell>
                  <span>{field.academic_name}</span>
                </Cell>
                <Cell>
                  <Input {...register(`academicsHonorariums.${index}.hours`)} />
                </Cell>
                <Cell>
                  <Controller
                    control={control}
                    name={`academicsHonorariums.${index}.function`}
                    render={({ field: { value, onChange, name } }) => (
                      <Dropdown
                        id={name}
                        selected={academicFunctionsOptions.find(
                          (option) => option.value === value
                        )}
                        options={academicFunctionsOptions}
                        onChange={(value) => onChange(value)}
                        className="w-full"
                      />
                    )}
                  />
                </Cell>
                <Cell>
                  <div className="flex place-items-center gap-1">
                    <TotalToPayToAcademic
                      control={control}
                      index={index}
                      hourValue={hourValue}
                    />
                  </div>
                </Cell>
                <Cell>
                  <span></span>
                </Cell>
              </Row>
            ))}
          </Table>
        </Section>
      </div>
    </div>
  );
}
