import Button from "@/components/common/Button";
import Table from "@/components/common/Table/Table";
import Section from "@/components/courses/[id]/Section";
import { convertToMoney } from "@/lib/utils";

const incomes = [
  {
    type: "Arancel",
    value: 1045000,
    comment: "-",
  },
  {
    type: "Otros ingresos afectos a IVA",
    value: 0,
    comment: "-",
  },
];

export default function CourseIncomes() {
  const EditBtn = () => <Button buttonActionType="edit" />;

  const removeBtn = () => <Button buttonActionType="delete" />;

  const Actions = () => (
    <div className="flex gap-2">
      {EditBtn()}
      {removeBtn()}
    </div>
  );

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      <Table
        headers={["Tipo", "Valor", "Comentario", "Acciones"]}
        className="flex-1"
        rows={incomes.map(({ type, value, comment }) => [
          type,
          convertToMoney(value),
          comment,
          Actions(),
        ])}
      />
      <div className="grid gap-2 grid-cols-[10fr_1fr]">
        <Section title="Total">
          <span className="text-4xl font-light">
            {convertToMoney(incomes.reduce((acc, { value }) => acc + value, 0))}
          </span>
        </Section>
        <Button>Agregar</Button>
      </div>
    </div>
  );
}
