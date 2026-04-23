import React from 'react';
import { ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface StudyControlsProps {
  onPrev: () => void;
  onNext: () => void;
  onShuffle: () => void;
}

export function StudyControls({
  onPrev,
  onNext,
  onShuffle
}: StudyControlsProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Button variant="outline" size="icon" className="h-16 w-16 rounded-full shadow-md" onClick={onPrev}>
        <ChevronLeft className="w-8 h-8" />
      </Button>
      <Button variant="secondary" className="h-14 px-8 rounded-xl font-bold gap-2 shadow-sm flex-1" onClick={onShuffle}>
        <Shuffle className="w-4 h-4" /> Shuffle
      </Button>
      <Button variant="outline" size="icon" className="h-16 w-16 rounded-full shadow-md" onClick={onNext}>
        <ChevronRight className="w-8 h-8" />
      </Button>
    </div>
  );
}
