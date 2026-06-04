import SectionHeader from './SectionHeader';
import { useFormModal } from '@/lib/FormModalContext';
import { homeCopy } from '@/content/voice';

/** Orpheum 1:1 — Never Miss a Beat newsletter band */
export default function EmailSignupBar() {
  const { openForm } = useFormModal();

  return (
    <section
      id="email-signup"
      className="bg-navy-deep border-t border-white/10 scroll-mt-24"
      data-nav-zone="dark"
      aria-labelledby="email-signup-heading"
    >
      <div className="site-container py-10 sm:py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-10">
          <SectionHeader
            eyebrow=""
            title="Never Miss a Beat"
            titleId="email-signup-heading"
            description={homeCopy.mailingList}
            align="left"
            light
            className="!mb-0 max-w-xl"
          />
          <button
            type="button"
            className="btn-primary min-w-[220px] shrink-0 self-start md:self-auto justify-center"
            onClick={() => openForm('newsletter')}
          >
            Sign Up For Our Newsletter
          </button>
        </div>
      </div>
    </section>
  );
}
