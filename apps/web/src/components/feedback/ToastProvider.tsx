"use client";

import React, { ReactNode } from "react";

// What our toast hook returns
type ToastContextValue = {
  notify: (options: any) => void;
};

// Create a React context for toast
const ToastContext = React.createContext<ToastContextValue | undefined>(
  undefined
);

// Hook used in pages/components: const { notify } = useToast();
export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return ctx;
}

interface ToastProviderProps {
  children: ReactNode;
}

// Wrap your app with this provider (probably done in _app.tsx)
export function ToastProvider({ children }: ToastProviderProps) {
  // Simple placeholder notify function
  const notify = (options: any) => {
    // For now just log to console.
    // Later you can connect this to a real toast UI.
    console.log("Toast:", options);
  };

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
    </ToastContext.Provider>
  );
}
