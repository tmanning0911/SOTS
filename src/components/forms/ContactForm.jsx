import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { formCopy, formTopics, educationPrograms } from '@/content/forms';
import { submitForm, isValidEmail } from '@/lib/submitForm';
import { toast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import { contactPaths } from '@/lib/contactPaths';

const fieldClass =
  'w-full min-h-[44px] border border-navy/20 bg-white px-4 py-2.5 font-inter text-sm text-navy placeholder:text-navy/45 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold disabled:opacity-60';

function Field({ id, label, required, error, children }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="font-inter text-navy text-xs font-semibold uppercase tracking-wider">
        {label}
        {required && (
          <span className="text-gold ml-0.5" aria-hidden>
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="font-inter text-red-700 text-xs" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function topicFromQuery(raw) {
  if (!raw) return null;
  if (formTopics.some((t) => t.value === raw)) return raw;
  return null;
}

export default function ContactForm({ variant = 'contact', className = '', showTitle = true }) {
  const copy = formCopy[variant] || formCopy.contact;
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    topic: 'general',
    organization: '',
    program: 'in-schools',
    message: '',
    'bot-field': '',
  });

  useEffect(() => {
    const q = topicFromQuery(searchParams.get('topic'));
    if (variant === 'contact' && q) {
      setForm((f) => ({ ...f, topic: q }));
    }
  }, [searchParams, variant]);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const next = {};
    if (variant !== 'newsletter' && !form.name.trim()) next.name = 'Name is required';
    if (!isValidEmail(form.email)) next.email = 'Valid email is required';
    if (variant === 'contact' && !form.message.trim()) next.message = 'Message is required';
    if (
      (variant === 'education' || variant === 'sponsorship') &&
      form.message.trim().length < 10
    ) {
      next.message = 'Please include a few details (10+ characters)';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('sending');
    try {
      const payload = { ...form };
      if (variant === 'education') {
        payload.program = form.program;
        payload.organization = form.organization;
      }
      if (variant === 'contact') {
        payload.topic = form.topic;
      }
      await submitForm(variant, payload);
      setStatus('success');
      setForm({
        name: '',
        email: '',
        phone: '',
        topic: 'general',
        organization: '',
        program: 'in-schools',
        message: '',
        'bot-field': '',
      });
      toast({ title: 'Message sent', description: copy.success });
    } catch (err) {
      setStatus('idle');
      toast({
        title: 'Could not send',
        description: err.message || 'Please try again or email us directly.',
      });
    }
  };

  if (status === 'success') {
    return (
      <div
        className={`bg-white border border-gold/40 p-8 sm:p-10 text-center shadow-soft ${className}`}
        role="status"
      >
        <p className="font-display text-navy text-2xl font-semibold uppercase mb-3">Thank You</p>
        <p className="font-inter text-navy/75 text-sm leading-relaxed mb-6">{copy.success}</p>
        <button type="button" className="btn-navy" onClick={() => setStatus('idle')}>
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className={className}>
      {showTitle && (
        <div className="mb-8">
          <span className="section-eyebrow mb-3">Get in Touch</span>
          <h2 className="font-display text-navy text-2xl sm:text-3xl font-semibold uppercase mb-3">
            {copy.title}
          </h2>
          <p className="font-inter text-navy/70 text-sm leading-relaxed max-w-xl">{copy.description}</p>
        </div>
      )}

      <form
        name={variant}
        method="POST"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        onSubmit={handleSubmit}
        className={`bg-white border border-navy/10 p-6 sm:p-8 shadow-soft space-y-5 ${variant === 'newsletter' ? 'newsletter-form-inner' : ''}`}
        noValidate
      >
        <input type="hidden" name="form-name" value={variant} />

        <p className="sr-only" aria-hidden="false">
          <label>
            Do not fill this out
            <input name="bot-field" tabIndex={-1} autoComplete="off" value={form['bot-field']} onChange={update('bot-field')} />
          </label>
        </p>

        <div className="grid sm:grid-cols-2 gap-5">
          {variant !== 'newsletter' && (
            <Field id={`${variant}-name`} label="Name" required error={errors.name}>
              <input
                id={`${variant}-name`}
                name="name"
                type="text"
                autoComplete="name"
                required
                value={form.name}
                onChange={update('name')}
                className={fieldClass}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? `${variant}-name-error` : undefined}
              />
            </Field>
          )}

          <Field id={`${variant}-email`} label="Email" required error={errors.email}>
            <input
              id={`${variant}-email`}
              name="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={update('email')}
              className={fieldClass}
              aria-invalid={!!errors.email}
            />
          </Field>
        </div>

        {variant === 'newsletter' && (
          <Field id={`${variant}-name-opt`} label="First name (optional)" error={errors.name}>
            <input
              id={`${variant}-name-opt`}
              name="name"
              type="text"
              autoComplete="given-name"
              value={form.name}
              onChange={update('name')}
              className={fieldClass}
            />
          </Field>
        )}

        {variant === 'contact' && (
          <>
            <Field id={`${variant}-phone`} label="Phone (optional)">
              <input
                id={`${variant}-phone`}
                name="phone"
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={update('phone')}
                className={fieldClass}
              />
            </Field>
            <Field id={`${variant}-topic`} label="Topic" required>
              <select
                id={`${variant}-topic`}
                name="topic"
                value={form.topic}
                onChange={update('topic')}
                className={fieldClass}
              >
                {formTopics.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </Field>
          </>
        )}

        {(variant === 'education' || variant === 'sponsorship') && (
          <Field id={`${variant}-org`} label={variant === 'education' ? 'School / organization' : 'Organization'}>
            <input
              id={`${variant}-org`}
              name="organization"
              type="text"
              value={form.organization}
              onChange={update('organization')}
              className={fieldClass}
            />
          </Field>
        )}

        {variant === 'education' && (
          <Field id={`${variant}-program`} label="Program interest" required>
            <select
              id={`${variant}-program`}
              name="program"
              value={form.program}
              onChange={update('program')}
              className={fieldClass}
            >
              {educationPrograms.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </Field>
        )}

        {variant !== 'newsletter' && (
          <Field id={`${variant}-message`} label="Message" required error={errors.message}>
            <textarea
              id={`${variant}-message`}
              name="message"
              rows={5}
              required
              value={form.message}
              onChange={update('message')}
              className={`${fieldClass} min-h-[140px] resize-y`}
              aria-invalid={!!errors.message}
            />
          </Field>
        )}

        <p className="font-inter text-navy/50 text-xs leading-relaxed">
          By submitting, you agree we may contact you about your inquiry. We reply from our team inbox — your
          address is not published on this site.{' '}
          <Link to={contactPaths.education} className="text-gold hover:underline">
            Education inquiries
          </Link>
        </p>

        <button type="submit" className="btn-primary w-full sm:w-auto" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : variant === 'newsletter' ? 'Subscribe' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
