import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MEDIA } from "../../../js/data.js";
import {
  formatPerformanceListDate,
  formatPerformanceTime,
  getTicketCheckoutPath,
  getTicketingState,
  isPurchasablePerformance,
  patronDisplayName,
  purchasablePerformances,
  seriesPerformances,
  ticketStatusLabel,
} from "../../../js/ticketing.js";
import { TicketCheckoutButton } from "./TicketCheckoutButton.jsx";
import { TicketStatusBadge } from "./TicketStatusBadge.jsx";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function parsePerformanceDay(iso) {
  const datePart = iso?.slice(0, 10);
  if (!datePart) return { year: NaN, month: NaN, day: NaN, key: "" };
  const [year, month, day] = datePart.split("-").map(Number);
  return { year, month: month - 1, day, key: datePart };
}

function buildMonthGrid(year, month, byDay) {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstWeekday; i += 1) cells.push({ type: "pad" });
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ type: "day", day, performance: byDay.get(day) ?? null });
  }
  return cells;
}

function MonthCalendar({ monthData, onSelect }) {
  const monthLabel = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "America/New_York",
  }).format(new Date(monthData.year, monthData.month, 1));

  const cells = buildMonthGrid(monthData.year, monthData.month, monthData.byDay);

  return (
    <div className="sots-performance-calendar__month">
      <h3 className="sots-performance-calendar__month-title">{monthLabel}</h3>
      <div className="sots-performance-calendar__weekdays" aria-hidden="true">
        {WEEKDAYS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <div className="sots-performance-calendar__grid">
        {cells.map((cell, index) => {
          if (cell.type === "pad") {
            return <span key={`pad-${index}`} className="sots-performance-calendar__pad" aria-hidden="true" />;
          }
          const performance = cell.performance;
          const purchasable = performance && isPurchasablePerformance(performance);
          const status = performance ? ticketStatusLabel(performance) : "";

          if (!performance) {
            return (
              <span key={`day-${cell.day}`} className="sots-performance-calendar__day is-empty">
                <span className="sots-performance-calendar__day-num">{cell.day}</span>
              </span>
            );
          }

          return (
            <button
              key={performance.id}
              type="button"
              className={`sots-performance-calendar__day${purchasable ? " is-available" : " is-unavailable"}`}
              disabled={!purchasable}
              onClick={() => purchasable && onSelect(performance.id)}
              aria-label={`${formatPerformanceListDate(performance.start)} — ${status}`}
            >
              <span className="sots-performance-calendar__day-num">{cell.day}</span>
              {purchasable ? (
                <>
                  <span className="sots-performance-calendar__day-time">{formatPerformanceTime(performance.start)}</span>
                  {performance.minPrice?.display ? (
                    <span className="sots-performance-calendar__day-price">{performance.minPrice.display}</span>
                  ) : null}
                </>
              ) : (
                <span className="sots-performance-calendar__day-status">{status}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PerformanceDateList({ performances }) {
  return (
    <ul className="sots-date-list">
      {performances.map((performance) => {
        const purchasable = isPurchasablePerformance(performance);
        const status = ticketStatusLabel(performance);
        return (
          <li key={performance.id}>
            {purchasable ? (
              <Link to={getTicketCheckoutPath(performance.id)} className="sots-date-list__row is-available">
                <span className="sots-date-list__when">{formatPerformanceListDate(performance.start)}</span>
                <span className="sots-date-list__meta">
                  {performance.venue ?? "Pinkney Park"}
                  {performance.minPrice?.display ? ` · ${performance.minPrice.display}` : ""}
                </span>
                <span className="sots-date-list__cta">Get tickets</span>
              </Link>
            ) : (
              <div className="sots-date-list__row is-unavailable" aria-disabled="true">
                <span className="sots-date-list__when">{formatPerformanceListDate(performance.start)}</span>
                <span className="sots-date-list__meta">{status}</span>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function PerformanceCalendar({
  data,
  image = MEDIA.muchAdoPoster,
  imageAlt,
  allPerformances = false,
  compact = false,
}) {
  const navigate = useNavigate();
  const [view, setView] = useState("list");
  const state = useMemo(() => getTicketingState(data), [data]);

  const performances = useMemo(
    () => (allPerformances ? seriesPerformances(data) : purchasablePerformances(data)),
    [allPerformances, data],
  );

  const months = useMemo(() => {
    const map = new Map();
    for (const performance of performances) {
      const { year, month, day } = parsePerformanceDay(performance.start);
      const key = `${year}-${month}`;
      if (!map.has(key)) map.set(key, { year, month, byDay: new Map() });
      map.get(key).byDay.set(day, performance);
    }
    return [...map.values()].sort((a, b) => a.year - b.year || a.month - b.month);
  }, [performances]);

  const production = data?.production;
  const featured = data?.featuredTicket;
  const title = patronDisplayName(production?.title ?? featured?.name ?? "Current Production");
  const venue = featured?.venue;
  const location = featured?.location;
  const priceFrom = data?.priceFrom?.display;

  function handleSelect(performanceId) {
    navigate(getTicketCheckoutPath(performanceId));
  }

  if (!data?.featuredTicket) {
    return (
      <section className="sots-performance-calendar sots-performance-calendar--empty">
        <p className="sots-performance-calendar__lead">Ticket dates will be posted soon.</p>
        <p>
          <Link to="/about/contact/">Contact the box office</Link>
          {" · "}
          <a href="tel:+12039571006">(203) 957-1006</a>
        </p>
      </section>
    );
  }

  if (!state.canPurchase && !allPerformances) {
    return (
      <section className="sots-performance-calendar sots-performance-calendar--ended">
        <div className="sots-performance-calendar__show">
          <img src={image} alt={imageAlt ?? title} className="sots-performance-calendar__image" loading="lazy" />
          <div>
            <h2 className="sots-performance-calendar__title">{title}</h2>
            <TicketStatusBadge status={state.statusLabel} />
            <p className="sots-performance-calendar__lead">
              {state.isEnded ? "This production has ended." : "Tickets are not currently available."}
            </p>
          </div>
        </div>
        <TicketCheckoutButton />
      </section>
    );
  }

  return (
    <section className={`sots-performance-calendar${compact ? " sots-performance-calendar--compact" : ""}`}>
      <div className="sots-performance-calendar__show">
        <img src={image} alt={imageAlt ?? title} className="sots-performance-calendar__image" loading="lazy" />
        <div className="sots-performance-calendar__show-copy">
          <h2 className="sots-performance-calendar__title">{title}</h2>
          {venue ? (
            <p className="sots-performance-calendar__venue">
              {venue}
              {location ? ` · ${location}` : ""}
            </p>
          ) : null}
          {priceFrom ? <p className="sots-performance-calendar__price-from">From {priceFrom}</p> : null}
          {production?.slug ? (
            <Link className="sots-performance-calendar__about" to={`/productions/${production.slug}/`}>
              About the show
            </Link>
          ) : null}
        </div>
      </div>

      {performances.length ? (
        <>
          <div className="sots-date-picker__toolbar">
            <h3 className="sots-date-picker__heading">Upcoming performances</h3>
            <div className="sots-date-picker__toggle" role="tablist" aria-label="Date view">
              <button
                type="button"
                role="tab"
                aria-selected={view === "list"}
                className={`sots-date-picker__toggle-btn${view === "list" ? " is-active" : ""}`}
                onClick={() => setView("list")}
              >
                List
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={view === "calendar"}
                className={`sots-date-picker__toggle-btn${view === "calendar" ? " is-active" : ""}`}
                onClick={() => setView("calendar")}
              >
                Calendar
              </button>
            </div>
          </div>

          {view === "list" ? (
            <PerformanceDateList performances={performances} />
          ) : (
            <div className="sots-performance-calendar__months">
              {months.map((monthData) => (
                <MonthCalendar key={`${monthData.year}-${monthData.month}`} monthData={monthData} onSelect={handleSelect} />
              ))}
            </div>
          )}
        </>
      ) : (
        <TicketCheckoutButton />
      )}
    </section>
  );
}
