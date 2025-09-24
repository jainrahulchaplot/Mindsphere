import { useEffect, useState } from 'react';
import { supabase, authMode } from '../lib/supabase';

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const isGoogle = authMode === 'google';

  async function signInWithGoogle() {
    if (!supabase) return alert('Supabase not configured');
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { 
        queryParams: { prompt: 'select_account' }, 
        redirectTo: `${window.location.origin}/profile`
      }
    });
    if (error) {
      console.error(error);
      alert('Google sign-in failed: ' + error.message);
    }
    setLoading(false);
  }

  // Minimal glassmorphism UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-stone-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-6">
          <img src="/logo.svg" alt="MindSphere" className="mx-auto h-10 mb-3" />
          <h1 className="text-white text-2xl font-semibold">Welcome to MindSphere</h1>
          <p className="text-white/60 text-sm mt-1">Sign in to build your profile & memories</p>
        </div>

        {isGoogle ? (
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white text-black rounded-lg py-3 font-medium hover:opacity-90 transition-opacity"
            disabled={loading}
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5" />
            {loading ? 'Redirecting…' : 'Continue with Google'}
          </button>
        ) : (
          <div className="text-white/70 text-sm text-center">
            Demo mode enabled. <a className="underline hover:text-white transition-colors" href="/">Go to app →</a>
          </div>
        )}

        <div className="text-xs text-white/40 text-center mt-6">
          By continuing you agree to our Privacy Policy.
        </div>
      </div>
    </div>
  );
}
