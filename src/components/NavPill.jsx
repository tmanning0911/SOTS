import { PILL_NAV } from "../../js/data.js";

/**
 * Roundabout-style floating pill nav.
 * @see https://github.com/react/react — component-based, declarative UI
 */
export function NavPill() {
  return (
    <nav
      aria-label="Primary Navigation"
      className="tw-pointer-events-none tw-absolute tw-left-1/2 tw-top-1/2 tw-z-20 tw-hidden tw--translate-x-1/2 tw--translate-y-1/2 pill:tw-block"
    >
      <div className="tw-pill-nav tw-pointer-events-auto tw-inline-flex tw-max-w-[min(calc(100vw-18rem),58rem)] tw-items-center tw-rounded-[300px] tw-border tw-border-black/5 tw-bg-white tw-px-5 tw-shadow-[0_2px_6px_rgba(0,0,0,0.05),0_8px_28px_rgba(0,0,0,0.12)]">
        <ul className="tw-m-0 tw-flex tw-list-none tw-items-center tw-p-0">
          {PILL_NAV.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="tw-block tw-whitespace-nowrap tw-rounded-[300px] tw-px-[17px] tw-py-[17px] tw-text-lg tw-font-bold tw-leading-none tw-text-neutral-900 tw-no-underline tw-transition-colors hover:tw-bg-black/5 lg:tw-text-xl"
                {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
