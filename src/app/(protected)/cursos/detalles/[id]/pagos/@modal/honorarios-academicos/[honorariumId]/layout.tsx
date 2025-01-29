import Modal from "@/components/common/Modal/Modal";
import ModalHeader from "@/components/common/Modal/ModalHeader";
import { getAcademicHonorariumPayments } from "@/services/paymentServices";
import { Option } from "@/components/common/Dropdown";
import { format } from "date-fns";
import PaymentDateSelect from "@/components/cursos/detalles/[id]/pagos/PaymentDateSelect";

interface HonorariumLayoutProps {
  params: Promise<{ id: string; honorariumId: string }>;
  children: React.ReactNode;
}

export default async function HonorariumLayout({
  params,
  children,
}: HonorariumLayoutProps) {
  const { id, honorariumId } = await params;
  const academicPayments = await getAcademicHonorariumPayments(
    parseInt(honorariumId)
  );

  let paymentsOptions: Option[] | undefined = academicPayments?.map(
    (payment) => ({
      name: format(payment.payment_date, "PPP"),
      value: payment.id,
    })
  );

  if (paymentsOptions?.length === 0 || !paymentsOptions) {
    paymentsOptions = [
      {
        name: `Nuevo: ${format(new Date(), "PPP")}`,
        value: "nuevo",
      },
    ];
  }

  return (
    <Modal prevPath={`/cursos/detalles/${id}/pagos`}>
      <ModalHeader prevPath={`/cursos/detalles/${id}/pagos`}>
        <h2 className="text-4xl">Honorarios de académico</h2>
      </ModalHeader>
      <PaymentDateSelect
        paymentsOptions={paymentsOptions}
        honorariumId={honorariumId}
      />
      {children}
    </Modal>
  );
}
