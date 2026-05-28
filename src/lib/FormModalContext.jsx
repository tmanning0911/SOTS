import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import FormDialog from '@/components/forms/FormDialog';

const FormModalContext = createContext(null);

const FORM_VARIANTS = new Set(['contact', 'education', 'newsletter', 'sponsorship']);

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
  }, []);

  const value = useMemo(() => ({ openForm, closeForm }), [openForm, closeForm]);

  useEffect(() => {
    const form = searchParams.get('form');
    if (!form || !FORM_VARIANTS.has(form) || location.pathname === '/contact') return;
    openForm(form);
    const next = new URLSearchParams(searchParams);
    next.delete('form');
    setSearchParams(next, { replace: true });
  }, [searchParams, location.pathname, openForm, setSearchParams]);

  return (
    <FormModalContext.Provider value={value}>
      {children}
      <FormDialog
        variant={state.variant}
        open={state.open}
        onOpenChange={(next) => {
          if (next) setState((s) => ({ ...s, open: true }));
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

/** Safe hook for optional global modal (returns null outside provider). */
export function useFormModalOptional() {
  return useContext(FormModalContext);
}
