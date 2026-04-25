"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { INITIAL_DATA } from "@/lib/data";

// Sub-components
import { SetSelection } from './vocab/set-selection';
import { AppHeader } from './vocab/app-header';
import { Flashcard } from './vocab/flashcard';
import { QuizInput } from './vocab/quiz-input';
import { StudyControls } from './vocab/study-controls';
import { StatsView } from './vocab/stats-view';

interface Word {
  id: number;
  word: string;
  definition: string;
}

const checkAnswer = (userText: string, targetText: string) => {
  const cleanSegment = (s: string) => s.replace(/[.;!]/g, '').trim().toLowerCase();
  const getParts = (str: string) => {
    return str.split(/,|\bor\b/g)
      .map(cleanSegment)
      .filter(s => s.length > 0);
  };
  const userParts = getParts(userText);
  const targetParts = getParts(targetText);
  if (userParts.length === 0) return false;
  
  if (userParts.length !== targetParts.length) return false;
  return targetParts.every(part => userParts.includes(part));
};

export default function VocabApp() {
  const [showStats, setShowStats] = useState(false);
  const [selectedSet, setSelectedSet] = useState<string | number | null>(null);
  const [cards, setCards] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Load mastery from local storage on mount
  const [mastery, setMastery] = useState<Record<number, number>>({});

  useEffect(() => {
    const saved = localStorage.getItem('vocab-mastery');
    if (saved) {
      try {
        setMastery(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse mastery", e);
      }
    } else {
      const initial: Record<number, number> = {};
      INITIAL_DATA.forEach(c => initial[c.id] = 0);
      setMastery(initial);
    }
  }, []);

  // Save mastery whenever it changes
  useEffect(() => {
    if (Object.keys(mastery).length > 0) {
      localStorage.setItem('vocab-mastery', JSON.stringify(mastery));
    }
  }, [mastery]);

  const [mode, setMode] = useState<'study' | 'quiz'>('study'); 
  const [quizStatus, setQuizStatus] = useState<'idle' | 'playing' | 'review'>('idle'); 
  const [timeLeft, setTimeLeft] = useState(25);
  const [inputValue, setInputValue] = useState('');
  const [score, setScore] = useState(0);
  const [showSuccessPulse, setShowSuccessPulse] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const wordSets = useMemo(() => {
    const sets = [];
    for (let i = 0; i < INITIAL_DATA.length; i += 10) {
      sets.push({
        id: (i / 10) + 1,
        words: INITIAL_DATA.slice(i, i + 10),
        label: `Set ${(i / 10) + 1}`
      });
    }
    return sets;
  }, []);

  const handleSelectSet = (setId: string | number) => {
    if (setId === 'all') {
      setCards(INITIAL_DATA);
      setSelectedSet('all');
    } else {
      const foundSet = wordSets.find(s => s.id === setId);
      if (foundSet) {
        setCards(foundSet.words);
        setSelectedSet(setId);
      }
    }
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const pickNextSmartIndex = useCallback(() => {
    if (cards.length === 0) return 0;
    const currentId = cards[currentIndex]?.id;
    const candidates = cards.map((c, idx) => ({ ...c, idx }));
    const sorted = candidates.sort((a, b) => {
      const diff = (mastery[a.id] || 0) - (mastery[b.id] || 0);
      if (diff !== 0) return diff;
      return Math.random() - 0.5;
    });
    const next = sorted[0].id === currentId ? (sorted[1] || sorted[0]) : sorted[0];
    return next.idx;
  }, [cards, currentIndex, mastery]);

  const handleShuffle = useCallback(() => {
    if (cards.length <= 1) return;
    setIsFlipped(false);
    setCards(prev => {
      const shuffled = [...prev];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
    setCurrentIndex(0);
  }, [cards.length]);

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((prev) => (prev + 1) % cards.length), 150);
  }, [cards.length]);

  const handlePrev = useCallback(() => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length), 150);
  }, [cards.length]);

  const handleFlip = useCallback(() => setIsFlipped(prev => !prev), []);

  const handleReset = () => {
    setMode('study');
    setIsFlipped(false);
    setCurrentIndex(0);
    setQuizStatus('idle');
    setInputValue('');
  };

  const startQuiz = () => {
    setMode('quiz');
    setQuizStatus('playing');
    setScore(0);
    setTimeLeft(25);
    setInputValue('');
    setIsFlipped(false);
  };

  const handleQuizFail = useCallback(() => {
    setQuizStatus('review');
    setIsFlipped(true);
    const currentId = cards[currentIndex].id;
    setMastery(prev => ({ ...prev, [currentId]: Math.max(0, (prev[currentId] || 0) - 2) }));
  }, [cards, currentIndex]);

  const advanceToNext = useCallback(() => {
    setInputValue('');
    setTimeLeft(25);
    setIsFlipped(false);
    setTimeout(() => {
      setQuizStatus('playing');
      setCurrentIndex(pickNextSmartIndex());
    }, 300); 
  }, [pickNextSmartIndex]);

  const handleSuccess = useCallback(() => {
    setShowSuccessPulse(true);
    setScore(s => s + 1);
    const currentId = cards[currentIndex].id;
    setMastery(prev => ({ ...prev, [currentId]: (prev[currentId] || 0) + 1 }));
    setTimeout(() => {
      setShowSuccessPulse(false);
      advanceToNext();
    }, 300);
  }, [cards, currentIndex, advanceToNext]);

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quizStatus === 'review') {
        advanceToNext();
        return;
    }
    if (!checkAnswer(inputValue, cards[currentIndex].definition)) {
        handleQuizFail();
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (mode === 'quiz' && quizStatus === 'playing' && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && quizStatus === 'playing') {
      handleQuizFail();
    }
    return () => clearInterval(interval);
  }, [timeLeft, quizStatus, mode, handleQuizFail]);

  useEffect(() => {
    if (mode === 'quiz' && quizStatus === 'playing' && inputValue.length > 0 && !showSuccessPulse) {
      if (checkAnswer(inputValue, cards[currentIndex].definition)) {
        handleSuccess();
      }
    }
  }, [inputValue, currentIndex, mode, quizStatus, cards, handleSuccess, showSuccessPulse]);

  useEffect(() => {
    if (mode === 'quiz' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex, mode, quizStatus]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedSet === null) return;
      if (mode === 'study') {
        if (e.key === 'ArrowRight') handleNext();
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleFlip();
        }
      } else if (mode === 'quiz' && quizStatus === 'review') {
        if (e.key === 'Enter') {
          e.preventDefault();
          advanceToNext();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isFlipped, cards, mode, quizStatus, selectedSet, handleNext, handlePrev, handleFlip, advanceToNext]);

  if (showStats) {
    return <StatsView mastery={mastery} onBack={() => setShowStats(false)} />;
  }

  if (selectedSet === null) {
    return <SetSelection wordSets={wordSets} onSelectSet={handleSelectSet} onShowStats={() => setShowStats(true)} />;
  }

  return (
    <div className={cn(
      "min-h-screen transition-all duration-500 flex flex-col items-center justify-center p-4 font-sans",
      mode === 'quiz' ? (quizStatus === 'review' ? 'bg-destructive/10' : 'bg-primary/5') : 'bg-background'
    )}>
      
      <AppHeader 
        mode={mode}
        selectedSet={selectedSet}
        score={score}
        timeLeft={timeLeft}
        quizStatus={quizStatus}
        onBack={() => setSelectedSet(null)}
        onStartQuiz={startQuiz}
        onReset={handleReset}
      />

      <div className="w-full max-w-xl perspective-1000 relative">
        {mode === 'study' && (
          <div className="flex justify-between items-center mb-4 px-2">
            <span className="font-medium text-muted-foreground text-xs tracking-wider">
              CARD {currentIndex + 1} / {cards.length}
            </span>
            <Badge variant="outline" className="text-[10px] gap-1">
               Mastery: {mastery[cards[currentIndex]?.id] || 0}
            </Badge>
          </div>
        )}

        <Flashcard
          word={cards[currentIndex]?.word}
          definition={cards[currentIndex]?.definition}
          isFlipped={isFlipped}
          mode={mode}
          quizStatus={quizStatus}
          showSuccessPulse={showSuccessPulse}
          onFlip={handleFlip}
          onReviewAdvance={advanceToNext}
        />

        {mode === 'quiz' && (
          <QuizInput 
            inputValue={inputValue}
            setInputValue={setInputValue}
            quizStatus={quizStatus}
            showSuccessPulse={showSuccessPulse}
            onSubmit={handleQuizSubmit}
            inputRef={inputRef}
          />
        )}

        {mode === 'study' && (
          <StudyControls 
            onPrev={handlePrev}
            onNext={handleNext}
            onShuffle={handleShuffle}
          />
        )}
      </div>
    </div>
  );
}
