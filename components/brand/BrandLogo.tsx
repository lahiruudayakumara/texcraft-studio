import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
  size?: "nav" | "hub" | "hero" | "splash";
};

const sizeClasses = {
  nav: "w-[86px] sm:w-[96px]",
  hub: "w-[104px] sm:w-[118px]",
  hero: "w-[180px] sm:w-[220px] lg:w-[252px]",
  splash: "w-[220px] sm:w-[260px] lg:w-[312px]",
};

export function BrandLogo({
  className = "",
  priority = false,
  size = "nav",
}: BrandLogoProps) {
  return (
    <div className={`${sizeClasses[size]} ${className}`.trim()}>
      <Image
        src="/texcraft-logo-cropped.png"
        alt="TexCraft Studio"
        width={760}
        height={600}
        priority={priority}
        className="h-auto w-full object-contain"
      />
    </div>
  );
}
