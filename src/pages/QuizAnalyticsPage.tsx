
import React from 'react';
import QuizAnalytics from '../components/QuizAnalytics';

const QuizAnalyticsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-quiz-secondary/30 py-12 px-4">
      <div className="container max-w-5xl mx-auto">
        <QuizAnalytics />
      </div>
    </div>
  );
};

export default QuizAnalyticsPage;
