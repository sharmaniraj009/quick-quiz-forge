
import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="inline-flex items-center gap-2 text-quiz-primary hover:opacity-90 transition-opacity">
      <div className="bg-quiz-primary text-white rounded-lg p-2 font-bold text-lg">QF</div>
      <span className="text-xl font-bold hidden md:inline">QuizForge</span>
    </Link>
  );
};

export default Logo;
