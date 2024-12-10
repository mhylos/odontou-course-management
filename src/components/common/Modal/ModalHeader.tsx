interface ModalHeaderProps {
  children: React.ReactNode;
  onClose: () => void;
}

export default function ModalHeader({ children, onClose }: ModalHeaderProps) {
  return (
    <div className="w-full bg-primary flex justify-between text-white rounded p-2">
      {children}
      <button className="icon-[line-md--close] text-2xl" onClick={onClose} />
    </div>
  );
}
