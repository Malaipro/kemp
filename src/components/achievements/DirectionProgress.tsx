import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, Book, Award } from 'lucide-react';

interface Direction {
  id: string;
  name: string;
  description: string;
  required_activities: number;
  required_lectures: number;
  has_final_test: boolean;
  totem_name: string;
  totem_description: string;
  totem_icon: string;
}

interface DirectionProgressData {
  id: string;
  direction_id: string;
  activities_completed: number;
  lectures_completed: number;
  final_test_passed: boolean;
  progress_percentage: number;
  directions: Direction;
}

export const DirectionProgress: React.FC = () => {
  const { data: progressData, isLoading } = useQuery({
    queryKey: ['direction-progress'],
    queryFn: async (): Promise<DirectionProgressData[]> => {
      const { data, error } = await supabase
        .from('direction_progress')
        .select(`
          *,
          directions:direction_id (
            id,
            name,
            description,
            required_activities,
            required_lectures,
            has_final_test,
            totem_name,
            totem_description,
            totem_icon
          )
        `);

      if (error) throw error;
      return data || [];
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="kamp-card animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-2 bg-muted rounded"></div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-12 bg-muted rounded"></div>
                  <div className="h-12 bg-muted rounded"></div>
                  <div className="h-12 bg-muted rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Прогресс по направлениям</h2>
        <p className="text-gray-400">Отслеживайте свой прогресс в каждом направлении КЭМП</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {progressData?.map((progress) => {
          const direction = progress.directions;
          const totalRequirements = direction.required_activities + 
                                  direction.required_lectures + 
                                  (direction.has_final_test ? 1 : 0);
          const completed = progress.activities_completed + 
                          progress.lectures_completed + 
                          (progress.final_test_passed ? 1 : 0);

          return (
            <Card key={progress.id} className="kamp-card hover-lift">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-kamp-accent">{direction.name}</span>
                  <div className="text-2xl">
                    {direction.totem_icon && (
                      <span role="img" aria-label={direction.totem_name}>
                        {direction.totem_icon}
                      </span>
                    )}
                  </div>
                </CardTitle>
                <p className="text-sm text-gray-400">{direction.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Общий прогресс</span>
                    <span className="text-kamp-accent font-semibold">
                      {Math.round(progress.progress_percentage)}%
                    </span>
                  </div>
                  <Progress 
                    value={progress.progress_percentage} 
                    className="h-2"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="space-y-2">
                    <Target className="w-6 h-6 mx-auto text-kamp-accent" />
                    <div className="text-xs text-gray-400">Тренировки</div>
                    <div className="text-sm font-semibold text-white">
                      {progress.activities_completed}/{direction.required_activities}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Book className="w-6 h-6 mx-auto text-kamp-accent" />
                    <div className="text-xs text-gray-400">Лекции</div>
                    <div className="text-sm font-semibold text-white">
                      {progress.lectures_completed}/{direction.required_lectures}
                    </div>
                  </div>
                  
                  {direction.has_final_test && (
                    <div className="space-y-2">
                      <Trophy className="w-6 h-6 mx-auto text-kamp-accent" />
                      <div className="text-xs text-gray-400">Испытание</div>
                      <div className="text-sm font-semibold text-white">
                        {progress.final_test_passed ? '✓' : '—'}
                      </div>
                    </div>
                  )}
                </div>

                {progress.progress_percentage >= 100 && (
                  <div className="mt-4 p-3 bg-kamp-accent/20 rounded-lg border border-kamp-accent/30">
                    <div className="flex items-center space-x-2">
                      <Award className="w-5 h-5 text-kamp-accent" />
                      <div>
                        <div className="text-sm font-semibold text-kamp-accent">
                          Тотем получен: {direction.totem_name}
                        </div>
                        <div className="text-xs text-gray-300">
                          {direction.totem_description}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};