import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { QuizQuestion, NewQuiz } from '../types/quiz';
import { useQuiz } from '../contexts/QuizContext';
import { Separator } from '@/components/ui/separator';
import { Trash } from 'lucide-react';

const QuizCreationForm = () => {
  const { addQuiz } = useQuiz();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Omit<QuizQuestion, 'id'>[]>([
    {
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
    },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
      },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length > 1) {
      const newQuestions = [...questions];
      newQuestions.splice(index, 1);
      setQuestions(newQuestions);
    } else {
      toast({
        title: "Cannot Remove",
        description: "You need at least one question",
        variant: "destructive",
      });
    }
  };

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].correctAnswer = optionIndex;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!title.trim()) {
      toast({
        title: "Missing Title",
        description: "Please provide a quiz title",
        variant: "destructive",
      });
      return;
    }

    if (!description.trim()) {
      toast({
        title: "Missing Description",
        description: "Please provide a quiz description",
        variant: "destructive",
      });
      return;
    }

    // Validate questions
    let isValid = true;
    
    questions.forEach((q, index) => {
      if (!q.question.trim()) {
        toast({
          title: `Question ${index + 1} is empty`,
          description: "Please provide a question",
          variant: "destructive",
        });
        isValid = false;
      }
      
      q.options.forEach((option, optIndex) => {
        if (!option.trim()) {
          toast({
            title: `Empty option in Question ${index + 1}`,
            description: `Option ${optIndex + 1} is empty`,
            variant: "destructive",
          });
          isValid = false;
        }
      });
    });

    if (!isValid) return;

    // Create quiz
    setIsSubmitting(true);
    
    try {
      const newQuiz: NewQuiz = {
        title,
        description,
        questions: questions.map((q, index) => ({
          ...q,
          id: `${Date.now()}-${index}`,
        })),
      };

      const quizId = await addQuiz(newQuiz);
      
      if (quizId) {
        navigate('/quizzes');
      }
    } catch (error) {
      console.error("Error creating quiz:", error);
      toast({
        title: "Error",
        description: "Failed to create quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-quiz-primary">Quiz Details</CardTitle>
          <CardDescription>Enter the basic information about your quiz</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Quiz Title
            </label>
            <Input
              id="title"
              placeholder="Enter quiz title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <Textarea
              id="description"
              placeholder="Describe your quiz"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-quiz-primary">Questions</h2>
        {questions.map((question, qIndex) => (
          <Card key={qIndex} className="mb-6 border-l-4 border-l-quiz-primary">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Question {qIndex + 1}</CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveQuestion(qIndex)}
              >
                <Trash className="h-5 w-5 text-red-500" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor={`question-${qIndex}`} className="block text-sm font-medium mb-1">
                  Question Text
                </label>
                <Input
                  id={`question-${qIndex}`}
                  placeholder="Enter your question"
                  value={question.question}
                  onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                />
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-3">
                <p className="text-sm font-medium">Answer Options</p>
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex items-center gap-3">
                    <div className="flex-1">
                      <Input
                        placeholder={`Option ${oIndex + 1}`}
                        value={option}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id={`correct-${qIndex}-${oIndex}`}
                        name={`correct-${qIndex}`}
                        checked={question.correctAnswer === oIndex}
                        onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                        className="mr-2"
                      />
                      <label htmlFor={`correct-${qIndex}-${oIndex}`} className="text-sm">
                        Correct
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-4 mb-8">
        <Button
          type="button"
          onClick={handleAddQuestion}
          variant="outline"
          className="border-quiz-primary text-quiz-primary hover:bg-quiz-secondary"
        >
          Add Question
        </Button>
        <Button 
          type="submit" 
          className="bg-quiz-primary hover:bg-quiz-primary/90"
        >
          Create Quiz
        </Button>
      </div>
    </form>
  );
};

export default QuizCreationForm;
