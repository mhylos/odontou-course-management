import Modal from "@/components/common/Modal/Modal";
import ModalHeader from "@/components/common/Modal/ModalHeader";
import NewPasswordForm from "@/components/forms/NewPasswordForm";
export default function ChangePasswordPage() {
  return (
    <Modal prevPath={""} className="">
      <ModalHeader prevPath={""}>
        <h2 className="text-3xl me-4">Cambiar contraseña</h2>
      </ModalHeader>
      <NewPasswordForm className="w-full" />
    </Modal>
  );
}
