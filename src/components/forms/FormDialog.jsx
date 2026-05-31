import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import ContactForm from './ContactForm';
import { formCopy } from '@/content/forms';

/**
 * Opens a contact / newsletter / sponsorship form in a focused modal.
 */
export default function FormDialog({
  variant = 'contact',
  trigger,
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
}) {
  const copy = formCopy[variant] || formCopy.contact;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = (next) => {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  useEffect(() => {
    if (defaultOpen && !isControlled) setUncontrolledOpen(true);
  }, [defaultOpen, isControlled]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent
        className="z-[110] max-w-[min(100vw-2rem,32rem)] max-h-[min(90vh,720px)] overflow-y-auto border-navy/15 bg-white p-0 gap-0 sm:rounded-sm shadow-2xl [&>button]:text-navy/60 [&>button]:hover:text-navy"
        aria-describedby={`form-dialog-desc-${variant}`}
      >
        <DialogHeader className="border-b border-navy/10 bg-white px-6 py-5 text-left">
          <p className="label mb-2">Get in touch</p>
          <DialogTitle className="font-display text-navy text-xl sm:text-2xl font-medium">
            {copy.title}
          </DialogTitle>
          <DialogDescription
            id={`form-dialog-desc-${variant}`}
            className="font-inter text-navy/70 text-sm leading-relaxed pt-1"
          >
            {copy.description}
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 py-5">
          {open ? (
            <ContactForm key={`${variant}-dialog`} variant={variant} showTitle={false} inDialog />
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
