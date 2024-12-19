"use client";
import { useRouter } from "next/navigation";

export default function BackButton({
  className,
  children,
}: React.PropsWithChildren<{
  className?: string;
}>) {
  const router = useRouter();
  return (
    <div className={className} onClick={() => router.back()}>
      {children}
    </div>
  );
}
