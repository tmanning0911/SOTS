import { useFormModal } from '@/lib/FormModalContext';

/** Mailing list — compact note before the footer. */
export default function EmailSignupBar() {
  const { openForm } = useFormModal();

  return (
    <section
      id="email-signup"
      className="border-t border-navy/10 bg-white scroll-mt-24"
      data-nav-zone="light"
      aria-labelledby="email-signup-heading"
    >
      <div className="site-container py-12 md:py-14">
        <div className="border border-navy/10 px-4 py-6 sm:px-8 sm:py-8 md:px-10 md:py-9 md:flex md:items-center md:justify-between md:gap-12">
          <div className="border-l-2 border-gold pl-5 sm:pl-6 max-w-lg">
            <h2 id="email-signup-heading" className="font-display text-2xl md:text-[1.75rem] text-navy leading-tight mb-2">
              Season updates
            </h2>
            <p className="text-body text-sm md:text-base text-navy/70">
              On-sale dates, cast news, and weather calls — only when it&apos;s worth opening your inbox.
            </p>
          </div>
          <button
            type="button"
            className="btn-outline mt-6 md:mt-0 shrink-0 w-full sm:w-auto"
            onClick={() => openForm('newsletter')}
          >
            Join the list
          </button>
        </div>
      </div>
    </section>
  );
}
