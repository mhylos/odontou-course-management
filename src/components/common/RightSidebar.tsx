"use client";

import BackButton from "@/components/common/BackButton";

interface RightSidebarProps {
  children: React.ReactNode;
  title: string;
  backHref: string;
}

export default function RightSidebar({
  children,
  title,
  backHref,
}: RightSidebarProps) {
  return (
    <div className="absolute top-0 h-screen bg-white p-4 z-40 border-secondary border-l-2 overflow-x-hidden overflow-y-auto animate-sideform-slide-in">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-4xl font-light">{title}</h2>
        <BackButton href={backHref}>
          <span className="icon-[material-symbols--close-rounded] text-3xl cursor-pointer" />
        </BackButton>
      </div>
      {children}
    </div>
  );
}
