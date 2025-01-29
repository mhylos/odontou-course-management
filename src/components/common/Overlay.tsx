import BackButton from "./BackButton";

export default function Overlay({ backHref }: { backHref: string }) {
  return (
    <BackButton
      href={backHref}
      className="absolute right-0 top-0 h-screen w-screen bg-black/15 z-30 cursor-default"
    ></BackButton>
  );
}
