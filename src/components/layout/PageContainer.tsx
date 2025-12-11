import React from 'react';

interface Props {
  children: React.ReactNode;
}

export const PageContainer = ({ children }: Props) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
};