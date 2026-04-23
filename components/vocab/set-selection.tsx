import React from 'react';
import { GraduationCap, LayoutGrid, BookOpen, BarChart3 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "./theme-toggle";

interface Word {
  id: number;
  word: string;
  definition: string;
}

interface WordSet {
  id: number | string;
  words: Word[];
  label: string;
}

interface SetSelectionProps {
  wordSets: WordSet[];
  onSelectSet: (setId: string | number) => void;
  onShowStats: () => void;
}

export function SetSelection({ wordSets, onSelectSet, onShowStats }: SetSelectionProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 font-sans relative">
      <div className="absolute top-6 right-6 flex gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onShowStats} 
          className="rounded-full w-10 h-10"
          title="View Stats"
        >
          <BarChart3 className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full w-10 h-10"
          onClick={() => localStorage.clear()}
          title="Reset LocalStorage"
        >
          Reset
        </Button>
        <ThemeToggle />
      </div>
      <header className="mb-12 text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-primary rounded-xl text-primary-foreground">
            < GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">The Game</h1>
        </div>
        <p className="text-muted-foreground text-lg">Choose a word set</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        <Button 
          variant="default"
          size="lg"
          onClick={() => onSelectSet('all')}
          className="h-auto p-6 flex flex-col items-start gap-4 text-left hover:scale-[1.02] transition-transform"
        >
          <div className="p-3 bg-primary-foreground/20 rounded-2xl">
            <LayoutGrid className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">All Words</h3>
            <p className="opacity-80 text-sm">All lists</p>
          </div>
        </Button>

        {wordSets.map(set => (
          <Card 
            key={set.id}
            onClick={() => onSelectSet(set.id)}
            className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] hover:border-primary/50 group"
          >
            <CardContent className="p-6 flex flex-col items-start gap-4">
              <div className="p-3 bg-secondary rounded-2xl group-hover:bg-primary/10 transition-colors">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{set.label}</h3>
                <p className="text-muted-foreground text-sm">{set.words.length} words</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
