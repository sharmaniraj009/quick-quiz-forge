
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useQuiz } from '../contexts/QuizContext';
import { Progress } from '@/components/ui/progress';
import { QuizAttempt } from '../types/quiz';
import { v4 as uuidv4 } from 'uuid';

const QuizTaking = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getQuiz, addQuizAttempt } = useQuiz();
  const { toast } = useToast();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timer, setTimer] = useState(15);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [startTime] = useState<number>(Date.now());
  const [timeSpent, setTimeSpent] = useState(0);

  const quiz = getQuiz(id || '');
  
  useEffect(() => {
    if (!quiz) {
      toast({
        title: "Quiz Not Found",
        description: "The requested quiz could not be found",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [quiz, navigate, toast]);

  useEffect(() => {
    if (!quiz || showResults) return;
    
    setTimer(15);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1 && !isAnswerRevealed) {
          clearInterval(interval);
          revealAnswer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [currentQuestionIndex, quiz, showResults, isAnswerRevealed]);

  // Update time spent
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  if (!quiz) return null;

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleOptionSelect = (index: number) => {
    if (isAnswerRevealed) return;
    setSelectedOption(index);
    setAnswers([...answers.slice(0, currentQuestionIndex), index]);
  };

  const revealAnswer = () => {
    setIsAnswerRevealed(true);
    
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(score + 1);
      toast({
        title: "Correct!",
        description: "Good job!",
        variant: "default",
        className: "bg-quiz-success text-white",
      });
    } else {
      toast({
        title: "Incorrect",
        description: `The correct answer was: ${currentQuestion.options[currentQuestion.correctAnswer]}`,
        variant: "default",
        className: "bg-quiz-error text-white",
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
    } else {
      setShowResults(true);
      
      // Save quiz attempt
      const quizAttempt: QuizAttempt = {
        id: uuidv4(),
        quizId: quiz.id,
        date: new Date().toISOString(),
        score,
        totalQuestions: quiz.questions.length,
        answers,
        timeSpent,
      };
      
      addQuizAttempt(quizAttempt);
      
      toast({
        title: "Quiz Completed!",
        description: "Your results have been saved.",
        variant: "default",
      });
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setShowResults(false);
    setAnswers([]);
    setIsAnswerRevealed(false);
    setTimeSpent(0);
  };

  const handleViewAnalytics = () => {
    navigate(`/analytics/${quiz.id}`);
  };

  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  if (showResults) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-quiz-primary">Quiz Results</CardTitle>
          <CardDescription>
            {quiz.title} - You scored {score} out of {quiz.questions.length}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center my-8">
            <div className="text-6xl font-bold mb-2">{Math.round((score / quiz.questions.length) * 100)}%</div>
            <p className="text-lg text-muted-foreground">
              {score === quiz.questions.length 
                ? "Perfect score! Amazing job!" 
                : score > quiz.questions.length / 2 
                  ? "Well done!" 
                  : "Better luck next time!"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Time taken: {Math.floor(timeSpent / 60)}m {timeSpent % 60}s
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Question Summary</h3>
            
            {quiz.questions.map((question, index) => (
              <div key={index} className="flex items-center border rounded-lg p-4">
                <div className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center mr-3 ${
                  answers[index] === question.correctAnswer ? "bg-quiz-success" : "bg-quiz-error"
                } text-white font-medium`}>
                  {answers[index] === question.correctAnswer ? "✓" : "✗"}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{question.question}</p>
                  <p className="text-sm text-muted-foreground">
                    Your answer: {question.options[answers[index] ?? 0]}
                  </p>
                  {answers[index] !== question.correctAnswer && (
                    <p className="text-sm text-quiz-success">
                      Correct answer: {question.options[question.correctAnswer]}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 justify-between">
          <div>
            <Button variant="outline" onClick={() => navigate('/')} className="mr-2">
              Back to Home
            </Button>
            <Button 
              variant="outline" 
              onClick={handleViewAnalytics}
            >
              View Analytics
            </Button>
          </div>
          <Button 
            onClick={handleRetry}
            className="bg-quiz-primary hover:bg-quiz-primary/90"
          >
            Try Again
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </span>
          <span className="text-sm font-medium">
            Time: {timer}s
          </span>
        </div>
        <Progress value={progress} className="h-2 bg-quiz-secondary" />
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-quiz-primary">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3">
          {currentQuestion.options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className={`justify-start text-left h-auto py-3 px-4 border-2 ${
                selectedOption === index 
                  ? isAnswerRevealed 
                    ? index === currentQuestion.correctAnswer 
                      ? "border-quiz-success bg-green-50" 
                      : "border-quiz-error bg-red-50"
                    : "border-quiz-primary bg-quiz-secondary"
                  : isAnswerRevealed && index === currentQuestion.correctAnswer
                    ? "border-quiz-success bg-green-50"
                    : ""
              }`}
              onClick={() => handleOptionSelect(index)}
              disabled={isAnswerRevealed}
            >
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                  selectedOption === index && !isAnswerRevealed 
                    ? "bg-quiz-primary text-white" 
                    : "bg-muted"
                }`}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span>{option}</span>
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
        >
          Exit Quiz
        </Button>
        
        {isAnswerRevealed ? (
          <Button 
            onClick={handleNextQuestion}
            className="bg-quiz-primary hover:bg-quiz-primary/90"
          >
            {currentQuestionIndex < quiz.questions.length - 1 ? "Next Question" : "See Results"}
          </Button>
        ) : (
          <Button 
            onClick={revealAnswer}
            disabled={selectedOption === null}
            className="bg-quiz-primary hover:bg-quiz-primary/90"
          >
            Submit Answer
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizTaking;
