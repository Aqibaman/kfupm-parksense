import Image from "next/image";
import Link from "next/link";

export function BrandLogo({ compact = false, dark = false }: { compact?: boolean; dark?: boolean }) {
  return (
      <Link href="/" className="inline-flex items-center gap-3">
      <Image
        src="/kfupm-logo.png"
        alt="KFUPM logo"
        width={compact ? 140 : 220}
        height={compact ? 44 : 70}
        className={`h-auto w-auto object-contain ${dark ? "brightness-[1.06] contrast-[1.02]" : ""}`}
        priority
      />
    </Link>
  );
}
