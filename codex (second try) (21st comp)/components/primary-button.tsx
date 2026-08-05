import { forwardRef } from "react";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";

import { cn } from "@/lib/utils";

type PrimaryButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(function PrimaryButton({ className, children, ...props }, ref) {
  return (
    <button className={cn("button button-primary", className)} ref={ref} type="button" {...props}>
      <span>{children}</span>
      <ArrowRightIcon aria-hidden="true" data-icon="inline-end" weight="regular" />
    </button>
  );
});
