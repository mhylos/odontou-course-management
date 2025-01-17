import Modal from "@/components/common/Modal/Modal";
import ModalHeader from "@/components/common/Modal/ModalHeader";

interface HonorariumPageProps {
  params: Promise<{ id: string; honorarium: string }>;
}

export default async function HonorariumPage({ params }: HonorariumPageProps) {
  const { id, honorarium } = await params;

  return (
    <Modal prevPath={`/cursos/detalles/${id}/pagos`}>
      <ModalHeader prevPath={`/cursos/detalles/${id}/pagos`}>a</ModalHeader>
      <h1>Honorarios {honorarium}</h1>
    </Modal>
  );
}
