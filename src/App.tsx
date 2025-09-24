import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AudioProvider } from './contexts/AudioContext';
import { AudioManagerProvider } from './contexts/AudioManagerContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import IntegratedHeader from './components/IntegratedHeader';
import MobileNavBar from './components/MobileNavBar';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import MeditationPage from './pages/MeditationPage';
import SessionPage from './pages/SessionPage';
import ViewOnlySessionPage from './pages/ViewOnlySessionPage';
import AuthPage from './pages/Auth';
import ProfilePage from './pages/ProfilePage';

function AppContent() {
  const location = useLocation();
  const isSessionPage = location.pathname.startsWith('/session/') || location.pathname.startsWith('/view-session/');
  const isAuthPage = location.pathname === '/auth';
  const { userId } = useAuth();

  return (
    <ProtectedRoute>
      <div className='relative animate-fadeIn'>
        {!isAuthPage && <IntegratedHeader userId={userId!} />}
        <div className={!isSessionPage && !isAuthPage ? 'pb-20' : ''}> {/* 80px bottom padding for mobile nav spacing */}
          <Routes>
            <Route path="/" element={<MeditationPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/session/:sessionId" element={<SessionPage />} />
            <Route path="/view-session/:sessionId" element={<ViewOnlySessionPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            {/* Catch-all route - redirect unknown paths to homepage */}
            <Route path="*" element={<MeditationPage />} />
          </Routes>
        </div>
        {!isSessionPage && !isAuthPage && <MobileNavBar userId={userId!} />}
      </div>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AudioManagerProvider>
        <AudioProvider>
          <Router>
            <AppContent />
          </Router>
        </AudioProvider>
      </AudioManagerProvider>
    </AuthProvider>
  );
}