import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string; // Para poder añadir clases extra si hace falta
}

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
      {children}
    </div>
  );
};