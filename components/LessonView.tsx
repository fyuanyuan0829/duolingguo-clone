import React, { useState, useEffect } from 'react';
import { Question, UserState } from '../types';
import { Button } from './Button';
import { ProgressBar } from './ProgressBar';
import { generateIllustration } from '../services/geminiService';

interface LessonViewProps {
  title: string;
  questions: Question[];
  onComplete: (xp: number) => void;
  onExit: () => void;
  userState: UserState;
  updateHearts: (hearts: number) => void;
}

export const LessonView: React.FC<LessonViewProps> = ({ 
  title, 
  questions, 
  onComplete, 
  onExit,
  userState,
  updateHearts
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  // Image Generation Effect
  useEffect(() => {
    let isMounted = true;
    
    const fetchImage = async () => {
      if (!currentQuestion?.imageDescription) return;
      
      setLoadingImage(true);
      setImageUrl(null); // Clear previous image
      
      // Check if we can cache this or if we should fetch
      // For this demo, we fetch fresh every time to show off AI capability
      const url = await generateIllustration(currentQuestion.imageDescription);
      
      if (isMounted) {
        setImageUrl(url);
        setLoadingImage(false);
      }
    };

    fetchImage();

    return () => { isMounted = false; };
  }, [currentIndex, currentQuestion]);

  const handleCheck = () => {
    if (selectedOption === null) return;

    if (selectedOption === currentQuestion.correctAnswerIndex) {
      setStatus('correct');
      // Play sound effect could go here
    } else {
      setStatus('wrong');
      updateHearts(userState.hearts - 1);
    }
  };

  const handleNext = () => {
    if (userState.hearts <= 0) {
      // Game over logic could go here, for now just exit or restart
      onExit(); 
      return;
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setStatus('idle');
    } else {
      onComplete(10 + questions.length * 5); // Base XP + bonus
    }
  };

  if (userState.hearts === 0) {
    return (
       <div className="flex flex-col items-center justify-center h-screen bg-white p-6 text-center">
         <div className="text-6xl mb-4">💔</div>
         <h2 className="text-2xl font-bold text-lingo-text mb-2">Out of hearts!</h2>
         <p className="text-gray-500 mb-8">You need more practice to restore your health.</p>
         <Button onClick={onExit} fullWidth>Return Home</Button>
       </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white max-w-md mx-auto shadow-xl relative">
      {/* Header */}
      <div className="flex items-center p-4 gap-4">
        <button onClick={onExit} className="text-gray-400 hover:bg-gray-100 p-2 rounded-full">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <ProgressBar progress={progress} />
        <div className="flex items-center text-lingo-red font-bold animate-pulse">
           <span className="text-xl mr-1">❤️</span> {userState.hearts}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-32">
        <h2 className="text-2xl font-bold text-lingo-text mb-6">
          {currentQuestion.questionText}
        </h2>

        {/* AI Generated Image */}
        <div className="w-full h-48 sm:h-56 bg-white border-2 border-gray-100 rounded-2xl mb-8 flex items-center justify-center overflow-hidden relative shadow-sm">
          {loadingImage ? (
            <div className="flex flex-col items-center text-lingo-green">
               <div className="w-8 h-8 border-4 border-lingo-green border-t-transparent rounded-full animate-spin mb-2"></div>
               <span className="text-xs font-bold uppercase tracking-widest">Painting...</span>
            </div>
          ) : imageUrl ? (
            <img 
              src={imageUrl} 
              alt="AI Illustration" 
              className="w-full h-full object-contain animate-[fadeIn_0.5s_ease-out]" 
            />
          ) : (
             <div className="text-gray-300 text-6xl">🎨</div>
          )}
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQuestion.correctAnswerIndex;
            const isWrong = isSelected && status === 'wrong';
            const showCorrect = status !== 'idle' && isCorrect;

            let borderClass = "border-gray-200";
            let bgClass = "bg-white";
            let textClass = "text-lingo-text";

            if (status === 'idle') {
                if (isSelected) {
                    bgClass = "bg-blue-50";
                    borderClass = "border-lingo-blue";
                    textClass = "text-lingo-blue";
                }
            } else if (status === 'correct') {
                if (isCorrect) {
                     bgClass = "bg-green-100";
                     borderClass = "border-lingo-green";
                     textClass = "text-lingo-green";
                }
            } else if (status === 'wrong') {
                if (isSelected) {
                    bgClass = "bg-red-50";
                    borderClass = "border-lingo-red";
                    textClass = "text-lingo-red";
                } else if (isCorrect) {
                     // Show correct answer even if wrong
                     bgClass = "bg-green-50";
                     borderClass = "border-lingo-green";
                     textClass = "text-lingo-green";
                }
            }

            return (
              <button
                key={idx}
                disabled={status !== 'idle'}
                onClick={() => setSelectedOption(idx)}
                className={`
                  w-full p-4 rounded-xl border-2 border-b-4 text-left font-bold text-lg transition-all
                  ${bgClass} ${borderClass} ${textClass}
                  ${status === 'idle' ? 'active:scale-[0.98]' : ''}
                `}
              >
                <div className="flex justify-between items-center">
                   <span>{option}</span>
                   {status !== 'idle' && isCorrect && <span className="text-lingo-green">✓</span>}
                   {status === 'wrong' && isSelected && <span className="text-lingo-red">✕</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer / Status Sheet */}
      <div className={`
        fixed bottom-0 left-0 right-0 p-6 border-t-2 transition-transform duration-300
        ${status === 'idle' ? 'bg-white border-gray-100' : 
          status === 'correct' ? 'bg-green-100 border-green-200' : 
          'bg-red-100 border-red-200'}
        ${status === 'idle' && selectedOption === null ? 'translate-y-0' : 'translate-y-0'}
      `}>
         <div className="max-w-md mx-auto">
            {status !== 'idle' && (
              <div className="mb-4">
                 <h3 className={`text-xl font-bold mb-1 ${status === 'correct' ? 'text-lingo-greenDark' : 'text-lingo-redDark'}`}>
                   {status === 'correct' ? 'Excellent!' : 'Correct solution:'}
                 </h3>
                 {status === 'wrong' && (
                   <p className="text-lingo-redDark">{currentQuestion.options[currentQuestion.correctAnswerIndex]}</p>
                 )}
                 <p className="text-sm text-gray-600 mt-2 italic">{currentQuestion.explanation}</p>
              </div>
            )}
            
            {status === 'idle' ? (
               <Button 
                 fullWidth 
                 onClick={handleCheck} 
                 disabled={selectedOption === null}
                 variant={selectedOption !== null ? 'primary' : 'secondary'}
               >
                 CHECK
               </Button>
            ) : (
               <Button 
                 fullWidth 
                 onClick={handleNext}
                 variant={status === 'correct' ? 'primary' : 'danger'}
                 className={status === 'correct' ? '!bg-lingo-green' : '!bg-lingo-red'}
               >
                 CONTINUE
               </Button>
            )}
         </div>
      </div>
    </div>
  );
};
