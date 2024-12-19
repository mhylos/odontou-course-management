import Input from "@/components/common/Input";
import Dropdown from "@/components/common/Dropdown";
import Section from "@/components/courses/[id]/Section";
import SectionItem from "@/components/courses/[id]/SectionItem";
import { Enroll } from "@/lib/definitions";
import { Controller, UseFormReturn } from "react-hook-form";
import { enrollSchemaType } from "@/lib/zod";
import FetchDropdown from "@/components/common/FetchDropdown";

const enrolledOptions = [
  { value: 0, name: "No matriculado" },
  { value: 1, name: "Matriculado" },
];

export interface EnrollFormProps {
  disabled?: boolean;
  enrollDetails?: Enroll;
  enrollValue: number;
  form: UseFormReturn<enrollSchemaType>;
}

export default function EnrollForm({
  disabled = false,
  enrollValue,
  form,
}: EnrollFormProps) {
  return (
    <Section title="Matricula">
      <div className="w-full grid grid-cols-2 gap-2">
        <SectionItem title="Estado">
          <Controller
            render={({ field: { onChange, value } }) => (
              <Dropdown
                label={""}
                options={enrolledOptions}
                disabled={disabled}
                selected={enrolledOptions.find(
                  (option) => option.value === Number(value)
                )}
                onChange={(option) => onChange(!!Number(option.value))}
              />
            )}
            name="status"
            control={form.control}
          />
        </SectionItem>
        <SectionItem title="N° Boleta">
          <Controller
            render={({ field: { onChange, value } }) => (
              <Input
                value={value ?? ""}
                disabled={disabled}
                onChange={(e) => onChange(parseInt(e.currentTarget.value))}
                type="number"
                className="[&::-webkit-inner-spin-button]:appearance-none"
              />
            )}
            name="ticket_num"
            control={form.control}
          />
        </SectionItem>
      </div>
      <div className="w-full grid grid-cols-3 gap-2">
        <SectionItem title="Fecha de pago">
          <Input
            disabled={disabled}
            type="date"
            {...form.register("payment_date")}
          />
        </SectionItem>
        <SectionItem title="Descuento">
          <div className="grid grid-cols-2 place-items-center gap-2">
            <Controller
              render={({ field: { onChange, value } }) => (
                <Input
                  value={value ?? 0}
                  min={0}
                  max={100}
                  type="number"
                  disabled={disabled}
                  onChange={(value) => {
                    let n = parseInt(value.currentTarget.value);
                    if (n > 100 || n < 0) {
                      return;
                    }
                    if (isNaN(n)) {
                      n = 0;
                    }
                    form.setValue(
                      "total",
                      enrollValue - (n / 100) * enrollValue
                    );
                    onChange(parseInt(value.currentTarget.value));
                  }}
                />
              )}
              name="discount"
              control={form.control}
            />
            <span className="text-xl place-self-start self-center">%</span>
          </div>
        </SectionItem>
        <SectionItem title="Total">
          <Controller
            render={({ field: { value, onChange } }) => (
              <Input
                value={value ?? enrollValue}
                disabled={true}
                type="number"
                onChange={onChange}
                className="[&::-webkit-inner-spin-button]:appearance-none"
              />
            )}
            name="total"
            control={form.control}
          />
        </SectionItem>
      </div>
      <div className="w-full grid grid-cols-2 gap-2">
        <SectionItem title="Método de pago">
          <FetchDropdown
            name="payment_type_fk"
            label="Tipo"
            control={form.control}
            fetchUrl="/api/courses/payment-types/options"
            disabled={disabled}
            clearable
          />
        </SectionItem>
        <SectionItem title="Observación">
          <Controller
            render={({ field: { onChange, value } }) => (
              <Input
                value={value ?? ""}
                disabled={disabled}
                onChange={onChange}
              />
            )}
            name="observation"
            control={form.control}
          />
        </SectionItem>
      </div>
    </Section>
  );
}
