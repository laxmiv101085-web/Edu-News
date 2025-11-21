import { useRouter } from "next/router";
import Link from "next/link";
import { m } from "framer-motion";
import AuthForm from "@/components/auth/AuthForm";

export default function SignupPage() {
  const router = useRouter();
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--color-bg)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(249,115,22,0.15),transparent_55%)]" />
      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <m.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-lg rounded-3xl border border-border bg-white/85 p-8 shadow-deep backdrop-blur"
        >
          <AuthForm mode="signup" onSuccess={() => router.push("/login")} />
          <p className="mt-6 text-center text-sm text-text-muted">
            Already registered?{" "}
            <Link href="/login" className="font-semibold text-primary-600">
              Log in
            </Link>
          </p>
        </m.div>
      </div>
    </div>
  );
}

