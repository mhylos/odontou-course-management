interface StudentCourseLayoutProps {
  modal: React.ReactNode;
  children: React.ReactNode;
}

export default function AcademicCourseLayout({
  children,
  modal,
}: StudentCourseLayoutProps) {
  return (
    <>
      {modal}
      {children}
    </>
  );
}
