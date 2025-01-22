import Link from "next/link";

export default function Overlay({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="absolute right-0 top-0 h-screen w-screen bg-black/15 z-30 cursor-default"
    />
  );
}
