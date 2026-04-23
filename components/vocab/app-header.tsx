import React from 'react';
import { ChevronLeft, GraduationCap, Timer, XCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

interface AppHeaderProps {
  mode: 'study' | 'quiz';
  selectedSet: string | number | null;
  score: number;
  timeLeft: number;
  quizStatus: 'idle' | 'playing' | 'review';
  onBack: () => void;
  onStartQuiz: () => void;
  onReset: () => void;
}

export function AppHeader({
  mode,
  selectedSet,
  score,
  timeLeft,
  quizStatus,
  onBack,
  onStartQuiz,
  onReset
}: AppHeaderProps) {
  return (
    <header className="mb-6 text-center w-full max-w-xl">
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onBack} 
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </Button>
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-bold">The Game</h1>
        </div>
        <ThemeToggle />
      </div>
      
      {mode === 'study' ? (
        <div className="flex flex-col gap-4 items-center">
          <Badge variant="secondary" className="text-sm px-4 py-1">
            Studying: {selectedSet === 'all' ? 'All Words' : `Set ${selectedSet}`}
          </Badge>
          <Button 
            onClick={onStartQuiz}
            className="gap-2 rounded-full shadow-lg"
            size="lg"
          >
            <Timer className="w-4 h-4" /> Start Set Quiz
          </Button>
        </div>
      ) : (
         <div className="flex items-center gap-4 justify-center mt-2">
           <div className="bg-background px-4 py-2 rounded-full border flex items-center gap-2 shadow-sm">
             <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Correct</span>
             <span className="font-bold text-xl text-primary">{score}</span>
           </div>
           <div className={cn(
             "px-4 py-2 rounded-full border flex items-center gap-2 transition-all shadow-sm",
             timeLeft <= 5 && quizStatus === 'playing' 
               ? 'bg-destructive/10 border-destructive text-destructive animate-pulse' 
               : 'bg-background border-border text-foreground'
           )}>
             <Timer className="w-4 h-4" />
             <span className="font-bold text-xl font-mono w-8 text-center">{timeLeft}s</span>
           </div>
           <Button 
              variant="ghost" 
              size="icon" 
              onClick={onReset} 
              className="rounded-full hover:bg-destructive/10 hover:text-destructive" 
              title="Exit Quiz"
           >
              <XCircle className="w-5 h-5" />
           </Button>
         </div>
      )}
    </header>
  );
}
