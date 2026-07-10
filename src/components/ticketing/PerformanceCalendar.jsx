import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MEDIA } from "../../../js/data.js";
import {
  formatPerformanceDate,
  getTicketCheckoutPath,
  getTicketingState,
  isPurchasablePerformance,
  purchasablePerformances,
  seriesPerformances,
  ticketStatusLabel,
} from "../../../js/ticketing.js";
import { TicketCheckoutButton } from "./TicketCheckoutButton.jsx";
import { TicketStatusBadge } from "./TicketStatusBadge.jsx";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function parsePerformanceDay(iso) {
  const [datePart] = (iso ?? "").split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  return { year, month: month - 1, day, key: datePart };
}

function buildMonthGrid(year, month, byDay) {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];

  for (let i = 0; i < firstWeekday; i += 1) {
    cells.push({ type: "pad" });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const performance = byDay.get(day) ?? null;
    cells.push({ type: "day", day, performance });
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
      <div className="sots-performance-calendar__grid" role="grid" aria-label={monthLabel}>
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
              aria-label={`${formatPerformanceDate(performance.start)} — ${status}`}
            >
              <span className="sots-performance-calendar__day-num">{cell.day}</span>
              {purchasable ? (
                <>
                  <span className="sots-performance-calendar__day-time">
                    {new Intl.DateTimeFormat("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      timeZone: "America/New_York",
                    }).format(new Date(performance.start))}
                  </span>
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

export function PerformanceCalendar({
  data,
  image = MEDIA.muchAdoPoster,
  imageAlt,
  allPerformances = false,
  compact = false,
}) {
  const navigate = useNavigate();
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
      if (!map.has(key)) {
        map.set(key, { year, month, byDay: new Map() });
      }
      map.get(key).byDay.set(day, performance);
    }
    return [...map.values()].sort((a, b) => a.year - b.year || a.month - b.month);
  }, [performances]);

  const production = data?.production;
  const featured = data?.featuredTicket;
  const title = production?.title ?? featured?.name ?? "Current Production";
  const venue = featured?.venue;
  const location = featured?.location;

  function handleSelect(performanceId) {
    navigate(getTicketCheckoutPath(performanceId));
  }

  if (!data?.featuredTicket) return null;

  if (!state.canPurchase && !allPerformances) {
    return (
      <section className="sots-performance-calendar sots-performance-calendar--ended">
        <div className="sots-performance-calendar__show">
          <img src={image} alt={imageAlt ?? title} className="sots-performance-calendar__image" loading="lazy" />
          <div>
            <h2 className="sots-performance-calendar__title">{title}</h2>
            <TicketStatusBadge status={state.statusLabel} />
            <p className="sots-performance-calendar__lead">
              {state.isEnded
                ? "This production has ended."
                : "Tickets are not currently available for this production."}
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
          <p className="sots-performance-calendar__lead">Pick a date to buy tickets.</p>
          {production?.slug ? (
            <Link className="sots-performance-calendar__about" to={`/productions/${production.slug}/`}>
              About the show
            </Link>
          ) : null}
        </div>
      </div>

      {months.length ? (
        <div className="sots-performance-calendar__months">
          {months.map((monthData) => (
            <MonthCalendar key={`${monthData.year}-${monthData.month}`} monthData={monthData} onSelect={handleSelect} />
          ))}
        </div>
      ) : (
        <TicketCheckoutButton />
      )}
    </section>
  );
}
