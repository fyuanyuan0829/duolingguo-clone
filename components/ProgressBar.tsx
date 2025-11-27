import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className="h-full bg-lingo-green transition-all duration-500 ease-out rounded-full"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
