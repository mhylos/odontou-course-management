interface SideformLayoutProps {
  children: React.ReactNode;
}

export default function SideformLayout({ children }: SideformLayoutProps) {
  return (
    <div className="absolute right-0 top-0 h-screen bg-white p-4 z-10 border-secondary border-l-2 overflow-x-hidden overflow-y-auto w-2/6">
      {children}
    </div>
  );
}
