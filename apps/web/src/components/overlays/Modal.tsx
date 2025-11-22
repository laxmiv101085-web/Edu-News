import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { m } from "framer-motion";
import cn from "@/lib/utils/cn";

interface ModalProps {
  title: string;
  description?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const Modal = ({ title, description, open, onOpenChange, children }: ModalProps) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay className="modal-overlay fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center px-4">
        <m.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className={cn("w-full max-w-lg rounded-3xl border border-border bg-surface p-6 shadow-deep")}
        >
          <Dialog.Title className="text-xl font-semibold text-text-primary">{title}</Dialog.Title>
          {description && <Dialog.Description className="mt-1 text-sm text-text-muted">{description}</Dialog.Description>}
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="absolute right-6 top-6 text-text-muted"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="mt-4">{children}</div>
        </m.div>
      </div>
    </Dialog.Portal>
  </Dialog.Root>
);

export default Modal;




