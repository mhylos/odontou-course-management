import Modal from "@/components/common/Modal/Modal";
import ModalHeader from "@/components/common/Modal/ModalHeader";
import { getAcademicHonorariumPayments } from "@/services/paymentServices";

interface HonorariumPageProps {
  params: Promise<{ id: string; honorarium: string }>;
}

export default async function HonorariumPage({ params }: HonorariumPageProps) {
  const { id, honorarium } = await params;
  await getAcademicHonorariumPayments(parseInt(honorarium));

  return (
    <Modal prevPath={`/cursos/detalles/${id}/pagos`}>
      <ModalHeader prevPath={`/cursos/detalles/${id}/pagos`}>
        Honorarios de administrativo
      </ModalHeader>
    </Modal>
  );
}
