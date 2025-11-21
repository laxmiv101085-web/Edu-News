import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CardProps extends HTMLMotionProps<"div"> {
    variant?: "default" | "glass" | "outline";
    hoverEffect?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    (
        { className, variant = "default", hoverEffect = true, children, ...props },
        ref
    ) => {
        const baseStyles = "rounded-2xl overflow-hidden transition-all duration-300";

        const variants = {
            default: "bg-white shadow-soft border border-neutral-100",
            glass:
                "bg-white/70 backdrop-blur-lg border border-white/20 shadow-soft supports-[backdrop-filter]:bg-white/60",
            outline: "bg-transparent border border-neutral-200",
        };

        return (
            <motion.div
                ref={ref}
                initial={false}
                whileHover={
                    hoverEffect
                        ? { y: -4, boxShadow: "0 12px 32px rgba(15, 23, 42, 0.12)" }
                        : undefined
                }
                className={cn(baseStyles, variants[variant], className)}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);

Card.displayName = "Card";
