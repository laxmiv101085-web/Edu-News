import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import Link from "next/link";
import { GraduationCap, Check } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Log data as requested
    console.log("Login Form Submitted:", {
      email: formData.email,
      password: formData.password, // In a real app, never log passwords!
      rememberMe: formData.rememberMe
    });

    // Simulate network delay for demo feel
    setTimeout(async () => {
      try {
        // Attempt real login (optional, can be removed if only demo wanted)
        await login(formData.email, formData.password);
        router.push("/feed");
      } catch (error) {
        console.error("Login failed:", error);
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#0B0E14] text-white font-sans selection:bg-cyan-500/30">
      {/* Full-screen Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#0B0E14] to-black z-0" />

      {/* Ambient Glows / Blurred Circles */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md px-4"
      >
        {/* Glassmorphism Card */}
        <div className="w-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-8 relative overflow-hidden group">
          {/* Subtle top border gradient */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10 mb-4 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
              <GraduationCap size={32} className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Welcome Back
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300 hover:bg-black/30"
                placeholder="name@example.com"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 hover:bg-black/30"
                placeholder="••••••••"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group/check">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 rounded border border-white/20 bg-black/20 peer-checked:bg-cyan-500 peer-checked:border-cyan-500 transition-all" />
                  <Check size={12} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                <span className="text-sm text-gray-400 group-hover/check:text-gray-300 transition-colors">Remember me</span>
              </label>

              <a href="#" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-sm uppercase tracking-wide shadow-lg shadow-purple-500/20 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing In...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <Link href="/signup" className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-bold hover:opacity-80 transition-opacity">
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Live Preview Box */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 p-4 rounded-xl bg-black/40 border border-white/5 backdrop-blur-md"
        >
          <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs text-gray-500 font-mono ml-2">Live Preview</span>
          </div>
          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">email:</span>
              <span className="text-cyan-400">{formData.email || "..."}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">remember:</span>
              <span className={formData.rememberMe ? "text-green-400" : "text-gray-600"}>
                {String(formData.rememberMe)}
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
