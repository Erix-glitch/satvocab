import React from 'react';
import { HelpCircle, Play } from 'lucide-react';
import { cn } from "@/lib/utils";

interface FlashcardProps {
  word?: string;
  definition?: string;
  isFlipped: boolean;
  mode: 'study' | 'quiz';
  quizStatus: 'idle' | 'playing' | 'review';
  showSuccessPulse: boolean;
  onFlip?: () => void;
}

export function Flashcard({
  word,
  definition,
  isFlipped,
  mode,
  quizStatus,
  showSuccessPulse,
  onFlip
}: FlashcardProps) {
  return (
    <div 
      className="relative w-full aspect-3/2 mb-8 cursor-pointer"
      onClick={mode === 'study' ? onFlip : undefined}
    >
      <div 
        className={cn(
          "w-full h-full transition-all duration-500 preserve-3d shadow-xl rounded-xl",
          isFlipped ? 'rotate-y-180' : '',
          showSuccessPulse ? 'scale-105 ring-4 ring-green-400' : ''
        )}
      >
        {/* Front Face */}
        <div className="absolute w-full h-full backface-hidden bg-card border rounded-xl flex flex-col items-center justify-center p-8 text-center shadow-sm">
          <span className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Word</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-card-foreground break-words max-w-full">
            {word}
          </h2>
          {mode === 'study' && (
            <p className="absolute bottom-6 text-muted-foreground text-xs flex items-center gap-1 opacity-60">
              <HelpCircle className="w-4 h-4" /> Tap or Space to Flip
            </p>
          )}
        </div>

        {/* Back Face */}
        <div 
          className={cn(
            "absolute w-full h-full backface-hidden rounded-xl flex flex-col items-center justify-center p-8 text-center rotate-y-180 border shadow-sm",
            quizStatus === 'review' ? 'bg-destructive text-destructive-foreground' : 'bg-primary text-primary-foreground'
          )}
        >
          <span className={cn(
            "text-xs font-bold uppercase tracking-widest mb-4 opacity-80",
          )}>
            {quizStatus === 'review' ? `MISTAKE: ${word}` : 'Definition'}
          </span>
          <p className="text-2xl md:text-3xl font-bold leading-tight">
            &quot;{definition}&quot;
          </p>
          
          {quizStatus === 'review' && (
             <div className="mt-8 flex flex-col items-center gap-2 animate-bounce">
               <p className="text-sm font-medium opacity-90">Press Enter to continue</p>
               <Play className="w-5 h-5 fill-current" />
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
