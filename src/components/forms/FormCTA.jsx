import FormDialog from './FormDialog';
import { formCopy } from '@/content/forms';

/**
 * Card-style prompt with a button that opens the matching form modal.
 */
export default function FormCTA({
  variant = 'contact',
  title,
  description,
  buttonLabel,
  className = '',
  featured = false,
  open,
  onOpenChange,
}) {
  const copy = formCopy[variant] || formCopy.contact;
  const heading = title || copy.title;
  const body = description || copy.description;
  const label =
    buttonLabel ||
    (variant === 'newsletter' ? 'Subscribe' : variant === 'sponsorship' ? 'Inquire' : 'Open Form');

  return (
    <div
      className={`flex flex-col h-full p-6 sm:p-8 border transition-shadow duration-300 ${
        featured
          ? 'bg-navy text-white border-navy shadow-soft'
          : 'bg-white border-navy/10 shadow-soft hover:shadow-md hover:border-gold/30'
      } ${className}`}
    >
      <h3
        className={`font-display text-lg sm:text-xl font-semibold uppercase mb-3 ${
          featured ? 'text-white' : 'text-navy'
        }`}
      >
        {heading}
      </h3>
      <p className={`font-inter text-sm leading-relaxed flex-1 mb-6 ${featured ? 'text-white/70' : 'text-navy/70'}`}>
        {body}
      </p>
      <FormDialog
        variant={variant}
        open={open}
        onOpenChange={onOpenChange}
        trigger={
          <button type="button" className={featured ? 'btn-primary w-full sm:w-auto' : 'btn-navy w-full sm:w-auto'}>
            {label}
          </button>
        }
      />
    </div>
  );
}
