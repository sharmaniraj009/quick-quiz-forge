
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QuizProvider } from "./contexts/QuizContext";
import Index from "./pages/Index";
import Create from "./pages/Create";
import QuizList from "./pages/QuizList";
import Quiz from "./pages/Quiz";
import NotFound from "./pages/NotFound";
import NavBar from "./components/NavBar";

// Initialize the query client outside of the component
const queryClient = new QueryClient();

// Make sure App is defined as a proper function component
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <QuizProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <NavBar />
            <div className="pt-4">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/create" element={<Create />} />
                <Route path="/quizzes" element={<QuizList />} />
                <Route path="/quiz/:id" element={<Quiz />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </QuizProvider>
    </QueryClientProvider>
  );
};

export default App;
