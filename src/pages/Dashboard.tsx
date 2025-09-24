import { useAuth } from '../state/auth';
import HabitTrackerCard from '../components/HabitTrackerCard';
import SessionsListCard from '../components/SessionsListCard';

export default function Dashboard() {
  const { userId } = useAuth();

  return (
    <div>
      <div className="container-narrow grid-gap fadePop">
        {/* Habit Tracker Card */}
        <HabitTrackerCard userId={userId || '550e8400-e29b-41d4-a716-446655440000'} />
        
        {/* Sessions List Card */}
        <SessionsListCard userId={userId || '550e8400-e29b-41d4-a716-446655440000'} />
      </div>
    </div>
  );
}
