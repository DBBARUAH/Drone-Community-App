import React, { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  textColor?: string;
  border?: string;
  boxShadow?: string;
  className?: string;
  children?: React.ReactNode;
  variant?: "primary" | "secondary"; // ✅ Added to differentiate button styles
}

const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = "#ffffff",
      shimmerSize = "0.05em",
      shimmerDuration = "3s",
      borderRadius = "8px",
      background,
      textColor,
      border,
      boxShadow,
      className,
      children,
      variant = "primary", // ✅ Default to primary style
      ...props
    },
    ref
  ) => {
    // ✅ Apply CTA colors based on the variant (Primary/Secondary)
    const buttonStyles =
      variant === "primary"
        ? {
            background: "#FFD700", // Golden yellow
            textColor: "#000", // Black text
            border: "none",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
          }
        : {
            background: "transparent",
            textColor: "#FFD700", // Golden text
            border: "2px solid #FFD700",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          };

    return (
      <button
        style={
          {
            "--spread": "90deg",
            "--shimmer-color": shimmerColor,
            "--radius": borderRadius,
            "--speed": shimmerDuration,
            "--cut": shimmerSize,
            "--bg": background || buttonStyles.background,
            "--text-color": textColor || buttonStyles.textColor,
            "--border": border || buttonStyles.border,
            "--box-shadow": boxShadow || buttonStyles.boxShadow,
          } as CSSProperties
        }
        className={cn(
          "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap px-6 py-3",
          "text-white [background:var(--bg)] [border-radius:var(--radius)] [border:var(--border)] [color:var(--text-color)]",
          "shadow-[var(--box-shadow)] transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px",
          className
        )}
        ref={ref}
        {...props}
      >
        {/* Shimmer Effect */}
        <div
          className={cn(
            "-z-30 blur-[2px]",
            "absolute inset-0 overflow-visible [container-type:size]"
          )}
        >
          <div className="absolute inset-0 h-[100cqh] animate-shimmer-slide [aspect-ratio:1]">
            <div className="animate-spin-around absolute -inset-full w-auto rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" />
          </div>
        </div>

        {children}

        {/* Hover & Active Effects */}
        <div
          className={cn(
            "absolute size-full rounded-2xl px-4 py-1.5 text-sm font-medium",
            "transform-gpu transition-all duration-300 ease-in-out",
            "group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]",
            "group-active:shadow-[inset_0_-10px_10px_#ffffff3f]"
          )}
        />

        {/* Backdrop */}
        <div className="absolute -z-20 [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--cut)]" />
      </button>
    );
  }
);

ShimmerButton.displayName = "ShimmerButton";
export { ShimmerButton };
