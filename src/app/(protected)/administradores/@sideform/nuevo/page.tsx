import RightSidebar from "@/components/common/RightSidebar";
import Overlay from "@/components/common/Overlay";
import AdministratorForm from "@/components/forms/AdministratorForm";

export default async function NewAdmin({}) {
  return (
    <>
      <Overlay backHref="/administradores" />
      <RightSidebar title="Nuevo administrador" backHref="/administradores">
        <AdministratorForm />
      </RightSidebar>
    </>
  );
}
