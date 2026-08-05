import Image from "next/image";

type FeatureIconProps = {
  index: number;
};

export function FeatureIcon({ index }: FeatureIconProps) {
  return (
    <span className="feature-icon" aria-hidden="true">
      <Image alt="" height={56} src={`/icons/feature-${String(index).padStart(2, "0")}.webp`} width={56} />
    </span>
  );
}
