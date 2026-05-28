import { site } from '@/content/site';

export default function TicketBanner() {
  return (
    <section className="bg-navy-deep border-y border-gold/20" data-nav-zone="dark">
      <div className="max-w-6xl mx-auto page-gutter py-8 sm:py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-center sm:text-left">
          <p className="section-eyebrow text-gold-light mb-2">2026 Summer Season</p>
          <h2 className="font-display text-white text-2xl sm:text-3xl font-semibold uppercase">
            Much Ado About Nothing
          </h2>
          <p className="font-inter text-white/60 text-sm mt-2">June 10–28 · Pinkney Park, Rowayton, CT</p>
        </div>
        <a href={site.ticketsUrl} target="_blank" rel="noopener noreferrer" className="btn-primary shrink-0">
          Get Tickets
        </a>
      </div>
    </section>
  );
}
