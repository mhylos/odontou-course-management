import BackButton from "@/components/common/BackButton";
import Link from "next/link";

interface RightSidebarProps {
  children: React.ReactNode;
  backRoute: string;
  title: string;
}

export default function RightSidebar({
  children,
  backRoute,
  title,
}: RightSidebarProps) {
  return (
    <>
      <Link
        href={backRoute}
        className="absolute right-0 top-0 h-screen w-screen bg-black/15 z-30 cursor-default"
      />
      <div className="absolute right-0 top-0 h-screen bg-white p-4 z-40 border-secondary border-l-2 overflow-x-hidden overflow-y-auto w-2/6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-4xl font-light">{title}</h2>
          <BackButton>
            <span className="icon-[material-symbols--close-rounded] text-3xl cursor-pointer" />
          </BackButton>
        </div>
        {children}
      </div>
    </>
  );
}
