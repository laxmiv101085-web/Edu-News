import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// If this line gives error, change it to:
// import { QueryClient, QueryClientProvider } from "react-query";
import { ToastProvider } from "@/components/feedback/ToastProvider";
import { ThemeProvider } from "@/hooks/useTheme";
import { AuthProvider } from '../contexts/AuthContext';
import { NotificationProvider } from '../contexts/NotificationContext';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  // your existing service worker code
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <ToastProvider>
              {/* IMPORTANT: ToastProvider has exactly ONE child */}
              <Component {...pageProps} />
            </ToastProvider>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
