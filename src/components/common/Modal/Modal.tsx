interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
  return (
    <div className="absolute left-0 top-0 w-screen h-screen z-50 grid place-items-center">
      <div
        className="absolute bg-black/15 w-full h-full grid place-items-center -z-10"
        onClick={onClose}
      />
      <div className="bg-white p-2 gap-3 items-center rounded-md w-1/2 h-max flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
}
