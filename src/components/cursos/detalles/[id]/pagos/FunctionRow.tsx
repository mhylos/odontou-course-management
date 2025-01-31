import { useHonorariumAmount } from "@/app/context/HonorariumProvider";
import Input from "@/components/common/Input";
import ActionRowButton from "@/components/common/Table/ActionRowButton";
import { Cell, Row } from "@/components/common/Table/Table";
import { HONORARIUMS_FUNCTIONS_DICTIONARY } from "@/lib/constants";
import { convertToMoney, decimalNumberFormat } from "@/lib/utils";
import { AcademicHonorariumSchemaType, HonorariumsSchemaType } from "@/lib/zod";
import Decimal from "decimal.js";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { Control, Controller, useWatch } from "react-hook-form";

interface FunctionRowProps {
  honorariumId: number;
  control: Control<HonorariumsSchemaType>;
  academicRut: number;
  functionField: AcademicHonorariumSchemaType["functions"][number];
  studentIndex: number;
  functionIndex: number;
  hourValue: Decimal;
}

const useGetTotalByFunction = (
  control: Control<HonorariumsSchemaType>,
  academicIndex: number,
  functionIndex: number,
  hourValue: Decimal
) => {
  {
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
};

export default function FunctionRow({
  control,
  academicRut,
  functionField,
  studentIndex,
  functionIndex,
  hourValue,
}: FunctionRowProps) {
  const total = useGetTotalByFunction(
    control,
    studentIndex,
    functionIndex,
    hourValue
  );

  const { setHonorarium } = useHonorariumAmount();

  const { push } = useRouter();

  // const lastPaymentDay = functionField.academic_honorarium_id
  //   ? getLastAcademicPaymentDateById(functionField.academic_honorarium_id)
  //   : null;

  return (
    <Row currentRow={functionIndex + 1}>
      <Cell className="py-0">
        <span>{HONORARIUMS_FUNCTIONS_DICTIONARY[functionField.function]}</span>
      </Cell>
      <Cell className="py-0">
        <Controller
          name={`academicsHonorariums.${studentIndex}.functions.${functionIndex}.hours`}
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

      <Cell className="flex">
        {functionField.academic_honorarium_id && (
          <ActionRowButton
            type="button"
            className="w-max"
            onClick={(e) => {
              e.stopPropagation();
              setHonorarium({
                rut: academicRut,
                honorarium_id: functionField.academic_honorarium_id!,
                amount: total,
                type: "academic",
              });
              push(
                `pagos/honorarios-academicos/${functionField.academic_honorarium_id}`
              );
            }}
          >
            <span className="icon-[ph--receipt] text-xl" />
          </ActionRowButton>
        )}
      </Cell>
    </Row>
  );
}
