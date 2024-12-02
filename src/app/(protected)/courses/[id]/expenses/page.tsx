import Button from "@/components/common/Button";
import Table from "@/components/common/Table/Table";
import Section from "@/components/courses/[id]/Section";
import { convertToMoney } from "@/lib/utils";

const expenses = [
  {
    concept: "Arancel",
    unit_value: 1045000,
    quantity: 1,
    value: 1045000,
  },
];

export default function CourseExpenses() {
  const EditBtn = () => <Button buttonType="edit" />;

  const removeBtn = () => <Button buttonType="delete" />;

  const Actions = () => (
    <div className="flex gap-2">
      {EditBtn()}
      {removeBtn()}
    </div>
  );

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      <Table
        headers={["Tipo", "Valor", "Cantidad", "Acciones"]}
        className="flex-1"
        rows={expenses.map((item) => [
          item.concept,
          convertToMoney(item.unit_value),
          item.quantity,
          Actions(),
        ])}
      />
      <div className="grid gap-2 grid-cols-[10fr_1fr]">
        <Section title="Total">
          <span className="text-4xl font-light">
            {convertToMoney(
              expenses.reduce((acc, { value }) => acc + value, 0)
            )}
          </span>
        </Section>
        <Button buttonType="add">Agregar</Button>
      </div>
    </div>
  );
}
