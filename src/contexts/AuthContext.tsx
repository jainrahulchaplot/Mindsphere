import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, authMode } from '../lib/supabase';

interface AuthContextType {
  userId: string | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER_ID = "550e8400-e29b-41d4-a716-446655440000";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authMode === 'demo') {
      // Demo mode - use hardcoded user ID
      setUserId(DEMO_USER_ID);
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
      setUserId(session?.user?.id || null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUserId(session?.user?.id || null);
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    if (authMode === 'demo') {
      setUserId(null);
      return;
    }

    if (supabase) {
      await supabase.auth.signOut();
    }
  };

  return (
    <AuthContext.Provider value={{ userId, isLoading, signOut }}>
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
