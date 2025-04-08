
import React from 'react';
import QuizCard from '../components/QuizCard';
import { useQuiz } from '../contexts/QuizContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const QuizList = () => {
  const { quizzes, loading, error, refreshQuizzes } = useQuiz();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-quiz-secondary/30 py-12 px-4">
      <div className="container max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-quiz-primary mb-2">Available Quizzes</h1>
            <p className="text-gray-600">Select a quiz to start playing</p>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Button 
              onClick={() => refreshQuizzes()} 
              variant="outline"
              disabled={loading}
            >
              Refresh
            </Button>
            <Button 
              onClick={() => navigate('/create')} 
              className="bg-quiz-primary hover:bg-quiz-primary/90"
            >
              Create New Quiz
            </Button>
          </div>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border rounded-lg p-6 shadow-sm">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-8 w-1/3" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4 text-red-600">Something Went Wrong</h2>
            <p className="text-gray-600 mb-8">{error}</p>
            <Button 
              onClick={() => refreshQuizzes()}
              className="bg-quiz-primary hover:bg-quiz-primary/90"
            >
              Try Again
            </Button>
          </div>
        ) : quizzes.length > 0 ? (
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
