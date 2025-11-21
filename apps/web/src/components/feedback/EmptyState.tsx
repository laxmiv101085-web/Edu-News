import { Frown } from "lucide-react";
import Button from "@/components/ui/Button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({ title, description, actionLabel, onAction }: EmptyStateProps) => (
  <div className="flex flex-col items-center gap-4 rounded-3xl border border-border bg-surface p-10 text-center shadow-soft">
    <div className="rounded-full bg-neutral-100 p-4 text-primary-600">
      <Frown className="h-6 w-6" />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      <p className="mt-2 text-sm text-text-muted">{description}</p>
    </div>
    {actionLabel && (
      <Button variant="primary" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
);

export default EmptyState;


