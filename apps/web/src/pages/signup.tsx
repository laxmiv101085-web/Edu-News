import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";

export default function Signup() {
  const router = useRouter();
  const { register, error } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setLoading(true);

    try {
      await register(formData.name, formData.email, formData.password);
      router.push("/feed");
    } catch (err: any) {
      setFormError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[35%] h-[35%] bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-yellow rounded-2xl text-white shadow-lg shadow-accent-yellow/20 mb-4">
            <GraduationCap size={32} />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 font-display">
            Create Account
          </h1>
          <p className="text-neutral-500 mt-2">
            Join to stay ahead of educational opportunities
          </p>
        </div>

        <Card className="p-8 shadow-deep border-none">
          {(formError || error) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {formError || error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-neutral-700 mb-1.5"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-700 mb-1.5"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-neutral-700 mb-1.5"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                placeholder="••••••••"
              />
              <p className="text-xs text-neutral-500 mt-1">Minimum 6 characters</p>
            </div>

            <Button
              type="submit"
              className="w-full justify-center py-3 text-base"
              size="lg"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </Card>

        <p className="text-center mt-8 text-neutral-500 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-primary-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
