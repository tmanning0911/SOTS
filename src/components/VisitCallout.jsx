import { Link } from 'react-router-dom';
import { site, visitInfo } from '@/content/site';
import { IconArrowRight } from '@/components/icons';

export default function VisitCallout() {
  return (
    <section className="bg-white border-y border-navy/8">
      <div className="max-w-6xl mx-auto page-gutter py-10 sm:py-14">
        <div className="grid md:grid-cols-3 gap-8 md:gap-10">
          <div className="md:col-span-2">
            <span className="section-eyebrow mb-3">Plan Your Visit</span>
            <h2 className="font-display text-navy text-2xl sm:text-3xl font-semibold uppercase mb-4">
              Pinkney Park
            </h2>
            <p className="font-inter text-navy/75 text-sm leading-relaxed mb-4">{visitInfo.directions}</p>
            <p className="font-inter text-navy/70 text-xs leading-relaxed mb-4">{visitInfo.parking}</p>
            <p className="font-inter text-navy text-sm">
              <strong>{visitInfo.park}</strong> · {visitInfo.address}
            </p>
          </div>
          <div className="flex flex-col justify-center gap-4">
            <p className="font-inter text-navy/60 text-xs leading-relaxed">{visitInfo.educationTent}</p>
            <Link to="/about#visit" className="link-gold inline-flex items-center gap-2 w-fit">
              FAQs & directions <IconArrowRight size={14} />
            </Link>
            <a href={`mailto:${site.email}`} className="font-inter text-navy/50 text-xs hover:text-rust transition-colors">
              Questions? {site.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
