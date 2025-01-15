import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Table, { Row, Cell } from "@/components/common/Table/Table";
import { HONORARIUMS_FUNCTIONS_DICTIONARY } from "@/lib/constants";
import { convertToMoney, restoreRun } from "@/lib/utils";
import { AcademicHonorariumSchemaType, HonorariumsSchemaType } from "@/lib/zod";
import { AcademicFunctions } from "@prisma/client";
import { Fragment, useState } from "react";
import {
  Control,
  useFieldArray,
  UseFormRegister,
  useWatch,
} from "react-hook-form";
import Dropdown, { Option } from "@/components/common/Dropdown";
import Decimal from "decimal.js";
import Chip from "@/components/common/Chip";
import ActionRowButton from "@/components/common/Table/ActionRowButton";

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
  register,
  hourValue,
}: AcademicsHonorariumsTableProps) {
  const [expandedRow, setExpandedRow] = useState<number[]>([]);
  const [addingFunction, setAddingFunction] = useState<number>();
  const { fields, update } = useFieldArray({
    control,
    name: "academicsHonorariums",
  });

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
            <Cell className="flex gap-2">
              {field.functions.map((func, func_index) => (
                <Chip key={func.function + func_index}>
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
                  { title: "Acciones" },
                ]}
                className="overflow-visible"
              >
                {field.functions.map((func, j) => (
                  <Row key={func.function ?? "0" + j} currentRow={j + 1}>
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
                    <Cell className="flex gap-2">
                      <ActionRowButton className="max-w-max ">
                        <span className="icon-[ph--book-bookmark] text-xl" />
                      </ActionRowButton>
                    </Cell>
                  </Row>
                ))}
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
                          className="max-w-max grid place-items-center"
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
