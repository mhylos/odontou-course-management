interface LayoutProps {
  children: React.ReactNode;
  sideform: React.ReactNode;
}

export default function Layout({ children, sideform }: LayoutProps) {
  return (
    <>
      {sideform}
      {children}
    </>
  );
}
