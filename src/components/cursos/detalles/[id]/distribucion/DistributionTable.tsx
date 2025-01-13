import Table, { Cell, Row } from "@/components/common/Table/Table";
import { convertToMoney } from "@/lib/utils";
import { DistributionSchemaType, DistributionsSchemaType } from "@/lib/zod";
import Decimal from "decimal.js";
import { Control, useFieldArray, useForm, useWatch } from "react-hook-form";

interface DistributionTableProps {
  values: DistributionSchemaType[];
  total: Decimal;
}

function RowAmount({
  total,
  percentage,
}: {
  total: Decimal;
  percentage: string;
}) {
  const amount = Decimal.div(percentage, 100).times(total).trunc();

  return <span>{convertToMoney(amount.toNumber())}</span>;
}

export default function DistributionTable({
  values,
  total,
}: DistributionTableProps) {
  let totalPercentage = new Decimal(0);

  return (
    <Table
      headers={[
        { title: "Nombre", width: "20%" },
        { title: "Porcentaje", width: "5%" },
        { title: "Monto", width: "5%" },
      ]}
    >
      {values.map(({ name, percentage }, i) => {
        totalPercentage = totalPercentage.plus(percentage);

        return (
          <Row currentRow={i + 1} key={name + i}>
            <Cell>{name}</Cell>
            <Cell>
              <span>{percentage} %</span>
            </Cell>
            <Cell>
              <RowAmount total={total} percentage={percentage} />
            </Cell>
          </Row>
        );
      })}
      <Row>
        <Cell>
          <span className="grid text-2xl place-content-end">Total</span>
        </Cell>
        <Cell>
          <span className="text-4xl font-light">
            {totalPercentage.toNumber()} %
          </span>
        </Cell>
        <Cell></Cell>
      </Row>
    </Table>
  );
}
