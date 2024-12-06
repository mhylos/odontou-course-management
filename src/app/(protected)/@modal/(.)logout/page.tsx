"use client";

import { useEffect } from "react";
import { logoutAction } from "@/app/actions/auth-actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      const response = await logoutAction();
      toast(response.message, { type: response.success ? "success" : "error" });
      if (response.success) {
        router.push("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      handleLogout();
    }, 1000);
  }, []);

  return (
    <div className="absolute left-0 top-0 w-screen h-screen z-50">
      <div className="bg-black/15 w-full h-full grid place-items-center">
        <div className="bg-white p-8 flex gap-3 items-center rounded-md">
          <span className="icon-[svg-spinners--180-ring] text-primary w-5 aspect-square"></span>
          <span>Cerrando sesión</span>
        </div>
      </div>
    </div>
  );
}
