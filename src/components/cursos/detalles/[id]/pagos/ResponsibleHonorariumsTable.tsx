import Input from "@/components/common/Input";
import ActionRowButton from "@/components/common/Table/ActionRowButton";
import Table, { Row, Cell } from "@/components/common/Table/Table";
import { useHonorariumAmount } from "@/context/HonorariumProvider";
import { HONORARIUMS_FUNCTIONS_DICTIONARY } from "@/lib/constants";
import { convertToMoney, decimalNumberFormat } from "@/lib/utils";
import {
  HonorariumsSchemaType,
  ResponsibleHonorariumSchemaType,
} from "@/lib/zod";
import Decimal from "decimal.js";
import { useEffect } from "react";
import { Control, Controller, useFieldArray, useWatch } from "react-hook-form";

function TotalToPayToResponsible({
  control,
  index,
  totalHonorariums,
  field,
}: {
  control: Control<HonorariumsSchemaType>;
  index: number;
  totalHonorariums: Decimal;
  field: ResponsibleHonorariumSchemaType;
}) {
  const { addOrUpdateAdministrative } = useHonorariumAmount();
  const percentage = useWatch({
    name: `responsiblesHonorariums.${index}.percentage`,
    control,
  });

  const parsedPercentage = Number(percentage);

  const total = Decimal.div(
    isNaN(parsedPercentage) ? 100 : parsedPercentage,
    100
  ).mul(totalHonorariums);

  useEffect(() => {
    addOrUpdateAdministrative({
      honorarium_id: field.responsible_honorarium_id,
      rut: field.academic_rut,
      amount: total.toNumber(),
    });
  }, [percentage, addOrUpdateAdministrative, field, total]);

  return <span>{convertToMoney(total.toNumber())}</span>;
}

interface ResponsibleHonorariumTableProps {
  control: Control<HonorariumsSchemaType>;
  totalHonorariums: Decimal;
}

export default function ResponsibleHonorariumTable({
  control,
  totalHonorariums,
}: ResponsibleHonorariumTableProps) {
  const { fields } = useFieldArray({
    control,
    name: "responsiblesHonorariums",
  });

  return (
    <Table
      headers={[
        { title: "Nombre" },
        { title: "Función" },
        { title: "Porcentaje" },
        { title: "Monto a pagar" },
        { title: "Detalles" },
      ]}
    >
      {fields.map((field, i) => (
        <Row currentRow={i + 1} key={field.responsible_honorarium_id}>
          <Cell>
            <span className="capitalize">{field.academic_name}</span>
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
                      const value = decimalNumberFormat(e.target.value);
                      const n = new Decimal(!value ? 0 : value);

                      if (n.greaterThan(100)) {
                        return;
                      }

                      onChange(value);
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
              totalHonorariums={totalHonorariums}
              field={field}
            />
          </Cell>

          <Cell className="flex">
            <ActionRowButton
              href={`pagos/honorarios-administrativos/${field.responsible_honorarium_id}`}
            >
              <span className="icon-[ph--receipt] text-xl" />
            </ActionRowButton>
          </Cell>
        </Row>
      ))}
    </Table>
  );
}
