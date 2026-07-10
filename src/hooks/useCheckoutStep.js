import { useEffect, useState } from "react";

const STEP_ORDER = ["tickets", "details", "pay"];

export function useCheckoutStep(rootRef) {
  const [step, setStep] = useState("tickets");

  useEffect(() => {
    const root = rootRef?.current;
    if (!root) return undefined;

    const sections = [...root.querySelectorAll("[data-checkout-step]")];
    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => STEP_ORDER.indexOf(a.target.dataset.checkoutStep) - STEP_ORDER.indexOf(b.target.dataset.checkoutStep));
        const next = visible[0]?.target?.dataset?.checkoutStep;
        if (next) setStep(next);
      },
      { rootMargin: "-12% 0px -50% 0px", threshold: [0.1, 0.35, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [rootRef]);

  return step;
}
