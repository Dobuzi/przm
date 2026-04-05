import type { PropsWithChildren } from "react";
import { cn } from "@/shared/lib/cn";

interface CardProps extends PropsWithChildren {
  className?: string;
}

export function Card({ className, children }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/70 bg-white/90 p-5 shadow-panel backdrop-blur",
        className,
      )}
    >
      {children}
    </div>
  );
}

