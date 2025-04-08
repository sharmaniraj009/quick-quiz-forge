
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Quiz, QuizQuestion } from '../types/quiz';

interface QuizContextType {
  quizzes: Quiz[];
  addQuiz: (quiz: Quiz) => void;
  getQuiz: (id: string) => Quiz | undefined;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([
    // Example quiz
    {
      id: '1',
      title: 'General Knowledge',
      description: 'Test your general knowledge with these questions!',
      questions: [
        {
          id: '1-1',
          question: 'What is the capital of France?',
          options: ['London', 'Berlin', 'Paris', 'Madrid'],
          correctAnswer: 2,
        },
        {
          id: '1-2',
          question: 'Which planet is known as the Red Planet?',
          options: ['Earth', 'Mars', 'Venus', 'Jupiter'],
          correctAnswer: 1,
        },
        {
          id: '1-3',
          question: 'Who painted the Mona Lisa?',
          options: ['Van Gogh', 'Da Vinci', 'Picasso', 'Michelangelo'],
          correctAnswer: 1,
        },
      ],
    },
  ]);

  const addQuiz = (quiz: Quiz) => {
    setQuizzes([...quizzes, quiz]);
  };

  const getQuiz = (id: string) => {
    return quizzes.find((quiz) => quiz.id === id);
  };

  return (
    <QuizContext.Provider value={{ quizzes, addQuiz, getQuiz }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
