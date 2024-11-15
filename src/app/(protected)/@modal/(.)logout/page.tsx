"use client";

import { useEffect } from "react";
import { logoutAction } from "@/app/actions/auth-actions";

export default function Logout() {
  // const handleLogout = async () => {
  //   try {
  //     await logoutAction();
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  // useEffect(() => {
  //   setTimeout(() => {
  //     handleLogout();
  //   }, 1000);
  // }, []);

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
