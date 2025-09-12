import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({ 
  children, 
  className = '', 
  hover = false, 
  onClick 
}: CardProps) {
  const baseClasses = 'bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700';
  const hoverClasses = hover ? 'hover:border-purple-500 transition-colors cursor-pointer' : '';
  const clickClasses = onClick ? 'cursor-pointer' : '';
  
  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${clickClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
