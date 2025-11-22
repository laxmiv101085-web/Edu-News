import { m } from "framer-motion";
import cn from "@/lib/utils/cn";

interface ReadingModeToggleProps {
  value: "studio" | "focus";
  onChange: (value: "studio" | "focus") => void;
}

const options: Array<{ value: "studio" | "focus"; label: string }> = [
  { value: "studio", label: "Studio" },
  { value: "focus", label: "Focus" },
];

export const ReadingModeToggle = ({ value, onChange }: ReadingModeToggleProps) => (
  <div className="rounded-full border border-border bg-surface p-1 text-sm">
    <div className="relative flex">
      <m.span
        layout
        className={cn("absolute inset-y-1 rounded-full bg-neutral-100 shadow-soft", value === "focus" ? "right-1 left-1/2" : "left-1 right-1/2")}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "relative z-10 flex-1 rounded-full px-4 py-1 text-center font-medium transition",
            value === option.value ? "text-text-primary" : "text-text-muted"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  </div>
);

export default ReadingModeToggle;




