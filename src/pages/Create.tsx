
import React from 'react';
import QuizCreationForm from '../components/QuizCreationForm';

const Create = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-quiz-secondary/30 py-12 px-4">
      <div className="container max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-quiz-primary mb-2 text-center">Create a New Quiz</h1>
        <p className="text-gray-600 mb-8 text-center">
          Fill in the details below to create your quiz
        </p>
        
        <QuizCreationForm />
      </div>
    </div>
  );
};

export default Create;
