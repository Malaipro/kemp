
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Activity } from '@/types/leaderboard';
import { getIconComponent } from './IconRenderer';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Video } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';

interface ActivityListProps {
  activities: Activity[];
  isPointsVisible: boolean;
  togglePointsVisibility: () => void;
}

export const ActivityList: React.FC<ActivityListProps> = ({ 
  activities: defaultActivities, 
  isPointsVisible, 
  togglePointsVisibility 
}) => {
  const isMobile = useIsMobile();
  
  const { data: activities, isLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: async (): Promise<Activity[]> => {
      console.log('Fetching activities from Supabase...');
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('points', { ascending: false });
      
      if (error) {
        console.error('Error fetching activities:', error);
        throw new Error(error.message);
      }
      
      console.log('Activities received:', data);
      return data as Activity[];
    },
    // Используем статические данные как fallback при ошибке
    initialData: defaultActivities
  });

  // Limit to top 3 for mobile
  const displayedActivities = isMobile ? (activities || []).slice(0, 3) : activities;

  return (
    <Card className="h-full border-gray-700 bg-black bg-opacity-60 text-gray-200">
      <CardHeader className={`${isMobile ? 'p-2' : 'p-6'} border-b border-gray-800`}>
        <h3 className={`font-bold text-kamp-dark ${isMobile ? 'text-sm' : 'text-base'}`}>Как заработать баллы?</h3>
      </CardHeader>
      <CardContent className={`${isMobile ? 'p-2' : 'p-6'} space-y-2 md:space-y-4`}>
        {isLoading ? (
          <>
            <Skeleton className={`${isMobile ? 'h-6' : 'h-10'} w-full`} />
            <Skeleton className={`${isMobile ? 'h-6' : 'h-10'} w-full`} />
            <Skeleton className={`${isMobile ? 'h-6' : 'h-10'} w-full`} />
          </>
        ) : (
          displayedActivities.map((activity) => (
            <div 
              key={activity.id} 
              className={`flex items-center ${isMobile ? 'p-1 text-xs' : 'p-3 text-sm'} rounded-lg hover:bg-gray-900 transition-colors`}
            >
              <div className="flex-shrink-0">
                {getIconComponent(activity.icon, isMobile ? 14 : 20)}
              </div>
              <div className="ml-2 md:ml-4 flex-grow">
                <span className="font-medium text-gray-300">{activity.title}</span>
              </div>
              <div className="text-kamp-accent font-bold">
                +{activity.points} баллов
              </div>
            </div>
          ))
        )}
        
        <div className={`mt-2 md:mt-8 pt-2 md:pt-4 border-t border-gray-800 flex items-center ${isMobile ? 'text-xs' : 'text-sm'} text-gray-400`}>
          <Video className={`${isMobile ? 'w-3 h-3 mr-1' : 'w-4 h-4 mr-2'} text-kamp-accent`} />
          <p>Некоторым пунктам необходимо видео подтверждение</p>
        </div>
      </CardContent>

      <div className={`${isMobile ? 'p-2' : 'p-6'} bg-gradient-to-r from-kamp-primary to-kamp-accent text-white`}>
        <h3 className={`font-bold mb-2 ${isMobile ? 'text-sm' : 'text-base'}`}>Что в конце курса?</h3>
        <div 
          className={`relative overflow-hidden transition-all duration-500 ${
            isPointsVisible ? 'max-h-48 md:max-h-96' : 'max-h-10 md:max-h-20'
          }`}
        >
          <p className={`mb-2 md:mb-4 ${isMobile ? 'text-xs' : 'text-sm'}`}>
            Участники, занявшие призовые места, получат ценные призы и особое признание.
            Но главная награда — это преображение, которое происходит с каждым участником КЭМП.
          </p>
          
          <div className={`absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-kamp-primary to-transparent ${isPointsVisible ? 'hidden' : 'block'}`}></div>
        </div>
        
        <button 
          onClick={togglePointsVisibility}
          className={`mt-1 md:mt-3 ${isMobile ? 'text-xs' : 'text-sm'} font-medium hover:underline focus:outline-none`}
        >
          {isPointsVisible ? 'Скрыть детали' : 'Узнать подробнее'}
        </button>
      </div>
    </Card>
  );
};
