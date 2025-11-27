export interface Question {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  imageDescription: string;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  topic: string;
  questions: Question[];
  completed: boolean;
  locked: boolean;
}

export interface UserState {
  targetLanguage: string | null;
  hearts: number;
  xp: number;
  currentLessonId: string | null;
  completedLessonIds: string[];
}

export enum AppScreen {
  WELCOME = 'WELCOME',
  MAP = 'MAP',
  LESSON = 'LESSON',
  SUCCESS = 'SUCCESS'
}

export interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}
