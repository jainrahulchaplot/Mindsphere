import React from 'react';
import { 
  StreakIcon as LuxuryStreakIcon, 
  ProfileIcon as LuxuryProfileIcon, 
  HomeIcon as LuxuryHomeIcon, 
  DashboardIcon as LuxuryDashboardIcon,
  MusicNoteIcon as LuxuryMeditationIcon
} from './LuxuryIcons';

interface IconProps {
  className?: string;
  size?: number;
}

// Luxury dark-themed icons with consistent styling
export const StreakIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <LuxuryStreakIcon 
    size={size || 20} 
    className={className}
  />
);

export const ProfileIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <LuxuryProfileIcon 
    size={size || 20} 
    className={className}
  />
);

export const HomeIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <LuxuryHomeIcon 
    size={size || 20} 
    className={className}
  />
);

export const DashboardIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <LuxuryDashboardIcon 
    size={size || 20} 
    className={className}
  />
);

export const MeditationIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <LuxuryMeditationIcon 
    size={size || 20} 
    className={className}
  />
);
