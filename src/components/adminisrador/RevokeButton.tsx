"use client";

import { revokeAccess } from "@/services/adminServices";
import Button from "../common/Button";

export default function RevokeButton({ rut }: { rut: number }) {
  const handleClick = async () => {
    await revokeAccess(rut);
  };

  return (
    <Button className="button" onClick={handleClick}>
      Revocar acceso
    </Button>
  );
}
