"use client";

import { Icon as IconifyIcon } from "@iconify/react";

type IconProps = {
  name: string;
  className?: string;
  size?: number;
  "aria-hidden"?: boolean;
};

export function Icon({ name, className, size = 20, ...props }: IconProps) {
  return (
    <IconifyIcon
      icon={`ph:${name}`}
      width={size}
      height={size}
      className={className}
      {...props}
    />
  );
}
