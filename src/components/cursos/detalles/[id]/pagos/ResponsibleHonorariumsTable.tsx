import Input from "@/components/common/Input";
import Table, { Row, Cell } from "@/components/common/Table/Table";
import { HONORARIUMS_FUNCTIONS_DICTIONARY } from "@/lib/constants";
import { convertToMoney } from "@/lib/utils";
import { HonorariumsSchemaType } from "@/lib/zod";
import Decimal from "decimal.js";
import { Control, Controller, useFieldArray, useWatch } from "react-hook-form";

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

interface ResponsibleHonorariumTableProps {
  control: Control<HonorariumsSchemaType>;
  totalToDistribute: Decimal;
}

export default function ResponsibleHonorariumTable({
  control,
  totalToDistribute,
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
                      let value = e.currentTarget.value.replace(/[^0-9.]/g, "");
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
  );
}
