
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  date: string;
  score: number;
  totalQuestions: number;
  answers: number[];
  timeSpent: number; // in seconds
}

export interface QuestionAnalytics {
  questionId: string;
  questionText: string;
  correctAnswers: number;
  totalAttempts: number;
  correctPercentage: number;
}

export interface QuizAnalytics {
  quizId: string;
  quizTitle: string;
  attempts: number;
  averageScore: number;
  highestScore: number;
  averageTimeSpent: number;
  questionAnalytics: QuestionAnalytics[];
}
