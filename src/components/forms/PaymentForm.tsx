"use client";

import { PaymentSchemaType } from "@/lib/zod";
import { Controller, useForm } from "react-hook-form";
import Button from "@/components/common/Button";
import FloatingTextarea from "@/components/common/FloatingTextarea";
import FloatingInput from "@/components/common/FloatingInput";
import Checkbox from "@/components/common/Checkbox";
import { formatDateForInput } from "@/lib/utils";
import { useHonorariumAmount } from "@/context/HonorariumProvider";

interface PaymentFormProps {
  payment: Partial<PaymentSchemaType>;
  type: "academic" | "responsible";
}

export default function PaymentForm({ payment, type }: PaymentFormProps) {
  const { honorarium } = useHonorariumAmount();
  console.log(honorarium);

  const { control, register } = useForm<PaymentSchemaType>({
    defaultValues: {
      amount: payment.amount || honorarium?.amount || 0,
      honorarium_id: honorarium?.honorarium_id,
      ...payment,
    },
  });
  return (
    <form
      className="grid grid-cols-2 gap-4 items-center w-full"
      onSubmit={() => {}}
    >
      <Controller
        control={control}
        name="amount"
        render={({ field: { value, onChange } }) => (
          <FloatingInput
            label={"Monto"}
            value={`$ ${value?.toLocaleString("es-CL")}`}
            onChange={(e) => {
              const value = e.target.value;
              const parsedValue = Number(value.replace(/[^0-9]/g, ""));
              if (isNaN(parsedValue)) return;
              onChange(parsedValue);
            }}
          />
        )}
      />

      <Checkbox label={"Pagado"} id="paid" {...register("paid")} />
      <Controller
        control={control}
        name="payment_date"
        render={({ field }) => (
          <FloatingInput
            {...field}
            value={formatDateForInput(field.value)}
            label={"Fecha de pago"}
            type="date"
          />
        )}
      />
      <Controller
        control={control}
        name="next_payment_date"
        render={({ field }) => (
          <FloatingInput
            {...field}
            value={formatDateForInput(field.value)}
            label={"Fecha del proximo pago"}
            type="date"
          />
        )}
      />

      <FloatingTextarea label={"Observaciones"} {...register("observation")} />
      <Button type="submit">Guardar</Button>
    </form>
  );
}
