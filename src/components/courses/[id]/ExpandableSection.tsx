import Subtitle from "@/components/common/Subtitle";

interface TableDropdownProps {
  isOpen: boolean;
  setIsOpen: () => void;
  children: React.ReactNode;
}

export default function TableDropdown({
  isOpen,
  setIsOpen,
  children,
}: TableDropdownProps) {
  return (
    <>
      <div
        className={`bg-secondary rounded-t flex justify-between items-center px-2 py-1 cursor-pointer transition-[border-radius] ${
          isOpen ? "rounded-t" : "rounded"
        }`}
        onClick={setIsOpen}
      >
        <Subtitle>Nómina académicos FOUCH</Subtitle>
        <span
          className={`icon-[ci--chevron-down] text-white text-xl transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        ></span>
      </div>
      <div
        className={`transition-[height] ease-out duration-200 ${
          isOpen ? "h-full overflow-auto" : "h-0 overflow-hidden"
        }`}
      >
        {children}
      </div>
    </>
  );
}
