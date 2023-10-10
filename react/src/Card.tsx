import { ReactNode } from 'react';

interface CardProps {
  className?: string;
  children: ReactNode;
}

function Card({ className = '', children }: CardProps) {
  return <div className={`card ${className}`}>{children}</div>;
}

export default Card;
