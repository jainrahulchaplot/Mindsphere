// Auth store for demo mode - keep existing demo logic exactly as-is for demo mode
interface AuthState {
  userId: string | null;
}

interface AuthActions {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

class AuthStore implements AuthState, AuthActions {
  userId: string | null = null;

  constructor() {
    // Load from localStorage on init, or set demo user
    this.userId = localStorage.getItem('userId') || '550e8400-e29b-41d4-a716-446655440000';
    localStorage.setItem('userId', this.userId);
  }

  async signIn(email: string, password: string): Promise<void> {
    // Demo mode - always succeeds
    this.userId = '550e8400-e29b-41d4-a716-446655440000';
    localStorage.setItem('userId', this.userId);
  }

  async signUp(email: string, password: string): Promise<void> {
    // Demo mode - always succeeds
    this.userId = '550e8400-e29b-41d4-a716-446655440000';
    localStorage.setItem('userId', this.userId);
  }

  signOut(): void {
    this.userId = null;
    localStorage.removeItem('userId');
  }
}

// Singleton instance
export const authStore = new AuthStore();

// Hook for React components
export function useAuth() {
  return {
    userId: authStore.userId,
    signIn: authStore.signIn.bind(authStore),
    signUp: authStore.signUp.bind(authStore),
    signOut: authStore.signOut.bind(authStore),
  };
}
