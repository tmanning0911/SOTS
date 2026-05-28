export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-gold focus:text-navy-deep focus:px-4 focus:py-3 focus:text-xs focus:font-bold focus:uppercase focus:tracking-widest focus:ring-2 focus:ring-navy focus:ring-offset-2"
    >
      Skip to content
    </a>
  );
}
