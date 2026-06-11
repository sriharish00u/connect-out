import type { CSSProperties, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  name: string;
  filled?: boolean;
  size?: number;
}

export function Icon({ name, filled, size, className, style, ...rest }: IconProps) {
  const merged: CSSProperties = {
    fontSize: size ? `${size}px` : undefined,
    ...(filled ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" } : {}),
    ...style,
  };
  return (
    <span
      aria-hidden="true"
      className={cn("material-symbols-outlined leading-none", className)}
      style={merged}
      {...rest}
    >
      {name}
    </span>
  );
}
