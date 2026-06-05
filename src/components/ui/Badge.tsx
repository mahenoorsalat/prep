import type { ReactNode } from 'react';
import './Badge.css';

interface BadgeProps {
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'purple' | 'teal' | 'default';
  size?: 'sm' | 'md';
  children: ReactNode;
  className?: string;
}

export default function Badge({ variant = 'default', size = 'sm', children, className = '' }: BadgeProps) {
  return (
    <span className={`badge badge--${variant} badge--${size} ${className}`.trim()}>
      {children}
    </span>
  );
}
