import { Icon } from "@/components/ui/icon";

export function FeatureIcon({ name, size = 28 }: { name: string; size?: number }) {
  return (
    <span className="feature-icon" aria-hidden="true">
      <Icon name={name} size={size} aria-hidden />
      <span className="accent" />
    </span>
  );
}
