import Button from "@/components/common/Button";
import Table from "@/components/common/Table/Table";
import Section from "@/components/courses/[id]/Section";
import { convertToMoney } from "@/lib/utils";

const expenses = [
  {
    concept: "Lápiz",
    unit_value: 500,
    quantity: 4,
  },
  {
    concept: "Bolsa",
    unit_value: 500,
    quantity: 4,
  },
  {
    concept: "Libreta",
    unit_value: 1700,
    quantity: 4,
  },
  {
    concept: "Diploma",
    unit_value: 500,
    quantity: 4,
  },
];

export default function CourseExpenses() {
  const EditBtn = () => <Button buttonActionType="edit" className="w-max" />;

  const removeBtn = () => (
    <Button buttonActionType="delete" className="w-max" />
  );

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
              expenses.reduce(
                (acc, item) => acc + item.unit_value * item.quantity,
                0
              )
            )}
          </span>
        </Section>
        <Button buttonActionType="add">Agregar</Button>
      </div>
    </div>
  );
}
