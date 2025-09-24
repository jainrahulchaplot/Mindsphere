import { useState } from 'react';
import { supabase } from '../lib/supabase';
import Card from '../components/Card';
import Button from '../components/Button';

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!supabase) {
        throw new Error('Authentication service not available');
      }
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Google sign in failed:', error);
      setError('Google sign in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="container-narrow">
        <Card className="backdrop-blur-md bg-white/5 border-white/10 shadow-2xl">
          <div className="text-center">
            <div className="heading">Welcome to MindSphere</div>
            <div className="subtle mt-1">Your meditation journey begins here</div>
          </div>
          
          <div className={`mt-6 transition-all duration-300 ${isLoading ? 'opacity-75' : ''}`}>
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded text-red-200 text-sm animate-pulse mb-4">
                {error}
              </div>
            )}
            
            <Button 
              label={isLoading ? "Signing in..." : "Continue with Google"} 
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              isLoading={isLoading}
              className="w-full"
            />
            
            <div className="text-center mt-4">
              <p className="text-sm text-silver/60">
                Sign in with your Google account to access your personalized meditation journey
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
