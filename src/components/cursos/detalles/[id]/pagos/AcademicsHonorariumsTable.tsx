import Input from "@/components/common/Input";
import Table, { Row, Cell } from "@/components/common/Table/Table";
import { HONORARIUMS_FUNCTIONS_DICTIONARY } from "@/lib/constants";
import { convertToMoney, decimalNumberFormat, restoreRun } from "@/lib/utils";
import { HonorariumsSchemaType } from "@/lib/zod";
import { AcademicFunctions } from "@prisma/client";
import { Fragment, useMemo, useState } from "react";
import {
  Control,
  Controller,
  useFieldArray,
  UseFormRegister,
  useWatch,
} from "react-hook-form";
import Dropdown, { Option } from "@/components/common/Dropdown";
import Decimal from "decimal.js";
import Chip from "@/components/common/Chip";
import ActionRowButton from "@/components/common/Table/ActionRowButton";
import { useHonorariumAmount } from "@/app/context/HonorariumProvider";
import { useRouter } from "next/navigation";

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
    honorariums[index].functions.reduce((acc, field) => {
      const hours = new Decimal(!field.hours ? 0 : field.hours);
      return acc.plus(hours);
    }, new Decimal(0)),
    hourValue
  );

  return <span>{convertToMoney(honorarium.toNumber())}</span>;
}

function getTotalByFunction({
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

  const total = useMemo(
    () => hourValue.times(!hours ? 0 : hours),
    [hourValue, hours]
  );

  return total.toNumber();
}

const academicFunctionsOptions: Option[] = (
  Object.keys(AcademicFunctions) as Array<keyof typeof AcademicFunctions>
).map((key) => ({
  name: HONORARIUMS_FUNCTIONS_DICTIONARY[key],
  value: AcademicFunctions[key],
}));

interface AcademicsHonorariumsTableProps {
  control: Control<HonorariumsSchemaType>;
  register: UseFormRegister<HonorariumsSchemaType>;
  hourValue: Decimal;
}

export default function AcademicsHonorariumsTable({
  control,
  hourValue,
}: AcademicsHonorariumsTableProps) {
  const [expandedRow, setExpandedRow] = useState<number[]>([]);
  const [addingFunction, setAddingFunction] = useState<number>();
  const { fields, update } = useFieldArray({
    control,
    name: "academicsHonorariums",
  });
  const { setHonorarium } = useHonorariumAmount();
  const { push } = useRouter();

  return (
    <Table
      headers={[
        { title: "Nombre", width: "25%" },
        { title: "RUT", width: "15%" },
        { title: "Funciones", width: "20%" },
        { title: "Monto a pagar total", width: "10%" },
        { title: "", width: "5%" },
      ]}
      className="h-full overflow-y-scroll"
    >
      {fields.map((field, i) => (
        <Fragment key={field.honorarium_id}>
          <Row
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
              <span className="capitalize">{field.academic_name}</span>
            </Cell>
            <Cell>
              <span>{restoreRun(field.academic_rut)}</span>
            </Cell>
            <Cell className="flex gap-2">
              {field.functions.map((func, func_index) => (
                <Chip key={field.honorarium_id + func_index + func.function}>
                  {HONORARIUMS_FUNCTIONS_DICTIONARY[func.function]}
                </Chip>
              ))}
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
            <Cell colSpan={5} className="p-2 relative">
              <Table
                headers={[
                  { title: "Función" },
                  { title: "Horas comprometidas" },
                  { title: "Monto a pagar" },
                  { title: "Último pago" },
                  { title: "" },
                ]}
                className="overflow-visible"
              >
                {field.functions.map((func, j) => {
                  const total = getTotalByFunction({
                    control,
                    academicIndex: i,
                    hourValue,
                    functionIndex: j,
                  });

                  return (
                    <Row
                      key={field.honorarium_id + func.function}
                      currentRow={j + 1}
                    >
                      <Cell className="py-0">
                        <span>
                          {HONORARIUMS_FUNCTIONS_DICTIONARY[func.function]}
                        </span>
                      </Cell>
                      <Cell className="py-0">
                        <Controller
                          name={`academicsHonorariums.${i}.functions.${j}.hours`}
                          control={control}
                          render={({ field: { onChange, ...field } }) => (
                            <Input
                              {...field}
                              onChange={(e) => {
                                onChange(decimalNumberFormat(e.target.value));
                              }}
                            />
                          )}
                        />
                      </Cell>
                      <Cell className="!py-0">{convertToMoney(total)}</Cell>
                      <Cell className="!py-0">
                        <span className="text-xs">-</span>
                      </Cell>

                      <Cell className="flex">
                        {func.academic_honorarium_id && (
                          <ActionRowButton
                            type="button"
                            className="w-max"
                            onClick={(e) => {
                              e.stopPropagation();
                              setHonorarium({
                                rut: field.academic_rut,
                                honorarium_id: func.academic_honorarium_id!,
                                amount: total,
                                type: "academic",
                              });
                              push(
                                `pagos/honorarios-academicos/${func.academic_honorarium_id}`
                              );
                            }}
                          >
                            <span className="icon-[ph--receipt] text-xl" />
                          </ActionRowButton>
                        )}
                      </Cell>
                    </Row>
                  );
                })}
                {addingFunction === i ? (
                  <Row>
                    <Cell className="flex place-items-center gap-2">
                      <Dropdown
                        label="Seleccione una función"
                        className="w-full !mt-0"
                        options={academicFunctionsOptions.filter(
                          (option) =>
                            !field.functions.some(
                              (func) => func.function === option.value
                            )
                        )}
                        onChange={(value) => {
                          update(i, {
                            ...field,
                            functions: [
                              ...field.functions,
                              {
                                function: value.value as AcademicFunctions,
                                hours: "",
                              },
                            ],
                          });
                          setAddingFunction(undefined);
                        }}
                        id={"new-row"}
                      />
                    </Cell>
                  </Row>
                ) : (
                  field.functions.length < academicFunctionsOptions.length && (
                    <Row>
                      <Cell
                        className="flex place-items-center gap-2"
                        colSpan={3}
                      >
                        <ActionRowButton
                          id="add-row"
                          type="button"
                          className="grid place-items-center"
                          onClick={() => {
                            setAddingFunction(i);
                          }}
                        >
                          <span className="icon-[ci--plus] text-xl" />
                        </ActionRowButton>
                        <label className="font-medium" htmlFor="add-row">
                          Agregar función adicional
                        </label>
                      </Cell>
                    </Row>
                  )
                )}
              </Table>
            </Cell>
          </Row>
        </Fragment>
      ))}
    </Table>
  );
}
