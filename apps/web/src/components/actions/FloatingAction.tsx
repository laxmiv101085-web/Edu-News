import { m } from "framer-motion";
import { LucideIcon } from "lucide-react";
import cn from "@/lib/utils/cn";

interface FloatingActionProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  className?: string;
}

export const FloatingAction = ({ icon: Icon, label, onClick, className }: FloatingActionProps) => (
  <m.button
    whileTap={{ scale: 0.96 }}
    whileHover={{ y: -2 }}
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
      className
    )}
    aria-label={label}
  >
    <Icon className="h-4 w-4" />
    {label}
  </m.button>
);

export default FloatingAction;


