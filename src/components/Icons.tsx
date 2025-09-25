import React from 'react';
import { Flame, User, Home, LayoutDashboard, Brain } from 'lucide-react';

interface IconProps {
  className?: string;
  size?: number;
}

// Lucide React icons with consistent styling
export const StreakIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <Flame 
    size={size || 20} 
    className={`${className} text-orange-400`}
  />
);

export const ProfileIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <User 
    size={size || 20} 
    className={className}
  />
);

export const HomeIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <Home 
    size={size || 20} 
    className={className}
  />
);

export const DashboardIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <LayoutDashboard 
    size={size || 20} 
    className={className}
  />
);

export const MeditationIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <Brain 
    size={size || 20} 
    className={className}
  />
);
