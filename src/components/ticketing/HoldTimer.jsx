import { useEffect, useRef, useState } from "react";

function formatRemaining(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

export function HoldTimer({ expiresAt, onExpired, className = "" }) {
  const [remainingMs, setRemainingMs] = useState(null);
  const expiredRef = useRef(false);

  useEffect(() => {
    expiredRef.current = false;
    if (!expiresAt) {
      setRemainingMs(null);
      return undefined;
    }

    const tick = () => {
      const ms = new Date(expiresAt).getTime() - Date.now();
      if (ms <= 0) {
        setRemainingMs(0);
        if (!expiredRef.current) {
          expiredRef.current = true;
          onExpired?.();
        }
        return;
      }
      setRemainingMs(ms);
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [expiresAt, onExpired]);

  if (remainingMs == null || remainingMs <= 0) return null;

  return (
    <p className={`sots-checkout__hold-timer ${className}`.trim()} role="status">
      Tickets held for <strong>{formatRemaining(remainingMs)}</strong>
    </p>
  );
}
