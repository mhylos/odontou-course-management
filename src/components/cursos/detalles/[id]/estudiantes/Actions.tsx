"use client";

import Loading from "@/components/common/LoadingSpinner";
import DeleteRowButton from "@/components/common/Table/DeleteRowButton";
import EditRowButton from "@/components/common/Table/EditRowButton";
import { removeEnrollByRut } from "@/services/studentServices";
import { useState } from "react";
import { toast } from "react-toastify";

interface ActionsProps {
  rut: number;
  courseId: number;
}

export default function Actions({ rut, courseId }: ActionsProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return <Loading />;
  }

  const handleRemove = async () => {
    setIsLoading(true);
    const response = await removeEnrollByRut(rut, courseId);
    if (response) {
      toast.success("Removido con éxito");
    } else {
      toast.error("Error al remover");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex gap-2">
      <EditRowButton href={`estudiantes/${rut}/editar`} />
      <DeleteRowButton onClick={handleRemove} />
    </div>
  );
}
