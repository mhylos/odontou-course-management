"use client";

import { revokeAccess } from "@/services/adminServices";
import Button from "../common/Button";
import { toast } from "react-toastify";

export default function RevokeButton({ rut }: { rut: number }) {
  const handleClick = async () => {
    const response = await revokeAccess(rut);
    toast(response.message, { type: response.success ? "success" : "error" });
  };

  return (
    <Button className="button w-max" onClick={handleClick}>
      Revocar acceso
    </Button>
  );
}
