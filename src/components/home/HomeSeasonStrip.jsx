import { Link } from 'react-router-dom';
import Reveal from '../Reveal';
import { seasonVoice, homeCopy } from '@/content/voice';
import { site } from '@/content/site';

export default function HomeSeasonStrip() {
  return (
    <section className="season-band relative overflow-hidden border-y border-gold/20" data-nav-zone="light">
      <div className="absolute inset-0 season-band-texture pointer-events-none opacity-30" aria-hidden />
      <div className="relative z-[1] site-container py-12 md:py-14">
        <Reveal className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="max-w-2xl">
            <p className="label text-navy-deep/60 mb-2">
              {seasonVoice.year} season · On sale now
            </p>
            <h2 className="heading-section text-navy-deep mb-3 text-balance">
              Sixteen nights of {seasonVoice.mainStage}
            </h2>
            <p className="text-body text-navy-deep/75 max-w-prose">
              {homeCopy.productionsIntro}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href={site.ticketsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-8"
            >
              Get tickets
            </a>
            <Link to="/events" className="btn-outline border-navy-deep/25 text-navy-deep hover:bg-navy-deep/5">
              Special events
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
