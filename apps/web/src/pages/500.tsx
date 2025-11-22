import { useRouter } from "next/router";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/feedback/EmptyState";

export default function ServerError() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <EmptyState
        title="Server Error"
        description="Something went wrong on our end. Please try again later."
        actionLabel="Go Home"
        onAction={() => router.push("/")}
      />
    </div>
  );
}



