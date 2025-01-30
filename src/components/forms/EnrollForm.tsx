import Input from "@/components/common/Input";
import Dropdown from "@/components/common/Dropdown";
import Section from "@/components/cursos/detalles/[id]/Section";
import SectionItem from "@/components/cursos/detalles/[id]/SectionItem";
import { Enroll } from "@/lib/definitions";
import { Controller, UseFormReturn } from "react-hook-form";
import { EnrollSchemaType } from "@/lib/zod";
import FetchDropdown from "@/components/common/FetchDropdown";
import {
  capitalize,
  convertToMoney,
  decimalNumberFormat,
  formatDateForInput,
} from "@/lib/utils";
import { EnrollTypes } from "@prisma/client";
import Checkbox from "@/components/common/Checkbox";
import { useEffect, useState } from "react";
import Decimal from "decimal.js";

const enrolledOptions = [
  { value: 0, name: "No matriculado" },
  { value: 1, name: "Matriculado" },
];

const enrollTypes = (
  Object.keys(EnrollTypes) as Array<keyof typeof EnrollTypes>
).map((key) => {
  return { value: key, name: capitalize(EnrollTypes[key]) };
});

export interface EnrollFormProps {
  disabled?: boolean;
  enrollDetails?: Enroll;
  enrollValue: number;
  form: UseFormReturn<EnrollSchemaType>;
}

export default function EnrollForm({
  disabled = false,
  enrollValue,
  form,
}: EnrollFormProps) {
  const [isInstallments, setInstallments] = useState(
    form.getValues("installments") > 1
  );

  useEffect(() => {
    if (!isInstallments) {
      form.setValue("installments", 1);
      if (form.getValues("paid") > 1) form.setValue("paid", 1);
    }
  }, [isInstallments, form]);

  return (
    <Section title="Matricula">
      <div className="w-full grid grid-cols-2 gap-2">
        <SectionItem title="Estado">
          <Controller
            render={({
              field: { onChange, value, name },
              fieldState: { error },
            }) => (
              <Dropdown
                error={error?.message}
                id={name}
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
          <Input
            {...form.register("ticket_num")}
            disabled={disabled}
            type="number"
            error={form.formState.errors.ticket_num?.message}
          />
        </SectionItem>
      </div>
      <div className="w-full grid grid-cols-[2fr_1fr_2fr] gap-2">
        <SectionItem title="Fecha de pago">
          <Controller
            name="payment_date"
            control={form.control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Input
                disabled={disabled}
                type="date"
                error={error?.message}
                value={formatDateForInput(value) ?? ""}
                onChange={(e) => {
                  onChange(new Date(e.target.value));
                }}
              />
            )}
          />
        </SectionItem>
        <SectionItem title="Descuento">
          <div className="grid place-items-center gap-2">
            <div className="relative w-full grid place-items-center col-span-2">
              <Controller
                render={({
                  field: { onChange, value, name },
                  fieldState: { error },
                }) => (
                  <Input
                    id={name}
                    value={value}
                    error={error?.message}
                    disabled={disabled}
                    onChange={(e) => {
                      const value = decimalNumberFormat(e.target.value);
                      const n = new Decimal(!value ? 0 : value);

                      if (n.greaterThan(100)) {
                        return;
                      }

                      form.setValue(
                        "total",
                        enrollValue -
                          n.dividedBy(100).times(enrollValue).floor().toNumber()
                      );
                      onChange(value);
                    }}
                  />
                )}
                name="discount"
                control={form.control}
              />

              <span className="absolute right-2 text-gray-400 select-none col-span-2">
                %
              </span>
            </div>
          </div>
        </SectionItem>
        <SectionItem title="Total">
          <Controller
            render={({
              field: { value, onChange, name },
              fieldState: { error },
            }) => (
              <Input
                error={error?.message}
                id={name}
                value={convertToMoney(value) ?? convertToMoney(enrollValue)}
                disabled={true}
                onChange={onChange}
                className="[&::-webkit-inner-spin-button]:appearance-none"
              />
            )}
            name="total"
            control={form.control}
          />
        </SectionItem>
      </div>
      <div className="w-full grid grid-cols-3 gap-2">
        <SectionItem title="Método de pago" className="col-span-3">
          <FetchDropdown
            name="payment_type_fk"
            control={form.control}
            fetchUrl="/api/courses/payment-types/options"
            disabled={disabled}
            clearable
            error={form.formState.errors.payment_type_fk?.message}
            selectedValue={form.getValues("payment_type_fk")}
          />
        </SectionItem>
        {/* <SectionItem title="Comprobante">
          <Controller
            render={({ field: { onChange }, fieldState: { error } }) => (
              <Input
                type="file"
                accept={FILE_EXTENSIONS.map(
                  (extension) => "." + extension
                ).join(",")}
                onChange={(e) => {
                  onChange(e.target.files?.[0]);
                }}
                disabled={disabled}
                error={error?.message}
              />
            )}
            name="file"
            control={form.control}
          />
        </SectionItem> */}
        <Checkbox
          id="isInstallments"
          label={"Pago en cuotas"}
          disabled={disabled}
          checked={isInstallments}
          onChange={() => {
            setInstallments(!isInstallments);
          }}
        />

        {isInstallments ? (
          <>
            <SectionItem title="N° de cuotas">
              <Controller
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <Input
                    error={error?.message}
                    disabled={disabled}
                    type="number"
                    value={Number(value).toString()}
                    onChange={(e) => {
                      let n = parseInt(e.currentTarget.value);
                      if (isNaN(n)) {
                        n = 0;
                      }
                      onChange(n);
                    }}
                    onBlur={(e) => {
                      if (parseInt(e.currentTarget.value) < 1) {
                        onChange(1);
                      }
                    }}
                  />
                )}
                name="installments"
                control={form.control}
              />
            </SectionItem>
            <SectionItem title="Cuotas pagadas">
              <Controller
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <Input
                    error={error?.message}
                    disabled={disabled}
                    type="number"
                    value={Number(value).toString()}
                    onChange={(e) => {
                      let n = parseInt(e.currentTarget.value);
                      if (isNaN(n)) {
                        n = 0;
                      }
                      if (n > form.getValues("installments")) {
                        n = form.getValues("installments");
                      }
                      onChange(n);
                    }}
                    onBlur={(e) => {
                      let n = parseInt(e.currentTarget.value);
                      if (n < 0 || isNaN(n)) {
                        n = 0;
                      }
                      onChange(n);
                    }}
                  />
                )}
                name="paid"
                control={form.control}
              />
            </SectionItem>
          </>
        ) : (
          <Checkbox
            label={"Pagado"}
            {...form.register("paid")}
            id="paid"
            disabled={disabled}
          />
        )}

        <Checkbox
          label={"Devuelto"}
          {...form.register("refund")}
          id="refund"
          disabled={disabled}
        />
        <SectionItem
          title="Tipo de matrícula"
          className={isInstallments ? "col-span-2" : ""}
        >
          <Controller
            render={({
              field: { onChange, value, name },
              fieldState: { error },
            }) => (
              <Dropdown
                error={error?.message}
                id={name}
                options={enrollTypes}
                disabled={disabled}
                selected={enrollTypes.find((option) => option.value === value)}
                onChange={(option) => onChange(option.value)}
              />
            )}
            name="enroll_type"
            control={form.control}
          />
        </SectionItem>
        <SectionItem
          title="Observación"
          className={isInstallments ? "col-span-3" : "col-span-2"}
        >
          <Input
            {...form.register("observation")}
            disabled={disabled}
            error={form.formState.errors.observation?.message}
          />
        </SectionItem>
      </div>
    </Section>
  );
}
