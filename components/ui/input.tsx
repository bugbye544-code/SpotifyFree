"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-full border border-white/10 bg-white/[0.06] px-4 text-sm text-foreground outline-none transition placeholder:text-white/[0.4] focus:border-accent/60 focus:bg-white/[0.08]",
        className
      )}
      {...props}
    />
  );
}
