import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// Monochromatic classy icons
export const StreakIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <svg 
    width={size || 20} 
    height={size || 20} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
  >
    <path 
      d="M17.5 12C17.5 16.1421 14.1421 19.5 10 19.5C5.85786 19.5 2.5 16.1421 2.5 12C2.5 7.85786 5.85786 4.5 10 4.5C14.1421 4.5 17.5 7.85786 17.5 12Z" 
      fill="currentColor"
      className="text-orange-400"
    />
    <path 
      d="M10 2L11.5 6L16 7.5L11.5 9L10 13L8.5 9L4 7.5L8.5 6L10 2Z" 
      fill="currentColor"
      className="text-orange-300"
    />
    <circle 
      cx="10" 
      cy="12" 
      r="2" 
      fill="currentColor"
      className="text-orange-200"
    />
  </svg>
);

export const ProfileIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <svg 
    width={size || 20} 
    height={size || 20} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
  >
    <circle 
      cx="12" 
      cy="8" 
      r="4" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      fill="none"
    />
    <path 
      d="M6 21C6 17.6863 8.68629 15 12 15C15.3137 15 18 17.6863 18 21" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      fill="none"
    />
  </svg>
);

export const HomeIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <svg 
    width={size || 20} 
    height={size || 20} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
  >
    <path 
      d="M3 9L12 2L21 9V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9Z" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      fill="none"
    />
    <path 
      d="M9 21V12H15V21" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      fill="none"
    />
  </svg>
);

export const DashboardIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <svg 
    width={size || 20} 
    height={size || 20} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
  >
    <rect 
      x="3" 
      y="3" 
      width="7" 
      height="7" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      fill="none"
    />
    <rect 
      x="14" 
      y="3" 
      width="7" 
      height="7" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      fill="none"
    />
    <rect 
      x="3" 
      y="14" 
      width="7" 
      height="7" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      fill="none"
    />
    <rect 
      x="14" 
      y="14" 
      width="7" 
      height="7" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      fill="none"
    />
  </svg>
);

export const MeditationIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <svg 
    width={size || 20} 
    height={size || 20} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
  >
    <circle 
      cx="12" 
      cy="12" 
      r="8" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      fill="none"
    />
    <path 
      d="M12 8V12L15 15" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      fill="none"
    />
    <circle 
      cx="12" 
      cy="12" 
      r="2" 
      fill="currentColor"
    />
  </svg>
);
