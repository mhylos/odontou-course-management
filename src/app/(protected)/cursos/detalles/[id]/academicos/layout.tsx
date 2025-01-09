interface AcademicCourseLayoutProps {
  sideform: React.ReactNode;
  children: React.ReactNode;
}

export default function AcademicCourseLayout({
  children,
  sideform,
}: AcademicCourseLayoutProps) {
  return (
    <>
      {sideform}
      {children}
    </>
  );
}
