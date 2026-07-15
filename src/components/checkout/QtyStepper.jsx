import { useState } from "react";

const MAX_DEFAULT = 10;

export function QtyStepper({ value, onChange, min = 0, max = MAX_DEFAULT, label }) {
  const qty = Number(value) || 0;
  return (
    <div className="sots-co__qty" aria-label={label || "Quantity"}>
      <button
        type="button"
        className="sots-co__qty-btn"
        onClick={() => onChange(Math.max(min, qty - 1))}
        disabled={qty <= min}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="sots-co__qty-value" aria-live="polite">
        {qty}
      </span>
      <button
        type="button"
        className="sots-co__qty-btn"
        onClick={() => onChange(Math.min(max, qty + 1))}
        disabled={qty >= max}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}

export function useBuyBusy() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function runBuy(fn) {
    setError("");
    setBusy(true);
    try {
      await fn();
    } catch (err) {
      setError(err.message || "Could not start checkout");
    } finally {
      setBusy(false);
    }
  }

  return { busy, error, setError, runBuy };
}
