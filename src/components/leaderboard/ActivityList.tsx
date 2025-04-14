
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Activity } from '@/types/leaderboard';
import { getIconComponent } from './IconRenderer';

interface ActivityListProps {
  activities: Activity[];
}

export const ActivityList: React.FC<ActivityListProps> = ({ activities }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="bg-black/80 rounded-lg p-2 md:p-6 shadow-lg border border-kamp-primary/30">
      <div className="flex justify-between items-center mb-2 md:mb-4">
        <h3 className="text-kamp-primary text-base md:text-xl font-bold">Как заработать баллы?</h3>
      </div>
      
      <div className="space-y-2 md:space-y-4">
        {activities.map((activity, index) => (
          <div 
            key={index}
            className="flex justify-between items-center py-1 px-2 md:p-2 rounded-md bg-black/50 border border-kamp-primary/20 hover:bg-kamp-primary/10 transition-colors"
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
      
      <div className="mt-3 md:mt-6 text-center">
        <p className="text-xs md:text-sm text-kamp-primary/70 italic">
          {isMobile 
            ? "Побеждай в испытаниях и получай баллы!" 
            : "Побеждай в испытаниях, участвуй в мероприятиях и получай баллы!"}
        </p>
      </div>
    </div>
  );
};
