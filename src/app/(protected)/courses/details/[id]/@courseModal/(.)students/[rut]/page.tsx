"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal/Modal";
import ModalHeader from "@/components/common/Modal/ModalHeader";
import Section from "@/components/courses/[id]/Section";
import SectionItem from "@/components/courses/[id]/SectionItem";
import { useRouter } from "next/navigation";

export default function StudentDetails() {
  const router = useRouter();

  return (
    <Modal onClose={() => router.back()}>
      <ModalHeader onClose={() => router.back()}>
        <div>
          <span className="">Estudiante</span>
          <h3 className="text-4xl">Nombre</h3>
          <span>Curso</span>
        </div>
      </ModalHeader>
      <div className="w-full h-full grid grid-cols-2 gap-2">
        <Section title="Datos personales">
          <SectionItem title="RUT o Pasaporte">11.111.111-1</SectionItem>
          <SectionItem title="Email">Email</SectionItem>
          <SectionItem title="Género">Telefono</SectionItem>
        </Section>
        <Section title="Matricula">
          <div className="w-full grid grid-cols-2">
            <SectionItem title="Estado">Matriculado</SectionItem>
            <SectionItem title="N° Boleta">111111</SectionItem>
          </div>
          <div className="w-full grid grid-cols-3">
            <SectionItem title="Fecha de pago">11/11/2021</SectionItem>
            <SectionItem title="Descuento">10%</SectionItem>
            <SectionItem title="Total">$ 100.000</SectionItem>
          </div>
          <div className="w-full grid grid-cols-2">
            <SectionItem title="Método de pago">WEBPAY</SectionItem>
            <SectionItem title="Observación">-</SectionItem>
          </div>
        </Section>
      </div>
      <div className="w-full flex justify-end">
        <Button className="max-w-max">Guardar</Button>
      </div>
    </Modal>
  );
}
