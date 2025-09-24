import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AudioProvider } from './contexts/AudioContext';
import { AudioManagerProvider } from './contexts/AudioManagerContext';
import IntegratedHeader from './components/IntegratedHeader';
import MobileNavBar from './components/MobileNavBar';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import MeditationPage from './pages/MeditationPage';
import SessionPage from './pages/SessionPage';
import ViewOnlySessionPage from './pages/ViewOnlySessionPage';
import AuthPage from './pages/Auth';
import ProfilePage from './pages/ProfilePage';

const DEMO_USER_ID = "550e8400-e29b-41d4-a716-446655440000";

function AppContent() {
  const location = useLocation();
  const isSessionPage = location.pathname.startsWith('/session/') || location.pathname.startsWith('/view-session/');

  return (
    <ProtectedRoute>
      <div className='relative animate-fadeIn'>
        <IntegratedHeader userId={DEMO_USER_ID} />
        <div className={!isSessionPage ? 'pb-20' : ''}> {/* 80px bottom padding for mobile nav spacing */}
          <Routes>
            <Route path="/" element={<MeditationPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/session/:sessionId" element={<SessionPage />} />
            <Route path="/view-session/:sessionId" element={<ViewOnlySessionPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </div>
        {!isSessionPage && <MobileNavBar userId={DEMO_USER_ID} />}
      </div>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <AudioManagerProvider>
      <AudioProvider>
        <Router>
          <AppContent />
        </Router>
      </AudioProvider>
    </AudioManagerProvider>
  );
}