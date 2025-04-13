
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ParticipantTable } from './ParticipantTable';
import { ActivityList } from './ActivityList';
import { activities } from './data';
import { supabase } from '@/integrations/supabase/client';
import { Participant } from '@/types/leaderboard';
import { Skeleton } from '@/components/ui/skeleton';

export const Leaderboard: React.FC = () => {
  const [isPointsVisible, setIsPointsVisible] = useState(false);

  const { data: participants, isLoading, error } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async (): Promise<Participant[]> => {
      console.log('Fetching leaderboard data from Supabase...');
      // Используем представление leaderboard, которое уже содержит ранг участников
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('rank', { ascending: true });
      
      if (error) {
        console.error('Error fetching leaderboard data:', error);
        throw new Error(error.message);
      }
      
      console.log('Leaderboard data received:', data);
      return data as Participant[];
    }
  });

  const togglePointsVisibility = () => {
    setIsPointsVisible(!isPointsVisible);
  };

  return (
    <section id="leaderboard" className="kamp-section bg-kamp-secondary">
      <div className="kamp-container">
        <div className="section-heading reveal-on-scroll">
          <span className="inline-block text-kamp-accent font-semibold mb-2">Лидерборд</span>
          <h2 className="text-kamp-dark">Соревнуйся и побеждай</h2>
          <p className="text-gray-400">
            КЭМП — это не только саморазвитие, но и соревнование. 
            Зарабатывай баллы, поднимайся в рейтинге и получи награду в конце курса.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-5 gap-8">
          {/* Leaderboard Table */}
          <div className="md:col-span-3 reveal-on-scroll">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : error ? (
              <div className="p-4 text-red-500 bg-red-50 rounded-md">
                Произошла ошибка при загрузке данных. Пожалуйста, попробуйте позже.
              </div>
            ) : (
              <ParticipantTable participants={participants || []} />
            )}
          </div>

          {/* How to earn points */}
          <div className="md:col-span-2 reveal-on-scroll">
            <ActivityList 
              activities={activities}
              isPointsVisible={isPointsVisible}
              togglePointsVisibility={togglePointsVisibility}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
