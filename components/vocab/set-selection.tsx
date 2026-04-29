import React, { useState } from 'react';
import { GraduationCap, LayoutGrid, BookOpen, Play, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

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
  onSelectSets: (setIds: (string | number)[]) => void;
}

export function SetSelection({ wordSets, onSelectSets }: SetSelectionProps) {
  const [selected, setSelected] = useState<Set<string | number>>(new Set());

  const toggleSet = (id: string | number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (id === 'all') {
        // If "all" is being toggled, either select all or deselect all
        if (next.has('all')) {
          next.clear();
        } else {
          next.clear();
          next.add('all');
        }
      } else {
        // Remove "all" if it was selected, then toggle individual
        next.delete('all');
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        // If all individual sets are selected, switch to "all"
        if (next.size === wordSets.length) {
          next.clear();
          next.add('all');
        }
      }
      return next;
    });
  };

  const handleStart = () => {
    if (selected.size === 0) return;
    onSelectSets(Array.from(selected));
  };

  const isSelected = (id: string | number) => {
    if (selected.has('all') && id !== 'all') return true;
    return selected.has(id);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 font-sans relative">
      <div className="absolute top-6 right-6 flex gap-2">
        <ThemeToggle />
      </div>
      <header className="mb-12 text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-primary rounded-xl text-primary-foreground">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">The Game</h1>
        </div>
        <p className="text-muted-foreground text-lg">Select word lists to practice</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl">
        {/* All Words toggle */}
        <Card
          onClick={() => toggleSet('all')}
          className={cn(
            "cursor-pointer transition-all hover:scale-[1.02] group relative overflow-hidden",
            isSelected('all')
              ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
              : "hover:shadow-lg hover:border-primary/50"
          )}
        >
          <CardContent className="p-6 flex items-center gap-4">
            <div className={cn(
              "p-3 rounded-2xl transition-colors",
              isSelected('all') ? "bg-primary text-primary-foreground" : "bg-secondary group-hover:bg-primary/10"
            )}>
              <LayoutGrid className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">All Words</h3>
              <p className="text-muted-foreground text-sm">All lists combined</p>
            </div>
            <div className={cn(
              "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
              isSelected('all')
                ? "border-primary bg-primary text-primary-foreground"
                : "border-muted-foreground/30"
            )}>
              {isSelected('all') && <Check className="w-4 h-4" />}
            </div>
          </CardContent>
        </Card>

        {wordSets.map(set => (
          <Card
            key={set.id}
            onClick={() => toggleSet(set.id)}
            className={cn(
              "cursor-pointer transition-all hover:scale-[1.02] group relative overflow-hidden",
              isSelected(set.id)
                ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                : "hover:shadow-lg hover:border-primary/50"
            )}
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div className={cn(
                "p-3 rounded-2xl transition-colors",
                isSelected(set.id) ? "bg-primary text-primary-foreground" : "bg-secondary group-hover:bg-primary/10"
              )}>
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold">{set.label}</h3>
                <p className="text-muted-foreground text-sm">{set.words.length} words</p>
              </div>
              <div className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                isSelected(set.id)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground/30"
              )}>
                {isSelected(set.id) && <Check className="w-4 h-4" />}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Floating start button */}
      <div className={cn(
        "fixed bottom-8 transition-all duration-300",
        selected.size > 0
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      )}>
        <Button
          onClick={handleStart}
          size="lg"
          className="gap-2 rounded-full shadow-2xl px-8 text-lg h-14"
        >
          <Play className="w-5 h-5" />
          Start with {selected.has('all') ? 'All Words' : `${selected.size} list${selected.size !== 1 ? 's' : ''}`}
        </Button>
      </div>
    </div>
  );
}
