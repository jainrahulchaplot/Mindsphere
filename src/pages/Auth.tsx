import { useState } from 'react';
import { supabase, authMode } from '../lib/supabase';

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
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

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-white/5 to-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-gradient-to-r from-white/3 to-white/8 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-gradient-to-r from-white/4 to-white/6 rounded-full blur-xl animate-pulse delay-500"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Logo and Title Section */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/5 rounded-full blur-xl"></div>
              <img 
                src="/assets/mindsphere logo.png" 
                alt="MindSphere" 
                className="relative mx-auto h-16 w-16 object-contain drop-shadow-2xl animate-float" 
              />
            </div>
            <h1 className="text-white text-4xl font-light mb-3 tracking-wide animate-slide-up">
              Welcome to
              <span className="block text-5xl font-thin bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                MindSphere
              </span>
            </h1>
            <p className="text-white/70 text-lg font-light tracking-wide animate-slide-up delay-200">
              Your personal sanctuary for growth & reflection
            </p>
          </div>

          {/* Auth Card */}
          <div className="relative group">
            {/* Card Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            
            {/* Main Card */}
            <div className="relative backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl p-10 shadow-2xl group-hover:bg-white/8 transition-all duration-500">
              {isGoogle ? (
                <button
                  onClick={signInWithGoogle}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  disabled={loading}
                  className="w-full group/btn relative overflow-hidden"
                >
                  {/* Button Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-2xl group-hover/btn:from-white/20 group-hover/btn:to-white/10 transition-all duration-300"></div>
                  
                  {/* Button Content */}
                  <div className="relative flex items-center justify-center gap-4 py-4 px-6">
                    {loading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span className="text-white font-medium">Authenticating...</span>
                      </div>
                    ) : (
                      <>
                        <div className="relative">
                          <div className="absolute inset-0 bg-white/20 rounded-full blur-sm"></div>
                          <img 
                            src="https://www.svgrepo.com/show/475656/google-color.svg" 
                            className="relative h-6 w-6 drop-shadow-lg" 
                          />
                        </div>
                        <span className="text-white font-medium text-lg tracking-wide">
                          Continue with Google
                        </span>
                        <div className={`transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}>
                          <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                </button>
              ) : (
                <div className="text-center">
                  <div className="text-white/70 text-lg mb-6">
                    Demo mode enabled
                  </div>
                  <a 
                    href="/" 
                    className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors group"
                  >
                    <span>Go to app</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              )}

              {/* Privacy Notice */}
              <div className="text-center mt-8 pt-6 border-t border-white/10">
                <p className="text-white/40 text-sm font-light">
                  By continuing, you agree to our{' '}
                  <span className="text-white/60 hover:text-white transition-colors cursor-pointer underline decoration-white/30 hover:decoration-white/60">
                    Privacy Policy
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="mt-12 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-white/20 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-white/30 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-white/20 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
