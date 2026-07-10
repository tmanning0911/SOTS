/** Shared rules for production vs QA ticket catalog. */

export function isTestPerformance(performance) {
  if (!performance) return false;
  if (performance.isTest === true) return true;
  return /^test-perf-/i.test(String(performance.id ?? ""));
}

export function catalogAllowsTestPerformances(catalog) {
  return catalog?.meta?.testMode === true;
}

export function stripTestPerformances(catalog) {
  if (!catalog || catalogAllowsTestPerformances(catalog)) return catalog;

  const performances = (catalog.performances ?? []).filter((p) => !isTestPerformance(p));
  const featuredIsTest = isTestPerformance(catalog.featuredTicket);
  const firstPurchasable =
    performances.find((p) => p.ticketsAvailable !== false && !p.isSoldOut) ?? performances[0] ?? null;

  const featuredTicket = featuredIsTest
    ? firstPurchasable
      ? {
          id: firstPurchasable.id,
          name: firstPurchasable.name,
          status: firstPurchasable.status,
          start: firstPurchasable.start,
          end: firstPurchasable.end,
          timezone: firstPurchasable.timezone,
          venue: firstPurchasable.venue,
          location: firstPurchasable.location,
          isSoldOut: firstPurchasable.isSoldOut,
          ticketsAvailable: firstPurchasable.ticketsAvailable,
        }
      : null
    : catalog.featuredTicket;

  return {
    ...catalog,
    performances,
    featuredTicket,
    performanceByDate: Object.fromEntries(
      performances.map((p) => [p.start?.slice(0, 10), p]).filter(([key]) => Boolean(key)),
    ),
  };
}

export function assertProductionPerformanceId(performanceId) {
  if (isTestPerformance({ id: performanceId })) {
    throw new Error("This performance is not available for purchase");
  }
}
