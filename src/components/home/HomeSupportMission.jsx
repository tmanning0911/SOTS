import { Link } from 'react-router-dom';
import Reveal from '../Reveal';
import { site } from '@/content/site';

export default function HomeSupportMission() {
  return (
    <section className="section bg-white border-t border-navy/8" data-nav-zone="light">
      <div className="site-container">
        <Reveal className="max-w-2xl mx-auto text-center">
          <p className="label mb-3">Support us</p>
          <h2 className="heading-section text-navy mb-4">Help keep tickets affordable</h2>
          <p className="text-body text-navy/65 mb-8">{site.donateBlurb}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href={site.donateUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Donate
            </a>
            <Link to="/support" className="btn-outline">
              Ways to give
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
