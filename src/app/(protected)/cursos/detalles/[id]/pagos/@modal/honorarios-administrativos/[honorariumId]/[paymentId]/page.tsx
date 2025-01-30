import PaymentForm from "@/components/forms/PaymentForm";
import { PaymentSchemaType } from "@/lib/zod";
import { getResponsiblePayment } from "@/services/paymentServices";
import { addMonths } from "date-fns";

interface PaymentPageProps {
  params: Promise<{ paymentId: string; honorariumId: string }>;
}

export default async function PaymentPage({ params }: PaymentPageProps) {
  const { paymentId, honorariumId } = await params;
  let payment: PaymentSchemaType;
  if (paymentId === "nuevo") {
    payment = {
      honorarium_id: parseInt(honorariumId),
      payment_date: new Date(),
      next_payment_date: addMonths(new Date(), 1),
      amount: 0,
      observation: "",
      paid: false,
    };
  } else {
    const fetchedPayment = await getResponsiblePayment(parseInt(paymentId));
    payment = fetchedPayment
      ? { ...fetchedPayment, honorarium_id: parseInt(honorariumId) }
      : {
          honorarium_id: parseInt(honorariumId),
          payment_date: new Date(),
          next_payment_date: addMonths(new Date(), 1),
          amount: 0,
          observation: "",
          paid: false,
        };
  }

  return <PaymentForm payment={payment} type="responsible" />;
}
