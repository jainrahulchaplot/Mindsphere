import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, authMode } from '../lib/supabase';

interface AuthContextType {
  userId: string | null;
  user: any | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER_ID = "550e8400-e29b-41d4-a716-446655440000";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we're in local development
    const isLocalDev = import.meta.env.DEV || 
                       window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       !import.meta.env.VITE_SUPABASE_URL;

    if (authMode === 'demo' && isLocalDev) {
      // Demo mode only for local development
      setUserId(DEMO_USER_ID);
      setUser({
        id: DEMO_USER_ID,
        display_name: 'Demo User',
        email: 'demo@mindsphere.app',
        provider: 'demo'
      });
      setIsLoading(false);
      return;
    }

    // Google auth mode - get user from Supabase
    if (!supabase) {
      setUserId(null);
      setIsLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔍 AuthContext: Initial session:', session);
      console.log('🔍 AuthContext: Setting userId to:', session?.user?.id);
      setUserId(session?.user?.id || null);
      setUser(session?.user || null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔍 AuthContext: Auth state change:', event, 'session:', session);
        console.log('🔍 AuthContext: Setting userId to:', session?.user?.id);
        setUserId(session?.user?.id || null);
        setUser(session?.user || null);
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    // Check if we're in local development
    const isLocalDev = import.meta.env.DEV || 
                       window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       !import.meta.env.VITE_SUPABASE_URL;

    if (authMode === 'demo' && isLocalDev) {
      setUserId(null);
      setUser(null);
      return;
    }

    if (supabase) {
      await supabase.auth.signOut();
    }
  };

  return (
    <AuthContext.Provider value={{ userId, user, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
