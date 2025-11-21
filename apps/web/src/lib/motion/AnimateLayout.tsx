import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export interface AnimateLayoutProps extends PropsWithChildren {
  className?: string;
}

const transition = {
  duration: 0.35,
  ease: [0.4, 0, 0.2, 1] as const,
};

export const AnimateLayout = ({ children, className }: AnimateLayoutProps) => {
  const router = useRouter();
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence mode="wait">
        <m.div
          key={router.asPath}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={transition}
          className={className}
        >
          {children}
        </m.div>
      </AnimatePresence>
    </LazyMotion>
  );
};

export default AnimateLayout;


