"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "icon";
};

export function Button({ className, variant = "primary", size = "md", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-accent px-4 text-sm text-black hover:scale-[1.04] hover:bg-[#3be477]",
        variant === "secondary" && "bg-white/[0.08] px-4 text-sm text-white hover:bg-white/[0.16]",
        variant === "ghost" && "px-3 text-sm text-white/[0.72] hover:bg-white/[0.10] hover:text-white",
        variant === "outline" && "border border-white/10 bg-transparent px-4 text-sm text-foreground hover:bg-white/[0.08]",
        size === "sm" && "h-8 px-3 text-xs",
        size === "md" && "h-10",
        size === "icon" && "h-10 w-10 rounded-full",
        className
      )}
      {...props}
    />
  );
}
