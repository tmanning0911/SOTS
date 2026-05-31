import { useFormModal } from '@/lib/FormModalContext';
import { formCopy } from '@/content/forms';

export default function FormCTA({
  variant = 'contact',
  title,
  description,
  buttonLabel,
  className = '',
}) {
  const { openForm } = useFormModal();
  const copy = formCopy[variant] || formCopy.contact;
  const heading = title || copy.title;
  const body = description || copy.description;
  const label =
    buttonLabel ||
    (variant === 'newsletter' ? 'Subscribe' : variant === 'sponsorship' ? 'Inquire' : 'Send message');

  return (
    <div className={`flex flex-col h-full p-6 sm:p-8 border border-navy/10 bg-white ${className}`}>
      <h3 className="font-display text-xl font-medium text-navy mb-3">{heading}</h3>
      <p className="text-body text-sm flex-1 mb-6">{body}</p>
      <button type="button" onClick={() => openForm(variant)} className="btn-outline w-full sm:w-auto">
        {label}
      </button>
    </div>
  );
}
