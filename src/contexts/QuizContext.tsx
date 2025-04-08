
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Quiz, QuizQuestion, NewQuiz } from '../types/quiz';
import { getAllQuizzes, getQuizById, addQuizToDb } from '../services/mongoService';
import { useToast } from '@/components/ui/use-toast';

interface QuizContextType {
  quizzes: Quiz[];
  loading: boolean;
  error: string | null;
  addQuiz: (quiz: NewQuiz) => Promise<string | null>;
  getQuiz: (id: string) => Promise<Quiz | undefined>;
  refreshQuizzes: () => Promise<void>;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch all quizzes on component mount
  useEffect(() => {
    refreshQuizzes();
  }, []);

  // Function to refresh quiz list
  const refreshQuizzes = async () => {
    try {
      setLoading(true);
      const fetchedQuizzes = await getAllQuizzes();
      setQuizzes(fetchedQuizzes);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch quizzes:", err);
      setError("Failed to load quizzes. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to load quizzes. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to add a new quiz
  const addQuiz = async (quiz: NewQuiz) => {
    try {
      const quizId = await addQuizToDb(quiz);
      
      if (quizId) {
        const newQuiz: Quiz = {
          ...quiz,
          id: quizId,
        };
        
        setQuizzes((prev) => [...prev, newQuiz]);
        toast({
          title: "Success",
          description: "Your quiz has been created successfully.",
        });
        return quizId;
      } 
      return null;
    } catch (err) {
      console.error("Failed to add quiz:", err);
      toast({
        title: "Error",
        description: "Failed to create quiz. Please try again later.",
        variant: "destructive",
      });
      return null;
    }
  };

  // Function to get a quiz by ID
  const getQuiz = async (id: string) => {
    try {
      // First check if we have it cached
      const cachedQuiz = quizzes.find((quiz) => quiz.id === id);
      if (cachedQuiz) return cachedQuiz;
      
      // If not, fetch from database
      const fetchedQuiz = await getQuizById(id);
      return fetchedQuiz || undefined;
    } catch (err) {
      console.error(`Failed to get quiz ${id}:`, err);
      toast({
        title: "Error",
        description: "Failed to load quiz. Please try again later.",
        variant: "destructive",
      });
      return undefined;
    }
  };

  return (
    <QuizContext.Provider value={{ 
      quizzes, 
      loading, 
      error, 
      addQuiz, 
      getQuiz, 
      refreshQuizzes 
    }}>
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
