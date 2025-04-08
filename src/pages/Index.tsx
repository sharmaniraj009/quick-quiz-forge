
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuiz } from '../contexts/QuizContext';
import QuizCard from '../components/QuizCard';

const Index = () => {
  const navigate = useNavigate();
  const { quizzes } = useQuiz();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-quiz-secondary/30">
      <div className="container py-12 px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-quiz-primary mb-4">
            Quick Quiz Forge
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create and take quizzes in seconds. No login required.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => navigate('/create')}
              className="w-full sm:w-auto bg-quiz-primary hover:bg-quiz-primary/90 text-lg py-6 px-8"
            >
              Create a Quiz
            </Button>
            <Button
              onClick={() => navigate('/quizzes')}
              variant="outline"
              className="w-full sm:w-auto border-quiz-primary text-quiz-primary hover:bg-quiz-secondary text-lg py-6 px-8"
            >
              Take a Quiz
            </Button>
          </div>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-md transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-quiz-primary rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">1</div>
                  <h3 className="text-lg font-bold mb-2">Create</h3>
                  <p className="text-gray-600">
                    Create your own quiz with customized questions and answers
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-quiz-primary rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">2</div>
                  <h3 className="text-lg font-bold mb-2">Share</h3>
                  <p className="text-gray-600">
                    All quizzes are publicly available for anyone to take
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-quiz-primary rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">3</div>
                  <h3 className="text-lg font-bold mb-2">Play</h3>
                  <p className="text-gray-600">
                    Test your knowledge or challenge your friends
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Featured Quizzes</h2>
            <Button 
              variant="link" 
              onClick={() => navigate('/quizzes')}
              className="text-quiz-primary"
            >
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.slice(0, 3).map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
            
            {quizzes.length === 0 && (
              <Card className="col-span-full p-8 text-center">
                <p className="text-gray-500 mb-4">No quizzes available yet.</p>
                <Button 
                  onClick={() => navigate('/create')}
                  className="bg-quiz-primary hover:bg-quiz-primary/90"
                >
                  Create Your First Quiz
                </Button>
              </Card>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
