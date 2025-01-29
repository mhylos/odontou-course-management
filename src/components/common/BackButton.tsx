"use client";
import { useRouter } from "next/navigation";

export default function BackButton({
  className,
  children,
  href,
}: React.PropsWithChildren<{
  className?: string;
  href: string;
}>) {
  const router = useRouter();
  const navigateBack = () => {
    if (window.history.length <= 1) {
      router.push(href);
    } else {
      router.back();
    }
  };
  return (
    <div className={className} onClick={navigateBack}>
      {children}
    </div>
  );
}
