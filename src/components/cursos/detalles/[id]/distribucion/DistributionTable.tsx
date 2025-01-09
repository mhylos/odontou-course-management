"use client";

import Table, { Cell, Row } from "@/components/common/Table/Table";
import { convertToMoney } from "@/lib/utils";
import { distributionSchemaType, distributionsSchemaType } from "@/lib/zod";
import Decimal from "decimal.js";
import { Control, useFieldArray, useForm, useWatch } from "react-hook-form";

interface DistributionTableProps {
  values?: distributionSchemaType[];
  total: Decimal;
}

function RowAmount({
  control,
  index,
  total,
}: {
  control: Control<distributionsSchemaType>;
  index: number;
  total: Decimal;
}) {
  const { distributions } = useWatch({ control });
  if (!distributions) return null;

  const amount = new Decimal(distributions[index].percentage ?? 0)
    .div(100)
    .times(total)
    .trunc();

  return <span>{convertToMoney(amount.toNumber())}</span>;
}

function TotalPercentage({
  control,
}: {
  control: Control<distributionsSchemaType>;
}) {
  const { distributions } = useWatch({ control });
  if (!distributions) return null;

  const total = distributions.reduce((acc, distribution) => {
    const value = new Decimal(distribution.percentage ?? 0);

    return acc.plus(value);
  }, new Decimal(0));

  return <span className="text-4xl font-light">{total.toNumber()} %</span>;
}

export default function DistributionTable({
  values,
  total,
}: DistributionTableProps) {
  const { control } = useForm<distributionsSchemaType>({
    defaultValues: {
      distributions: values,
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "distributions",
  });

  // const onSubmit = (data: distributionsSchemaType) => {};

  return (
    <form
      className="flex-1 overflow-auto"
      id="distribution-form"
      // onSubmit={handleSubmit(onSubmit)}
    >
      <Table
        headers={[
          { title: "Nombre", width: "20%" },
          { title: "Porcentaje", width: "5%" },
          { title: "Monto", width: "5%" },
        ]}
      >
        {fields.map(({ name, percentage }, i) => {
          return (
            <Row currentRow={i + 1} key={name + i}>
              <Cell>
                {/* <Input {...register(`distributions.${i}.name`)} /> */}
                {name}
              </Cell>
              <Cell>
                {/* <Input {...register(`distributions.${i}.percentage`)} /> */}
                <span>{percentage} %</span>
              </Cell>
              <Cell>
                <RowAmount control={control} index={i} total={total} />
              </Cell>
            </Row>
          );
        })}
        <Row>
          <Cell>
            <span className="grid text-2xl place-content-end">Total</span>
          </Cell>
          <Cell>
            <TotalPercentage control={control} />
          </Cell>
          <Cell></Cell>
        </Row>
      </Table>
    </form>
  );
}
