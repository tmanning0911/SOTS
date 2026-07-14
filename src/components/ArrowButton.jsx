import { Link } from "react-router-dom";

function ChevronIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path className="orpheum-arrow-btn__line" d="M1 7.5H12" stroke="currentColor" strokeWidth="1.5" />
      <path className="orpheum-arrow-btn__chevron" d="M8 3.5L12 7.5L8 11.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function ArrowButton({
  href,
  to,
  children,
  variant = "gold",
  className = "",
  target,
  rel,
  onClick,
  type = "button",
  disabled = false,
  flat = false,
  "aria-busy": ariaBusy,
}) {
  const classes = `orpheum-arrow-btn orpheum-arrow-btn--${variant}${flat ? " orpheum-arrow-btn--flat" : ""} ${className}`.trim();

  const content = flat ? (
    children
  ) : (
    <>
      <span className="orpheum-arrow-btn__label">{children}</span>
      <span className="orpheum-arrow-btn__icon">
        <ChevronIcon />
      </span>
    </>
  );

  if (to) {
    return (
      <Link className={classes} to={to} onClick={onClick} aria-busy={ariaBusy} aria-disabled={disabled || undefined}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a className={classes} href={href} target={target} rel={rel} onClick={onClick} aria-busy={ariaBusy}>
        {content}
      </a>
    );
  }

  return (
    <button className={classes} type={type} onClick={onClick} disabled={disabled} aria-busy={ariaBusy}>
      {content}
    </button>
  );
}
