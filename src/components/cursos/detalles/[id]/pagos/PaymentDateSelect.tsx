"use client";

import Dropdown, { Option } from "@/components/common/Dropdown";
import { useRouter } from "next/navigation";

interface PaymentDateSelectProps {
  paymentsOptions: Option[];
  honorariumId: string;
}

export default function PaymentDateSelect({
  paymentsOptions,
  honorariumId,
}: PaymentDateSelectProps) {
  const router = useRouter();
  return (
    <Dropdown
      className="w-full"
      options={paymentsOptions}
      id="payment-select"
      onChange={(selected) =>
        router.push(`${honorariumId}/${selected.value.toString()}`)
      }
      selected={paymentsOptions[0]}
      label="Fecha de pago"
    />
  );
}
