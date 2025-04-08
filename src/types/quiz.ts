
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

// Type for creating a new quiz (without ID)
export type NewQuiz = Omit<Quiz, "id">;
