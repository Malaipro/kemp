
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Activity } from '@/types/leaderboard';
import { getIconComponent } from './IconRenderer';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface ActivityListProps {
  activities: Activity[];
}

export const ActivityList: React.FC<ActivityListProps> = ({ activities }) => {
  const isMobile = useIsMobile();
  
  return (
    <Card className="overflow-hidden border-gray-700 bg-black bg-opacity-60 text-gray-200 h-full">
      <CardHeader className={`flex flex-row justify-between items-center ${isMobile ? 'p-3' : 'p-6'} border-b border-gray-800`}>
        <h3 className={`font-bold text-kamp-primary ${isMobile ? 'text-sm' : 'text-base'}`}>Как заработать баллы?</h3>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-2 md:p-4 space-y-2 md:space-y-4">
          {activities.map((activity, index) => (
            <div 
              key={index}
              className="flex justify-between items-center py-1 px-2 md:p-2 rounded-md bg-black/50 border border-gray-800 hover:bg-gray-900 transition-colors"
            >
              <div className="flex items-center">
                {activity.icon && (
                  <div className="mr-2 text-kamp-primary">
                    {React.createElement(getIconComponent(activity.icon).type, { 
                      size: isMobile ? 14 : 18,
                      className: "text-kamp-primary"
                    })}
                  </div>
                )}
                <span className="text-white text-xs md:text-sm font-medium">
                  {activity.title}
                </span>
              </div>
              
              <div className="text-xs md:text-sm font-semibold px-2 py-1 bg-kamp-primary/20 text-kamp-primary rounded-full">
                +{activity.points}
              </div>
            </div>
          ))}
        </div>
        
        <div className="py-3 md:py-5 px-4 text-center border-t border-gray-800">
          <p className="text-xs md:text-sm text-gray-400 italic">
            {isMobile 
              ? "Побеждай в испытаниях и получай баллы! Для некоторых пунктов нужно фото/видео подтверждение." 
              : "Побеждай в испытаниях, участвуй в мероприятиях и получай баллы! Для некоторых пунктов необходимо фото и видео подтверждение."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
