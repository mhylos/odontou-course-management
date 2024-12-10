interface LayoutProps {
  children: React.ReactNode;
  sideForm: React.ReactNode;
}

export default function Layout({ children, sideForm }: LayoutProps) {
  return (
    <>
      {sideForm}
      {children}
    </>
  );
}
