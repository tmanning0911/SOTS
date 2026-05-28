import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import FormDialog from '@/components/forms/FormDialog';

const FormModalContext = createContext(null);

const FORM_VARIANTS = new Set(['contact', 'education', 'newsletter', 'sponsorship']);

function topicToVariant(topic) {
  if (topic === 'education') return 'education';
  if (topic === 'sponsorship') return 'sponsorship';
  if (topic) return 'contact';
  return null;
}

export function FormModalProvider({ children }) {
  const [state, setState] = useState({ open: false, variant: 'contact' });
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const openForm = useCallback((variant = 'contact') => {
    if (!FORM_VARIANTS.has(variant)) return;
    setState({ open: true, variant });
  }, []);

  const closeForm = useCallback(() => {
    setState((s) => ({ ...s, open: false }));
    if (location.pathname === '/contact' && searchParams.get('topic')) {
      const next = new URLSearchParams(searchParams);
      next.delete('topic');
      setSearchParams(next, { replace: true });
    }
  }, [location.pathname, searchParams, setSearchParams]);

  const value = useMemo(() => ({ openForm, closeForm }), [openForm, closeForm]);

  const topic = searchParams.get('topic');
  const formParam = searchParams.get('form');

  useEffect(() => {
    if (location.pathname === '/contact' && topic) {
      const variant = topicToVariant(topic);
      if (variant) openForm(variant);
      return;
    }
    if (formParam && FORM_VARIANTS.has(formParam) && location.pathname !== '/contact') {
      openForm(formParam);
      const next = new URLSearchParams(searchParams);
      next.delete('form');
      setSearchParams(next, { replace: true });
    }
  }, [location.pathname, topic, formParam, openForm, searchParams, setSearchParams]);

  useEffect(() => {
    if (location.pathname === '/learning' && location.hash === '#education-form') {
      openForm('education');
    }
  }, [location.pathname, location.hash, openForm]);

  return (
    <FormModalContext.Provider value={value}>
      {children}
      <FormDialog
        variant={state.variant}
        open={state.open}
        onOpenChange={(next) => {
          if (next) setState((s) => ({ ...s, open: true, variant: s.variant }));
          else closeForm();
        }}
      />
    </FormModalContext.Provider>
  );
}

export function useFormModal() {
  const ctx = useContext(FormModalContext);
  if (!ctx) {
    throw new Error('useFormModal must be used within FormModalProvider');
  }
  return ctx;
}

export function useFormModalOptional() {
  return useContext(FormModalContext);
}
