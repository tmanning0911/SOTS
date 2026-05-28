import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sponsors from '../components/Sponsors';
import { motion } from 'framer-motion';
import { site, visitInfo } from '@/content/site';

const team = [
  {
    name: site.educationDirector,
    role: 'Director of Education',
    email: site.educationEmail,
  },
  {
    name: site.outreachDirector,
    role: 'Director of Education Outreach',
    email: site.outreachEmail,
  },
];

const milestones = [
  {
    year: '1996',
    event:
      'First production in Pinkney Park: Much Ado About Nothing. An estimated 6,000 audience members attended the inaugural season.',
  },
  {
    year: '2000',
    event:
      'Season extended to 16 performances. Audiences averaged 9,000 per year as community support grew.',
  },
  {
    year: '2009',
    event:
      'Apprentice Company launched alongside expanded education programs — nearly 14,000 attended A Midsummer Night\'s Dream.',
  },
  {
    year: '2023',
    event: 'Returned to Pinkney Park for our 25th season with A Midsummer Night\'s Dream, then As You Like It in 2023.',
  },
  {
    year: '2026',
    event:
      '30th season — Much Ado About Nothing at Pinkney Park, June 10–28. Gala October 16 at The House Up on the Hill, Norwalk.',
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <div className="relative h-[45vh] min-h-[300px] sm:h-[55vh] sm:min-h-[380px] md:h-[60vh] md:min-h-[400px] overflow-hidden">
        <img
          src="/images/about-banner.png"
          alt=""
          className="w-full h-full object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
        <div className="absolute inset-0 flex items-end px-4 sm:px-6 md:px-16 pb-10 sm:pb-16">
          <div className="max-w-6xl mx-auto w-full">
            <span className="text-rust text-xs tracking-[0.25em] uppercase font-inter font-medium block mb-3 sm:mb-4">
              Rowayton, Connecticut
            </span>
            <h1 className="font-playfair text-white text-4xl sm:text-5xl md:text-7xl font-bold uppercase leading-none text-balance">
              About Us
            </h1>
            <p className="font-inter text-white/70 text-sm mt-4 max-w-lg">{site.tagline}</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto page-gutter py-12 sm:py-16">
        <div className="grid md:grid-cols-2 gap-10 sm:gap-16">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-playfair text-navy text-3xl font-bold uppercase mb-6">{site.name}</h2>
            <p className="font-inter text-navy/90 text-sm leading-relaxed mb-4">{site.mission}</p>
            <p className="font-inter text-navy/90 text-sm leading-relaxed mb-4">
              We offer educational programming in schools, at libraries, in the park, and throughout our
              community. Our professional summer productions take place at {site.location}.
            </p>
            <p className="font-inter text-navy/90 text-sm leading-relaxed mb-4">
              {site.staNote}
            </p>
            <div id="contact" className="border-t border-navy/10 pt-5 mt-5 space-y-2 scroll-mt-24">
              <p className="font-inter text-navy/60 text-xs">
                <span className="font-semibold text-navy/80">Mailing:</span> {site.mailingAddress}
              </p>
              <p className="font-inter text-navy/60 text-xs">
                <span className="font-semibold text-navy/80">Email:</span>{' '}
                <a href={`mailto:${site.email}`} className="hover:text-rust transition-colors">
                  {site.email}
                </a>
              </p>
              <p className="font-inter text-navy text-xs">
                <span className="font-semibold text-navy">Phone:</span> {site.phone} ({site.phoneNote})
              </p>
              <p className="font-inter text-navy text-xs">
                <span className="font-semibold text-navy">Education:</span>{' '}
                <a href={`mailto:${site.educationEmail}`} className="hover:text-rust transition-colors">
                  {site.educationEmail}
                </a>
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img
              src="/images/shakespeare-for-everyone.webp"
              alt="Shakespeare on the Sound performance"
              className="w-full object-cover"
              style={{ maxHeight: '380px' }}
            />
          </motion.div>
        </div>
      </div>

      <div id="visit" className="bg-white py-12 sm:py-16 page-gutter border-y border-navy/5 scroll-mt-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-playfair text-navy text-3xl font-bold uppercase mb-6">Visit & FAQs</h2>
          <div className="grid md:grid-cols-2 gap-8 md:gap-10">
            <div>
              <h3 className="font-inter text-navy font-semibold text-sm uppercase tracking-wider mb-3">
                Getting Here
              </h3>
              <p className="font-inter text-navy/80 text-sm leading-relaxed mb-4">{visitInfo.directions}</p>
              <p className="font-inter text-navy text-sm">
                <strong>{visitInfo.park}</strong>, {visitInfo.address}
              </p>
            </div>
            <div>
              <h3 className="font-inter text-navy font-semibold text-sm uppercase tracking-wider mb-3">
                Before the Show
              </h3>
              <p className="font-inter text-navy/80 text-sm leading-relaxed">{visitInfo.educationTent}</p>
              <p className="font-inter text-navy/60 text-xs mt-6">
                Weather cancellations follow our standard policy — check your email or contact{' '}
                <a href={`mailto:${site.email}`} className="text-rust hover:underline">
                  {site.email}
                </a>{' '}
                on show day if unsure.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-navy py-14 sm:py-20 page-gutter">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-playfair text-white text-2xl sm:text-3xl font-bold uppercase mb-8 sm:mb-12 text-center">Who We Are</h2>
          <div className="space-y-0">
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex flex-col sm:flex-row gap-2 sm:gap-8 border-b border-white/10 py-5"
              >
                <span className="font-playfair text-rust text-xl sm:text-2xl font-bold sm:w-24 flex-shrink-0">{m.year}</span>
                <p className="font-inter text-white/90 text-sm leading-relaxed pt-1">{m.event}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto page-gutter py-12 sm:py-16">
        <h2 className="font-playfair text-navy text-2xl sm:text-3xl font-bold uppercase mb-8 sm:mb-10">Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl">
          {team.map((person, i) => (
            <motion.div
              key={person.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div
                className="aspect-square max-w-xs mb-3 bg-navy/5 border border-navy/10 flex items-center justify-center"
                aria-hidden
              >
                <span className="font-display text-navy/30 text-5xl font-semibold">
                  {person.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </span>
              </div>
              <p className="font-playfair text-navy text-sm font-bold uppercase">{person.name}</p>
              <p className="font-inter text-navy/80 text-xs tracking-widest uppercase mt-0.5">{person.role}</p>
              <a
                href={`mailto:${person.email}`}
                className="font-inter text-rust text-xs mt-2 inline-block hover:underline"
              >
                {person.email}
              </a>
            </motion.div>
          ))}
        </div>
      </div>

      <Sponsors />
      <Footer />
    </div>
  );
}
