interface SidebarItemDescriptionProps {
  children: React.ReactNode;
  isActive: boolean;
}

export default function SidebarItemDescription({
  children,
  isActive,
}: SidebarItemDescriptionProps) {
  return (
    <p
      className={`text-sm font-light ${children ? "block" : "hidden"} ${
        isActive ? "text-gray-300" : "text-gray-500"
      }`}
    >
      {children}
    </p>
  );
}
