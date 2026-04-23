"use client";

import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, TrendingUp, Award, BookOpen } from 'lucide-react';
import { INITIAL_DATA } from "@/lib/data";

interface StatsViewProps {
  mastery: Record<number, number>;
  onBack: () => void;
}

export function StatsView({ mastery, onBack }: StatsViewProps) {
  const stats = useMemo(() => {
    const totalWords = INITIAL_DATA.length;
    const mastered = Object.values(mastery).filter(m => m >= 3).length;
    const learning = Object.values(mastery).filter(m => m > 0 && m < 3).length;
    const unstarted = totalWords - mastered - learning;

    const distribution = [
      { name: 'Mastered (3+)', value: mastered, color: 'oklch(0.627 0.265 149.215)' }, // Greenish
      { name: 'Learning (1-2)', value: learning, color: 'oklch(0.769 0.188 70.08)' },    // Yellowish
      { name: 'Unstarted', value: unstarted, color: 'oklch(0.705 0.015 286.067)' }      // Grayish
    ];

    // Prepare data for mastery levels bar chart
    const masteryLevels = [0, 1, 2, 3, 4, 5].map(level => ({
      level: `Level ${level}${level === 5 ? '+' : ''}`,
      count: Object.values(mastery).filter(m => (level === 5 ? m >= 5 : m === level)).length
    }));

    return { totalWords, mastered, learning, unstarted, distribution, masteryLevels };
  }, [mastery]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ChevronLeft className="w-4 h-4" /> Back to App
        </Button>
        <h1 className="text-3xl font-bold">Progress Dashboard</h1>
        <div className="w-24"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground uppercase font-bold tracking-wider">Total Words</p>
              <p className="text-2xl font-bold">{stats.totalWords}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-full">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground uppercase font-bold tracking-wider">Mastered</p>
              <p className="text-2xl font-bold">{stats.mastered}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-full">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground uppercase font-bold tracking-wider">Mastery Rate</p>
              <p className="text-2xl font-bold">{Math.round((stats.mastered / stats.totalWords) * 100)}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle>Mastery Distribution</CardTitle>
          </CardHeader>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
             {stats.distribution.map((d) => (
               <div key={d.name} className="flex items-center gap-2 text-xs font-medium">
                 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                 {d.name}
               </div>
             ))}
          </div>
        </Card>

        <Card className="p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle>Mastery Levels</CardTitle>
          </CardHeader>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.masteryLevels}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.705 0.015 286.067 / 0.2)" />
                <XAxis dataKey="level" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'oklch(0.705 0.015 286.067 / 0.1)' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="oklch(0.21 0.006 285.885)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
