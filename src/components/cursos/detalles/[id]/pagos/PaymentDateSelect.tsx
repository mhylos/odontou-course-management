"use client";

import Dropdown, { Option } from "@/components/common/Dropdown";
import { useRouter } from "next/navigation";

interface PaymentDateSelectProps {
  paymentsOptions: Option[];
  baseUrl: string;
}

export default function PaymentDateSelect({
  paymentsOptions,
  baseUrl,
}: PaymentDateSelectProps) {
  const router = useRouter();
  return (
    <Dropdown
      className="w-full"
      options={paymentsOptions}
      id="payment-select"
      onChange={(selected) =>
        router.push(`${baseUrl}/${selected.value.toString()}`)
      }
      create={() => router.push(`${baseUrl}/nuevo`)}
      label="Fecha de pago"
    />
  );
}
