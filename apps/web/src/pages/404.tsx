import { useRouter } from "next/router";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/feedback/EmptyState";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <EmptyState
        title="Page Not Found"
        description="The page you're looking for doesn't exist or has been moved."
        actionLabel="Go Home"
        onAction={() => router.push("/")}
      />
    </div>
  );
}

