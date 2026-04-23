import React, { ForwardedRef } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface QuizInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  quizStatus: 'idle' | 'playing' | 'review';
  showSuccessPulse: boolean;
  onSubmit: (e: React.FormEvent) => void;
  inputRef: ForwardedRef<HTMLInputElement>;
}

export function QuizInput({
  inputValue,
  setInputValue,
  quizStatus,
  showSuccessPulse,
  onSubmit,
  inputRef
}: QuizInputProps) {
  return (
    <div className="mb-8 h-20 flex items-center justify-center">
       {quizStatus === 'playing' ? (
          <form onSubmit={onSubmit} className="relative w-full">
            <Input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type definition(s)..."
              className={cn(
                "w-full h-16 pl-6 pr-14 text-xl shadow-lg border-2 bg-background/80 backdrop-blur-sm transition-all",
                showSuccessPulse 
                  ? 'border-green-400 bg-green-50/50' 
                  : 'border-primary/20 focus-visible:border-primary'
              )}
              autoComplete="off"
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2">
              {inputValue.length > 0 && (
                <CheckCircle className={cn(
                  "w-8 h-8 transition-colors",
                  showSuccessPulse ? 'text-green-500' : 'text-primary/30'
                )} />
              )}
            </div>
          </form>
       ) : (
          <div className="flex items-center gap-3 text-destructive bg-destructive/10 px-6 py-3 rounded-full border border-destructive/20 animate-pulse">
             <AlertCircle className="w-6 h-6" />
             <span className="text-lg font-bold uppercase tracking-tight">Reviewing Mistake</span>
          </div>
       )}
    </div>
  );
}
