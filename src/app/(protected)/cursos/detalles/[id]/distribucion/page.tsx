import DistributionTable from "@/components/cursos/detalles/[id]/distribucion/DistributionTable";
import Section from "@/components/cursos/detalles/[id]/Section";
import { convertToMoney } from "@/lib/utils";
import { getDistributions } from "@/services/distributionServices";
import { getTotalExpenses } from "@/services/expensesServices";
import { getTotalIncomes } from "@/services/incomesServices";
import Decimal from "decimal.js";

export default async function CourseDistribution({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const distributions = await getDistributions(parseInt(id));
  const totalIncomes = new Decimal(await getTotalIncomes(parseInt(id)));
  const totalExpenses = await getTotalExpenses(parseInt(id));
  const total = totalIncomes.minus(totalExpenses);
  return (
    <div className="flex flex-col gap-2 w-full h-full">
      <div className="flex w-full gap-2">
        <Section title="Ingresos">
          <span className="text-2xl font-light">
            {convertToMoney(totalIncomes.toNumber())}
          </span>
        </Section>
        <Section title="Gastos">
          <span className="text-2xl font-light">
            {convertToMoney(parseInt(totalExpenses))}
          </span>
        </Section>
        <Section title="Total">
          <span className="text-2xl font-light">
            {convertToMoney(total.toNumber())}
          </span>
        </Section>
      </div>
      <DistributionTable values={distributions} total={total} />
    </div>
  );
}
