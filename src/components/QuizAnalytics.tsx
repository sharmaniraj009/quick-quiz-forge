
import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useQuiz } from '../contexts/QuizContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { QuizAnalytics as QuizAnalyticsType, QuestionAnalytics } from '../types/quiz';

// Chart colors
const COLORS = ['#8B5CF6', '#10B981', '#EF4444', '#F59E0B'];

const QuizAnalytics: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getQuiz, getQuizAttempts } = useQuiz();

  const quiz = getQuiz(id || '');
  const attempts = getQuizAttempts(id);

  const analytics = useMemo(() => {
    if (!quiz || attempts.length === 0) {
      return null;
    }

    const questionAnalytics: QuestionAnalytics[] = quiz.questions.map((question) => {
      const correctAnswers = attempts.filter(
        (attempt, index) => attempt.answers[index] === question.correctAnswer
      ).length;

      return {
        questionId: question.id,
        questionText: question.question,
        correctAnswers,
        totalAttempts: attempts.length,
        correctPercentage: (correctAnswers / attempts.length) * 100,
      };
    });

    const totalScores = attempts.reduce((sum, attempt) => sum + attempt.score, 0);
    const highestScore = Math.max(...attempts.map(attempt => attempt.score));
    const totalTimeSpent = attempts.reduce((sum, attempt) => sum + attempt.timeSpent, 0);

    return {
      quizId: quiz.id,
      quizTitle: quiz.title,
      attempts: attempts.length,
      averageScore: totalScores / attempts.length,
      highestScore,
      averageTimeSpent: totalTimeSpent / attempts.length,
      questionAnalytics,
    };
  }, [quiz, attempts]);

  React.useEffect(() => {
    if (!quiz) {
      toast({
        title: "Quiz Not Found",
        description: "The requested quiz could not be found",
        variant: "destructive",
      });
      navigate('/');
    } else if (attempts.length === 0) {
      toast({
        title: "No Data Available",
        description: "There are no attempts for this quiz yet",
        variant: "default",
      });
    }
  }, [quiz, navigate, toast, attempts.length]);

  if (!quiz || !analytics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Analytics Available</CardTitle>
          <CardDescription>
            There are no quiz attempts recorded for this quiz yet.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => navigate(`/quiz/${id}`)}>Take Quiz</Button>
        </CardFooter>
      </Card>
    );
  }

  const scoreDistributionData = [
    { name: 'Correct', value: analytics.averageScore },
    { name: 'Incorrect', value: quiz.questions.length - analytics.averageScore }
  ];

  const questionPerformanceData = analytics.questionAnalytics.map(q => ({
    name: q.questionText.length > 20 ? q.questionText.substring(0, 20) + '...' : q.questionText,
    correctPercentage: q.correctPercentage,
  }));

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-quiz-primary">Quiz Analytics</CardTitle>
          <CardDescription>{quiz.title}</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center justify-center bg-muted/20 rounded-lg p-4">
            <span className="text-lg text-muted-foreground">Total Attempts</span>
            <span className="text-4xl font-bold text-quiz-primary">{analytics.attempts}</span>
          </div>
          <div className="flex flex-col items-center justify-center bg-muted/20 rounded-lg p-4">
            <span className="text-lg text-muted-foreground">Avg. Score</span>
            <span className="text-4xl font-bold text-quiz-primary">
              {Math.round((analytics.averageScore / quiz.questions.length) * 100)}%
            </span>
          </div>
          <div className="flex flex-col items-center justify-center bg-muted/20 rounded-lg p-4">
            <span className="text-lg text-muted-foreground">Avg. Time</span>
            <span className="text-4xl font-bold text-quiz-primary">
              {Math.round(analytics.averageTimeSpent)}s
            </span>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Score Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ChartContainer config={{ correct: { color: '#10B981' }, incorrect: { color: '#EF4444' } }}>
              <PieChart>
                <Pie
                  data={scoreDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {scoreDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#10B981' : '#EF4444'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Question Performance</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ChartContainer config={{ percentage: { color: '#8B5CF6' } }}>
              <BarChart data={questionPerformanceData}>
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value) => [`${value}%`, 'Correct']} />
                <Bar dataKey="correctPercentage" name="Correct %" fill="#8B5CF6" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Question Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.questionAnalytics.map((q, index) => (
              <div key={q.questionId} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{index + 1}. {q.questionText}</p>
                    <p className="text-sm text-muted-foreground">
                      {q.correctAnswers} correct out of {q.totalAttempts} attempts
                    </p>
                  </div>
                  <div className={`text-lg font-semibold ${
                    q.correctPercentage >= 70 ? 'text-quiz-success' : 
                    q.correctPercentage >= 30 ? 'text-amber-500' : 'text-quiz-error'
                  }`}>
                    {Math.round(q.correctPercentage)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={() => navigate('/quizzes')}>
            Back to Quizzes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizAnalytics;
