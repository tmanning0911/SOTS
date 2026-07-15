import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SITE } from "../../js/data.js";
import {
  buildEducationEventsCalendar,
  buildMonthCells,
  calendarFilterCategories,
  filterCalendarItems,
  itemsByDayKey,
  monthLabel,
} from "../../js/education-events-calendar.js";
import { eventMapUrls } from "../../js/event-maps.js";
import { ArrowButton } from "../components/ArrowButton.jsx";
import { InnerPageHero } from "../components/InnerPageHero.jsx";
import { InnerPageShell } from "../components/InnerPageShell.jsx";
import { ShareBar, eventSharePath } from "../components/ShareBar.jsx";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

const PROGRAM_LINKS = [
  { label: "In Schools Workshops", href: "/education/in-schools/" },
  { label: "Spring Tours", href: "/education/tours/" },
  { label: "Summer Camps", href: "/education/summer-camps/" },
  { label: "Apprentice Application", href: "/education/apprentice-application/" },
  { label: "Adult Enrichment", href: "/education/adult-enrichment/" },
  { label: "In the Park", href: "/education/in-the-park/" },
];

function todayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function EventCard({ item }) {
  const map = eventMapUrls({
    title: item.title,
    location: item.location,
    mapQuery: item.mapQuery,
  });
  const showMap =
    Boolean(map?.embedUrl) &&
    item.location &&
    !/fairfield county|connecticut &|schools &/i.test(item.location);

  return (
    <article className="sots-edu-cal__card" id={item.id}>
      <div className="sots-edu-cal__card-copy">
        <span className="sots-edu-cal__chip">{item.category}</span>
        <h3>{item.title}</h3>
        <p className="sots-edu-cal__meta">{item.dateLabel}</p>
        {item.location ? <p className="sots-edu-cal__meta">{item.location}</p> : null}
        {item.description ? <p className="sots-edu-cal__desc">{item.description}</p> : null}
        {showMap ? (
          <div className="sots-event-venue-map">
            <div className="sots-event-venue-map__frame">
              <iframe
                title={`Map for ${item.title}`}
                src={map.embedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            {map.linkUrl ? (
              <a className="sots-event-venue-map__link" href={map.linkUrl} target="_blank" rel="noreferrer">
                Open in Google Maps
              </a>
            ) : null}
          </div>
        ) : null}
        <ShareBar
          compact
          path={eventSharePath({ id: item.id, href: item.href, ctaUrl: item.href, title: item.title })}
          title={item.title}
          label="Share this event"
          text={[item.title, item.dateLabel, item.location].filter(Boolean).join(" · ")}
        />
      </div>
      <div className="sots-edu-cal__card-actions">
        <ArrowButton href={item.href}>{item.ctaLabel || "Learn more"}</ArrowButton>
      </div>
    </article>
  );
}

function MonthGrid({ year, month, byDay, selectedKey, onSelectDay }) {
  const cells = buildMonthCells(year, month, byDay);
  const label = monthLabel(year, month);

  return (
    <div className="sots-edu-cal__month">
      <div className="sots-edu-cal__weekdays" aria-hidden="true">
        {WEEKDAYS.map((d, i) => (
          <span key={`${d}-${i}`}>{d}</span>
        ))}
      </div>
      <div className="sots-edu-cal__grid" role="grid" aria-label={label}>
        {cells.map((cell, index) => {
          if (cell.type === "pad") {
            return <span key={`pad-${index}`} className="sots-edu-cal__pad" aria-hidden="true" />;
          }
          const count = cell.items.length;
          const isSelected = selectedKey === cell.key;
          const isToday = cell.key === todayKey();
          const className = [
            "sots-edu-cal__day",
            count ? "has-events" : "is-empty",
            isSelected ? "is-selected" : "",
            isToday ? "is-today" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              key={cell.key}
              type="button"
              className={className}
              onClick={() => onSelectDay(cell.key)}
              aria-pressed={isSelected}
              aria-label={
                count
                  ? `${label} ${cell.day}, ${count} event${count === 1 ? "" : "s"}`
                  : `${label} ${cell.day}`
              }
            >
              <span className="sots-edu-cal__day-num">{cell.day}</span>
              {count ? <span className="sots-edu-cal__day-count">{count}</span> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function EducationEventsPage() {
  const [items, setItems] = useState(() => buildEducationEventsCalendar());
  const [category, setCategory] = useState("all");
  const now = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState(() => ({ year: now.getFullYear(), month: now.getMonth() }));
  const [selectedKey, setSelectedKey] = useState(() => todayKey());

  useEffect(() => {
    document.title = "Education Events - Shakespeare on the Sound";
  }, []);

  useEffect(() => {
    Promise.all([
      fetch("/data/events.json").then((r) => (r.ok ? r.json() : [])),
      fetch("/data/plays.json").then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([events, plays]) => {
        setItems(buildEducationEventsCalendar(events, plays));
      })
      .catch(() => {});
  }, []);

  const filtered = useMemo(() => filterCalendarItems(items, category), [items, category]);
  const byDay = useMemo(() => itemsByDayKey(filtered.all), [filtered.all]);
  const selectedItems = byDay.get(selectedKey) ?? [];
  const categories = calendarFilterCategories();

  function shiftMonth(delta) {
    setCursor((prev) => {
      const date = new Date(prev.year, prev.month + delta, 1);
      return { year: date.getFullYear(), month: date.getMonth() };
    });
  }

  return (
    <InnerPageShell showVisit={false} showNewsletter showSupport={false}>
      <article className="sots-edu-cal">
        <InnerPageHero
          eyebrow="Education & Community"
          title="Education Events"
          intro="Workshops, touring shows, summer camps, apprentice training, and in-the-park programs — the education calendar for Shakespeare on the Sound."
        />

        <section className="sots-edu-cal__section" aria-labelledby="edu-cal-heading">
          <div className="sots-edu-cal__inner">
            <div className="sots-edu-cal__toolbar">
              <div className="sots-edu-cal__month-nav">
                <button type="button" className="sots-edu-cal__nav-btn" onClick={() => shiftMonth(-1)} aria-label="Previous month">
                  ‹
                </button>
                <h2 id="edu-cal-heading">{monthLabel(cursor.year, cursor.month)}</h2>
                <button type="button" className="sots-edu-cal__nav-btn" onClick={() => shiftMonth(1)} aria-label="Next month">
                  ›
                </button>
              </div>
              <div className="sots-edu-cal__filters" role="group" aria-label="Filter by category">
                <button
                  type="button"
                  className={`sots-edu-cal__filter${category === "all" ? " is-active" : ""}`}
                  onClick={() => setCategory("all")}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`sots-edu-cal__filter${category === cat ? " is-active" : ""}`}
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="sots-edu-cal__layout">
              <MonthGrid
                year={cursor.year}
                month={cursor.month}
                byDay={byDay}
                selectedKey={selectedKey}
                onSelectDay={setSelectedKey}
              />

              <div className="sots-edu-cal__day-panel">
                <h3 className="sots-edu-cal__panel-title">
                  {selectedKey
                    ? new Intl.DateTimeFormat("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        timeZone: "America/New_York",
                      }).format(new Date(`${selectedKey}T12:00:00`))
                    : "Select a day"}
                </h3>
                {selectedItems.length ? (
                  <ul className="sots-edu-cal__day-list">
                    {selectedItems.map((item) => (
                      <li key={`${item.id}-${selectedKey}`}>
                        <span className="sots-edu-cal__chip">{item.category}</span>
                        <strong>{item.title}</strong>
                        <span className="sots-edu-cal__meta">{item.dateLabel}</span>
                        <Link to={item.href}>{item.ctaLabel || "Learn more"}</Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="sots-edu-cal__empty">No events on this day for the current filter.</p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="sots-edu-cal__section" aria-labelledby="edu-upcoming-heading">
          <div className="sots-edu-cal__inner">
            <header className="sots-edu-cal__section-head">
              <h2 id="edu-upcoming-heading">Upcoming</h2>
              <p>Upcoming education programs and events.</p>
            </header>
            <div className="sots-edu-cal__stack">
              {filtered.upcoming.length ? (
                filtered.upcoming.map((item) => <EventCard key={item.id} item={item} />)
              ) : (
                <p className="sots-edu-cal__empty">No upcoming events in this category right now.</p>
              )}
            </div>
          </div>
        </section>

        {filtered.past.length ? (
          <section className="sots-edu-cal__section sots-edu-cal__section--muted" aria-labelledby="edu-past-heading">
            <div className="sots-edu-cal__inner">
              <header className="sots-edu-cal__section-head">
                <h2 id="edu-past-heading">Earlier this season</h2>
              </header>
              <div className="sots-edu-cal__stack sots-edu-cal__stack--compact">
                {filtered.past.slice(0, 8).map((item) => (
                  <EventCard key={`past-${item.id}`} item={item} />
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="sots-edu-cal__section" aria-labelledby="edu-programs-heading">
          <div className="sots-edu-cal__inner">
            <header className="sots-edu-cal__section-head">
              <h2 id="edu-programs-heading">Explore our programs</h2>
            </header>
            <ul className="sots-edu-cal__programs">
              {PROGRAM_LINKS.map((link) => (
                <li key={link.href}>
                  <Link to={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
            <p className="sots-edu-cal__contact">
              Questions? Contact {SITE.educationDirectorName} at{" "}
              <a href={`mailto:${SITE.educationContact}`}>{SITE.educationContact}</a>.
            </p>
          </div>
        </section>
      </article>
    </InnerPageShell>
  );
}
