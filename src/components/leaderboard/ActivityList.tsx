
import React from 'react';
import { ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Activity } from './data';

interface ActivityListProps {
  activities: Activity[];
  isPointsVisible: boolean;
  togglePointsVisibility: () => void;
}

export const ActivityList: React.FC<ActivityListProps> = ({
  activities,
  isPointsVisible,
  togglePointsVisibility
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="bg-white rounded-lg p-2 md:p-6 shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-2 md:mb-4">
        <h3 className="text-kamp-dark text-base md:text-xl font-bold">Как заработать баллы?</h3>
        <button 
          onClick={togglePointsVisibility}
          className="flex items-center justify-center text-xs md:text-sm text-gray-500 hover:text-kamp-primary transition-colors"
        >
          {isPointsVisible ? (
            <>
              <EyeOff className="h-3 w-3 md:h-4 md:w-4 mr-1" />
              <span className="hidden md:inline">Скрыть</span>
            </>
          ) : (
            <>
              <Eye className="h-3 w-3 md:h-4 md:w-4 mr-1" />
              <span className="hidden md:inline">Показать</span>
            </>
          )}
          <span className="md:hidden">
            {isPointsVisible ? "Скрыть" : "Показать"}
          </span>
          {isPointsVisible ? 
            <ChevronUp className="h-3 w-3 md:h-4 md:w-4 ml-1" /> : 
            <ChevronDown className="h-3 w-3 md:h-4 md:w-4 ml-1" />
          }
        </button>
      </div>
      
      <div className="space-y-2 md:space-y-4">
        {activities.map((activity, index) => (
          <div 
            key={index}
            className="flex justify-between items-center py-1 px-2 md:p-2 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center">
              {activity.icon && (
                <div className="mr-2 text-kamp-primary">
                  {React.createElement(activity.icon, { 
                    size: isMobile ? 14 : 18,
                    className: "text-kamp-primary"
                  })}
                </div>
              )}
              <span className="text-kamp-dark text-xs md:text-sm font-medium">
                {activity.name}
              </span>
            </div>
            
            <div className={`text-xs md:text-sm font-semibold ${!isPointsVisible ? 'blur-sm hover:blur-none cursor-pointer' : ''} transition-all duration-200 px-2 py-1 bg-kamp-primary/10 rounded-full text-kamp-primary`}>
              {isPointsVisible ? `+${activity.points}` : "??? баллов"}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-3 md:mt-6 text-center">
        <p className="text-xs md:text-sm text-gray-500 italic">
          {isMobile 
            ? "Побеждай в испытаниях и получай баллы!" 
            : "Побеждай в испытаниях, участвуй в мероприятиях и получай баллы!"}
        </p>
      </div>
    </div>
  );
};
