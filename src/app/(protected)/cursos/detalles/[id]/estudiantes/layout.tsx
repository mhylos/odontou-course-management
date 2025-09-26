interface StudentCourseLayoutProps {
  sideform: React.ReactNode;
  children: React.ReactNode;
}

export default function AcademicCourseLayout({
  children,
  sideform,
}: StudentCourseLayoutProps) {
  return (
    <>
      {sideform}
      {children}
    </>
  );
}
