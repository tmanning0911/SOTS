const DEFAULT_STEPS = [
  { id: "tickets", label: "Tickets" },
  { id: "details", label: "Your details" },
  { id: "pay", label: "Payment" },
];

export const SHOP_CHECKOUT_STEPS = [
  { id: "delivery", label: "Delivery" },
  { id: "details", label: "Your details" },
  { id: "pay", label: "Payment" },
];

export function CheckoutProgress({ current = "tickets", steps = DEFAULT_STEPS }) {
  const currentIndex = steps.findIndex((step) => step.id === current);

  return (
    <ol className="sots-checkout-progress" aria-label="Checkout steps">
      {steps.map((step, index) => {
        const isComplete = index < currentIndex;
        const isCurrent = step.id === current;
        return (
          <li
            key={step.id}
            className={`sots-checkout-progress__step${isCurrent ? " is-current" : ""}${isComplete ? " is-complete" : ""}`}
            aria-current={isCurrent ? "step" : undefined}
          >
            <span className="sots-checkout-progress__marker" aria-hidden="true">
              {isComplete ? "✓" : index + 1}
            </span>
            <span className="sots-checkout-progress__label">{step.label}</span>
          </li>
        );
      })}
    </ol>
  );
}
