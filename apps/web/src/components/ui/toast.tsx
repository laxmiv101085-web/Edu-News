"use client";

import * as React from "react";

// Simple Toast component
export type ToastProps = React.HTMLAttributes<HTMLDivElement>;

export function Toast({ children, ...props }: ToastProps) {
  return <div {...props}>{children}</div>;
}

// Toast Provider
export interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  return <>{children}</>;
}

// Toast Viewport (container for toasts)
export function ToastViewport(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} />;
}