"use client";

import LoadingSpinner from "@/components/common/LoadingSpinner";
import DeleteRowButton from "@/components/common/Table/DeleteRowButton";
import EditRowButton from "@/components/common/Table/EditRowButton";
import { removeParticipation } from "@/services/academicsServices";
import { useState } from "react";
import { toast } from "react-toastify";

interface ActionsProps {
  rut: number;
  courseId: number;
}

export default function Actions({ rut, courseId }: ActionsProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const handleRemove = async () => {
    setIsLoading(true);
    const response = await removeParticipation(rut, courseId);
    if (response) {
      toast.success("Removido con éxito");
    } else {
      toast.error("Error al remover");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex gap-2">
      <EditRowButton href={`/cursos/detalles/${courseId}/academicos/${rut}`} />
      <DeleteRowButton onClick={handleRemove} />
    </div>
  );
}
