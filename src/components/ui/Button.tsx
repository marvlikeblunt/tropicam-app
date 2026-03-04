import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-semibold rounded-2xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 disabled:opacity-50 disabled:pointer-events-none select-none";

    const variants = {
      primary:
        "bg-gradient-to-r from-primary to-accent text-white hover:shadow-glow-primary hover:scale-[1.03] active:scale-[0.98]",
      secondary:
        "bg-secondary text-white hover:bg-secondary-dark hover:shadow-glow-secondary hover:scale-[1.03] active:scale-[0.98]",
      ghost:
        "bg-white/5 border border-white/10 text-text-primary hover:bg-white/10 hover:border-white/20 active:scale-[0.98]",
      danger:
        "bg-primary/20 border border-primary/40 text-primary hover:bg-primary hover:text-white active:scale-[0.98]",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
