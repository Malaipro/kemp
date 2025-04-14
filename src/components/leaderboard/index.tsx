
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ParticipantTable } from './ParticipantTable';
import { ActivityList } from './ActivityList';
import { activities } from './data';
import { supabase } from '@/integrations/supabase/client';
import { Participant } from '@/types/leaderboard';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';

export const Leaderboard: React.FC = () => {
  const isMobile = useIsMobile();

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

  return (
    <section id="leaderboard" className="kamp-section bg-kamp-secondary py-4 md:py-16">
      <div className="kamp-container">
        <div className="section-heading reveal-on-scroll">
          <span className="inline-block text-kamp-accent font-semibold mb-1 text-sm md:text-base">Лидерборд</span>
          <h2 className="text-kamp-dark text-xl md:text-3xl">Соревнуйся и побеждай</h2>
          {!isMobile && (
            <p className="text-gray-400 text-sm md:text-base">
              КЭМП — это не только саморазвитие, но и соревнование. 
              Зарабатывай баллы, поднимайся в рейтинге и получи награду в конце курса.
            </p>
          )}
        </div>

        <div className="mt-4 md:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
          {/* Leaderboard Table */}
          <div className="reveal-on-scroll">
            {isLoading ? (
              <div className="space-y-2 md:space-y-4">
                <Skeleton className="h-8 md:h-12 w-full" />
                <Skeleton className="h-6 md:h-10 w-full" />
                <Skeleton className="h-6 md:h-10 w-full" />
                <Skeleton className="h-6 md:h-10 w-full" />
              </div>
            ) : error ? (
              <div className="p-2 md:p-4 text-red-500 bg-red-50 rounded-md text-xs md:text-base">
                Произошла ошибка при загрузке данных. Пожалуйста, попробуйте позже.
              </div>
            ) : (
              <ParticipantTable participants={participants || []} />
            )}
          </div>

          {/* How to earn points */}
          <div className="reveal-on-scroll">
            <ActivityList activities={activities} />
          </div>
        </div>
      </div>
    </section>
  );
};
