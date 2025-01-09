"use client";
import { useRouter } from "next/navigation";

interface ModalProps {
  children: React.ReactNode;
  prevPath: string;
}

export default function Modal({ children, prevPath }: ModalProps) {
  const { length } = window.history;
  const { back, replace } = useRouter();
  const handleBack = () => {
    if (length > 1) {
      back();
    } else {
      replace(prevPath);
    }
  };
  return (
    <div className="absolute left-0 top-0 w-screen h-screen z-50 grid place-items-center">
      <div
        className="absolute bg-black/15 w-full h-full grid place-items-center -z-10"
        onClick={handleBack}
      />
      <div className="bg-white p-2 gap-3 items-center rounded-md mx-5 xl:w-4/6 h-max flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
}
