"use client";

import { useRouter } from "next/navigation";

interface ModalHeaderProps {
  children: React.ReactNode;
  prevPath: string;
}

export default function ModalHeader({ children, prevPath }: ModalHeaderProps) {
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
    <div className="w-full bg-primary flex justify-between text-white rounded p-2">
      {children}
      <button
        className="icon-[material-symbols--close-rounded] text-2xl"
        onClick={handleBack}
      />
    </div>
  );
}
