import React from 'react';
import { UserState, AppScreen } from '../types';

interface LessonPathProps {
  userState: UserState;
  onStartLesson: (topic: string) => void;
}

const TOPICS = [
  "Basics 1", "Greetings", "Travel", "Food", "Family", "Basics 2", "Shopping", "School"
];

export const LessonPath: React.FC<LessonPathProps> = ({ userState, onStartLesson }) => {
  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-sm z-10 border-b-2 border-gray-100 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <span className="text-2xl">🇪🇸</span> {/* Placeholder for dynamic flag */}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center text-lingo-red font-bold">
            <span className="mr-1">❤️</span> {userState.hearts}
          </div>
          <div className="flex items-center text-lingo-yellowDark font-bold">
            <span className="mr-1">⚡</span> {userState.xp}
          </div>
        </div>
      </header>

      {/* Path */}
      <div className="flex flex-col items-center py-8 space-y-8">
        {TOPICS.map((topic, index) => {
          const isCompleted = index < (userState.completedLessonIds.length);
          const isCurrent = index === userState.completedLessonIds.length;
          const isLocked = index > userState.completedLessonIds.length;
          
          // Zigzag layout calculation
          const offset = Math.sin(index) * 60; 

          return (
            <div 
              key={topic} 
              className="relative flex flex-col items-center"
              style={{ transform: `translateX(${offset}px)` }}
            >
              <button
                onClick={() => !isLocked && onStartLesson(topic)}
                disabled={isLocked}
                className={`
                  w-20 h-20 rounded-full flex items-center justify-center mb-2 relative
                  transition-transform active:scale-95
                  ${isCompleted ? 'bg-lingo-yellow' : isCurrent ? 'bg-lingo-green' : 'bg-gray-200'}
                  ${!isLocked ? 'shadow-[0_6px_0_0_rgba(0,0,0,0.2)]' : ''}
                `}
              >
                {isCompleted ? (
                   <span className="text-3xl text-white">✓</span>
                ) : isLocked ? (
                   <span className="text-3xl text-gray-400">🔒</span>
                ) : (
                   <span className="text-3xl text-white">★</span>
                )}
                
                {/* Floating Start label for current */}
                {isCurrent && (
                  <div className="absolute -top-10 bg-white border-2 border-gray-200 px-3 py-1 rounded-xl font-bold text-lingo-green text-sm shadow-sm animate-bounce">
                    START
                  </div>
                )}
              </button>
              <span className={`font-bold text-sm ${isLocked ? 'text-gray-300' : 'text-gray-600'}`}>
                {topic}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
