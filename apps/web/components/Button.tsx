import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline";
  children: React.ReactNode;
};

export default function Button({ variant = "primary", children, ...rest }: Props) {
  const base = "btn-gradient rounded-lg";
  return (
    <button
      {...rest}
      className={`${base} ${variant === "primary" ? "btn-primary" : "btn-outline"}`}
    >
      {children}
    </button>
  );
}

