interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function ContentLayoutProps({ children }: ContentLayoutProps) {
  return <main className="p-5 grid grid-rows-[10rem_1fr]">{children}</main>;
}
