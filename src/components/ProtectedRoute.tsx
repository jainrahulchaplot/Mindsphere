import AuthPage from '../pages/Auth';
import { authMode, supabase } from '../lib/supabase';
import { useEffect, useState } from 'react';
import { useAuth } from '../state/auth';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(authMode !== 'google');
  const [authed, setAuthed] = useState(false);
  const { userId } = useAuth(); // demo store

  useEffect(() => {
    if (authMode !== 'google') return;
    if (!supabase) return setReady(true);
    supabase.auth.getSession().then(({ data }) => {
      setAuthed(!!data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setAuthed(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (authMode === 'google') {
    if (!ready) return null;
    if (!authed) return <AuthPage />;
    return <>{children}</>;
  }

  // demo mode fallback (unchanged behavior)
  if (!userId) return <AuthPage />;
  return <>{children}</>;
}
