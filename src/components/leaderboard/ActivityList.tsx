
import React from 'react';
import { Activity } from '@/types/leaderboard';
import { getIconComponent } from './IconRenderer';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Video } from 'lucide-react';

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
  return (
    <Card className="h-full border-gray-700 bg-black bg-opacity-60 text-gray-200">
      <CardHeader className="p-6 border-b border-gray-800">
        <h3 className="font-bold text-kamp-dark">Как заработать баллы?</h3>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {activities.map((activity) => (
          <div 
            key={activity.id} 
            className="flex items-center p-3 rounded-lg hover:bg-gray-900 transition-colors"
          >
            <div className="flex-shrink-0">
              {getIconComponent(activity.icon)}
            </div>
            <div className="ml-4 flex-grow">
              <span className="font-medium text-gray-300">{activity.title}</span>
            </div>
            <div className="text-kamp-accent font-bold">
              +{activity.points} баллов
            </div>
          </div>
        ))}
        
        <div className="mt-8 pt-4 border-t border-gray-800 flex items-center text-sm text-gray-400">
          <Video className="w-4 h-4 mr-2 text-kamp-accent" />
          <p>Некоторым пунктам необходимо видео подтверждение</p>
        </div>
      </CardContent>

      <div className="p-6 bg-gradient-to-r from-kamp-primary to-kamp-accent text-white">
        <h3 className="font-bold mb-3">Что в конце курса?</h3>
        <div 
          className={`relative overflow-hidden transition-all duration-500 ${
            isPointsVisible ? 'max-h-96' : 'max-h-20'
          }`}
        >
          <p className="mb-4">
            Участники, занявшие призовые места, получат ценные призы и особое признание.
            Но главная награда — это преображение, которое происходит с каждым участником КЭМП.
          </p>
          
          <div className={`absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-kamp-primary to-transparent ${isPointsVisible ? 'hidden' : 'block'}`}></div>
        </div>
        
        <button 
          onClick={togglePointsVisibility}
          className="mt-3 text-sm font-medium hover:underline focus:outline-none"
        >
          {isPointsVisible ? 'Скрыть детали' : 'Узнать подробнее'}
        </button>
      </div>
    </Card>
  );
};
