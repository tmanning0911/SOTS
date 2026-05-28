export default function LoadingSpinner({ label = 'Loading' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4" role="status" aria-live="polite">
      <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      <span className="font-inter text-navy/50 text-xs tracking-widest uppercase">{label}</span>
    </div>
  );
}
