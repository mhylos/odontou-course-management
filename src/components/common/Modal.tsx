interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

export default function Modal({ children }: ModalProps) {
  return (
    <div className="absolute left-0 top-0 w-screen h-screen z-50">
      <div className="bg-black/15 w-full h-full grid place-items-center">
        <div className="bg-white p-8 flex gap-3 items-center rounded-md">
          <div className="bg-primary"></div>
          <span className="icon-[line-md--close] text-2xl"></span>
        </div>
      </div>
    </div>
  );
}
