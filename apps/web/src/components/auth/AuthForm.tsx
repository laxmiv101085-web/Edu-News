import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, UserRound, Loader2, Apple, Github } from "lucide-react";
import api from "@/lib/api/client";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/feedback/ToastProvider";

const baseSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Use at least 6 characters"),
});

const signupSchema = baseSchema.extend({
  name: z.string().min(2, "Name is required"),
});

type LoginSchema = z.infer<typeof baseSchema>;
type SignupSchema = z.infer<typeof signupSchema>;

interface AuthFormProps {
  mode: "login" | "signup";
  onSuccess?: () => void;
}

export const AuthForm = ({ mode, onSuccess }: AuthFormProps) => {
  const { notify } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const schema = mode === "login" ? baseSchema : signupSchema;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema | SignupSchema>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const passwordValue = watch("password", "");
  const passwordStrength = Math.min(100, passwordValue.length * 10);

  const onSubmit = async (values: LoginSchema | SignupSchema) => {
    setError(null);
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const { data } = await api.post(endpoint, values);
      if (data?.access_token) {
        localStorage.setItem("token", data.access_token);
      }
      if (data?.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      notify({
        title: mode === "login" ? "Welcome back" : "Account created",
        description: "You are ready to track educational updates.",
        intent: "success",
      });
      onSuccess?.();
    } catch (requestError: any) {
      const message = requestError?.response?.data?.message ?? "Something went wrong";
      setError(Array.isArray(message) ? message.join(", ") : message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-text-muted">
          {mode === "login" ? "Welcome back" : "Create Account"}
        </p>
        <h1 className="text-3xl font-semibold text-text-primary">
          {mode === "login" ? "Sign in to continue" : "Join the Educational App"}
        </h1>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} aria-label={`${mode} form`}>
        {mode === "signup" && (
          <div>
            <label className="text-sm font-medium text-text-primary">Full name</label>
            <div className="mt-1 flex items-center rounded-xl border border-border bg-white px-4">
              <UserRound className="h-4 w-4 text-text-muted" />
              <input
                {...register("name")}
                placeholder="Priya Sharma"
                className="w-full border-none bg-transparent py-3 text-sm text-text-primary focus:outline-none"
              />
            </div>
            {"name" in errors && errors.name && <p className="mt-1 text-sm text-danger">{String(errors.name.message)}</p>}
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-text-primary">Email</label>
          <div className="mt-1 flex items-center rounded-xl border border-border bg-white px-4">
            <Mail className="h-4 w-4 text-text-muted" />
            <input
              {...register("email")}
              type="email"
              placeholder="you@email.com"
              className="w-full border-none bg-transparent py-3 text-sm text-text-primary focus:outline-none"
            />
          </div>
          {errors.email && <p className="mt-1 text-sm text-danger">{errors.email.message?.toString()}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between text-sm">
            <label className="font-medium text-text-primary">Password</label>
            {mode === "login" && <button className="text-primary-600">Forgot?</button>}
          </div>
          <div className="mt-1 flex items-center rounded-xl border border-border bg-white px-4">
            <Lock className="h-4 w-4 text-text-muted" />
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full border-none bg-transparent py-3 text-sm text-text-primary focus:outline-none"
            />
            <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="text-text-muted">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {mode === "signup" && (
            <div className="mt-2">
              <div className="flex h-1 w-full overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="rounded-full bg-primary-500 transition-all"
                  style={{ width: `${passwordStrength}%` }}
                  aria-hidden
                />
              </div>
              <p className="mt-1 text-xs text-text-muted">Use at least one number and symbol for better security.</p>
            </div>
          )}
          {errors.password && <p className="mt-1 text-sm text-danger">{errors.password.message?.toString()}</p>}
        </div>

        {error && (
          <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div>
        )}

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Just a moment
            </>
          ) : mode === "login" ? (
            "Sign in"
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      <div className="space-y-3">
        <p className="text-center text-xs uppercase tracking-[0.4em] text-text-muted">Or continue with</p>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="w-full border border-border bg-white text-text-primary">
            <Apple className="h-4 w-4" />
            Apple
          </Button>
          <Button variant="outline" className="w-full border border-border bg-white text-text-primary">
            <Github className="h-4 w-4" />
            GitHub
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;


