
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Quiz } from '../types/quiz';

interface QuizCardProps {
  quiz: Quiz;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-quiz-primary">{quiz.title}</CardTitle>
        <CardDescription>{quiz.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {quiz.questions.length} {quiz.questions.length === 1 ? 'question' : 'questions'}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={() => navigate(`/quiz/${quiz.id}`)} 
          className="bg-quiz-primary hover:bg-quiz-primary/90"
        >
          Start Quiz
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuizCard;
