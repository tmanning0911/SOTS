import { PageTail } from "./PageTail.jsx";

export function InnerPageShell({
  children,
  className = "",
  showVisit = true,
  showSupport = false,
  showNewsletter = true,
}) {
  return (
    <div className={`orpheum-page-shell${className ? ` ${className}` : ""}`}>
      {children}
      <PageTail showVisit={showVisit} showSupport={showSupport} showNewsletter={showNewsletter} />
    </div>
  );
}
