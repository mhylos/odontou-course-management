"use client";

import { useRouter } from "next/navigation";

interface ModalHeaderProps {
  children: React.ReactNode;
  prevPath: string;
}

export default function ModalHeader({ children, prevPath }: ModalHeaderProps) {
  const router = useRouter();

  const navigateBack = () => {
    if (window.history.length <= 1) {
      router.push(prevPath);
    } else {
      router.back();
    }
  };

  return (
    <div className="w-full bg-primary flex justify-between text-white rounded p-2">
      {children}
      <button
        className="icon-[material-symbols--close-rounded] text-2xl"
        onClick={navigateBack}
      />
    </div>
  );
}
