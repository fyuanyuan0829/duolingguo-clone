import React, { useState } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { LessonPath } from './components/LessonPath';
import { LessonView } from './components/LessonView';
import { UserState, AppScreen, Question, LanguageOption } from './types';
import { generateLessonContent } from './services/geminiService';
import { Button } from './components/Button';

const INITIAL_STATE: UserState = {
  targetLanguage: null,
  hearts: 5,
  xp: 0,
  currentLessonId: null,
  completedLessonIds: [],
};

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>(AppScreen.WELCOME);
  const [userState, setUserState] = useState<UserState>(INITIAL_STATE);
  const [currentLessonData, setCurrentLessonData] = useState<{title: string, questions: Question[]} | null>(null);
  const [loadingLesson, setLoadingLesson] = useState(false);

  const handleLanguageSelect = (lang: LanguageOption) => {
    setUserState(prev => ({ ...prev, targetLanguage: lang.name }));
    setScreen(AppScreen.MAP);
  };

  const handleStartLesson = async (topic: string) => {
    if (!userState.targetLanguage) return;

    setLoadingLesson(true);
    // Fetch AI generated lesson
    const data = await generateLessonContent(userState.targetLanguage, topic);
    setCurrentLessonData(data);
    setLoadingLesson(false);
    setScreen(AppScreen.LESSON);
  };

  const handleLessonComplete = (earnedXp: number) => {
    setUserState(prev => ({
      ...prev,
      xp: prev.xp + earnedXp,
      // Simply add the current count as an ID to simulate progression through list
      completedLessonIds: [...prev.completedLessonIds, `lesson-${prev.completedLessonIds.length + 1}`],
      hearts: 5 // Restore hearts on complete
    }));
    setScreen(AppScreen.SUCCESS);
  };

  const handleExitLesson = () => {
    setScreen(AppScreen.MAP);
    setUserState(prev => ({ ...prev, hearts: 5 })); // Reset hearts on give up? Or keep. Let's reset for better UX in demo.
  };

  if (screen === AppScreen.WELCOME) {
    return <WelcomeScreen onSelectLanguage={handleLanguageSelect} />;
  }

  if (loadingLesson) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-lingo-green text-white">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-bold mb-2">Generating Lesson...</h2>
        <p className="text-green-100">Using Gemini AI to craft your questions</p>
      </div>
    );
  }

  if (screen === AppScreen.LESSON && currentLessonData) {
    return (
      <LessonView 
        title={currentLessonData.title}
        questions={currentLessonData.questions}
        onComplete={handleLessonComplete}
        onExit={handleExitLesson}
        userState={userState}
        updateHearts={(h) => setUserState(prev => ({...prev, hearts: h}))}
      />
    );
  }

  if (screen === AppScreen.SUCCESS) {
    return (
       <div className="flex flex-col items-center justify-center h-screen bg-white text-center p-8">
         <div className="text-8xl mb-6 animate-bounce">🎉</div>
         <h2 className="text-3xl font-extrabold text-lingo-yellowDark mb-4">Lesson Complete!</h2>
         <div className="flex gap-4 mb-8">
            <div className="bg-lingo-yellow/10 p-4 rounded-xl border-2 border-lingo-yellow">
               <div className="text-sm font-bold text-lingo-yellowDark uppercase">Total XP</div>
               <div className="text-2xl font-extrabold text-lingo-yellowDark">{userState.xp}</div>
            </div>
         </div>
         <Button onClick={() => setScreen(AppScreen.MAP)} fullWidth>
           CONTINUE
         </Button>
       </div>
    );
  }

  return (
    <LessonPath 
      userState={userState} 
      onStartLesson={handleStartLesson} 
    />
  );
};

export default App;
