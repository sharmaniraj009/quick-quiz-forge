
import React from 'react';
import QuizCard from '../components/QuizCard';
import { useQuiz } from '../contexts/QuizContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const QuizList = () => {
  const { quizzes } = useQuiz();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-quiz-secondary/30 py-12 px-4">
      <div className="container max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-quiz-primary mb-2">Available Quizzes</h1>
            <p className="text-gray-600">Select a quiz to start playing</p>
          </div>
          <Button 
            onClick={() => navigate('/create')} 
            className="mt-4 sm:mt-0 bg-quiz-primary hover:bg-quiz-primary/90"
          >
            Create New Quiz
          </Button>
        </div>
        
        {quizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">No Quizzes Yet</h2>
            <p className="text-gray-600 mb-8">
              Be the first to create a quiz and share it with others!
            </p>
            <Button 
              onClick={() => navigate('/create')}
              className="bg-quiz-primary hover:bg-quiz-primary/90"
            >
              Create Your First Quiz
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizList;
