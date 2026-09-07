import Image from "next/image";
import Link from "next/link";

export default function Logo({ settings, variant = "dark", className = "" }) {
  const isLight = variant === "light";
  const companyName = settings?.company_name || "Perfect Industrial Solution";
  const usingDefaultLogo = !settings?.logo_url;

  return (
    <Link href="/" className={`flex shrink-0 items-center ${className}`}>
      <Image
        src={settings?.logo_url || "/logo.png"}
        alt={companyName}
        width={2169}
        height={725}
        priority
        className={`h-9 w-auto object-contain md:h-11 ${
          isLight && usingDefaultLogo ? "brightness-0 invert" : ""
        }`}
      />
    </Link>
  );
}

export function LogoMark({ size = 44 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="23" fill="var(--color-dark)" />
      <circle cx="24" cy="24" r="23" stroke="var(--color-primary)" strokeWidth="2" />
      <text
        x="24"
        y="30"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="800"
        fontSize="16"
        fill="white"
      >
        P<tspan fill="var(--color-primary)">I</tspan>S
      </text>
    </svg>
  );
}
