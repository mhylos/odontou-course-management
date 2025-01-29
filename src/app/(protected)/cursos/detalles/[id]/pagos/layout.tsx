import { HonorariumAmountProvider } from "@/context/HonorariumProvider";

interface HonorariumsLayoutProps {
  modal: React.ReactNode;
  children: React.ReactNode;
}

export default function HonorariumLayout({
  children,
  modal,
}: HonorariumsLayoutProps) {
  return (
    <HonorariumAmountProvider>
      {modal}
      {children}
    </HonorariumAmountProvider>
  );
}
