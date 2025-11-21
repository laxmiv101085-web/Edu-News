import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import cn from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  asChild?: boolean;
}

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary-600 text-white shadow-soft hover:bg-primary-700",
  secondary: "bg-neutral-100 text-text-primary hover:bg-neutral-200 dark:bg-white/10",
  ghost: "text-text-muted hover:text-text-primary hover:bg-neutral-100/60 dark:hover:bg-white/5",
  outline: "border border-border text-text-primary hover:border-primary-200",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = "primary", isLoading, disabled, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const mergedProps = {
      ...(asChild ? {} : { disabled: disabled || isLoading }),
      ...props,
    };
    
    // When asChild is true, Slot requires exactly one child
    if (asChild) {
      return (
        <Comp
          ref={ref}
          className={cn(baseClasses, variantClasses[variant], className)}
          {...mergedProps}
        >
          {children}
        </Comp>
      );
    }
    
    return (
      <Comp
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], className)}
        {...mergedProps}
      >
        {isLoading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden />
        )}
        {children}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export default Button;

