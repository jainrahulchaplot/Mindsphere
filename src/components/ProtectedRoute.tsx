import AuthPage from '../pages/Auth';
import { authMode, supabase } from '../lib/supabase';
import { useEffect, useState } from 'react';
import { useAuth } from '../state/auth';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(authMode !== 'google');
  const [authed, setAuthed] = useState(false);
  const { userId } = useAuth(); // demo store
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (authMode !== 'google') return;
    if (!supabase) return setReady(true);
    supabase.auth.getSession().then(({ data }) => {
      setAuthed(!!data.session);
      setReady(true);
      // If user just authenticated and is on home page, redirect to profile
      if (data.session && location.pathname === '/') {
        navigate('/profile');
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setAuthed(!!s);
      // If user just authenticated, redirect to profile
      if (s && location.pathname === '/') {
        navigate('/profile');
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate, location.pathname]);

  if (authMode === 'google') {
    if (!ready) return null;
    if (!authed) return <AuthPage />;
    return <>{children}</>;
  }

  // demo mode fallback (unchanged behavior)
  if (!userId) return <AuthPage />;
  return <>{children}</>;
}
