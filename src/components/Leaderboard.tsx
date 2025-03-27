
import React, { useState, useEffect } from 'react';
import { Medal, Target, Sun, DropletIcon, Utensils, Share2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface Participant {
  id: string;
  name: string;
  points: number;
  rank: number;
}

interface Activity {
  id: string;
  title: string;
  icon: string;
  points: number;
}

export const Leaderboard: React.FC = () => {
  const [isPointsVisible, setIsPointsVisible] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const togglePointsVisibility = () => {
    setIsPointsVisible(!isPointsVisible);
  };

  // Функция для получения иконки на основе строкового названия
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Target':
        return <Target className="w-5 h-5 text-kamp-primary" />;
      case 'Medal':
        return <Medal className="w-5 h-5 text-kamp-primary" />;
      case 'Sun':
        return <Sun className="w-5 h-5 text-kamp-primary" />;
      case 'DropletIcon':
        return <DropletIcon className="w-5 h-5 text-kamp-primary" />;
      case 'Utensils':
        return <Utensils className="w-5 h-5 text-kamp-primary" />;
      case 'Share2':
        return <Share2 className="w-5 h-5 text-kamp-primary" />;
      default:
        return <Target className="w-5 h-5 text-kamp-primary" />;
    }
  };

  // Загрузка данных из Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Загрузка списка участников из представления leaderboard
        const { data: participantsData, error: participantsError } = await supabase
          .from('leaderboard')
          .select('*')
          .order('rank', { ascending: true })
          .limit(10);
        
        if (participantsError) {
          console.error('Ошибка при загрузке участников:', participantsError);
          return;
        }
        
        // Загрузка списка активностей
        const { data: activitiesData, error: activitiesError } = await supabase
          .from('activities')
          .select('*');
        
        if (activitiesError) {
          console.error('Ошибка при загрузке активностей:', activitiesError);
          return;
        }
        
        setParticipants(participantsData);
        setActivities(activitiesData);
      } catch (error) {
        console.error('Произошла ошибка:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <section id="leaderboard" className="kamp-section bg-gray-50">
      <div className="kamp-container">
        <div className="section-heading reveal-on-scroll">
          <span className="inline-block text-kamp-primary font-semibold mb-2">Лидерборд</span>
          <h2 className="text-kamp-dark">Соревнуйся и побеждай</h2>
          <p>
            КЭМП — это не только саморазвитие, но и соревнование. 
            Зарабатывай баллы, поднимайся в рейтинге и получи награду в конце курса.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-5 gap-8">
          {/* Leaderboard Table */}
          <div className="md:col-span-3 reveal-on-scroll">
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row justify-between items-center p-6 border-b border-gray-100">
                <h3 className="font-bold text-kamp-dark">Рейтинг участников</h3>
                <span className="text-sm text-gray-500">Обновлено: сегодня</span>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="py-4 px-6 text-left text-sm font-semibold text-gray-500">Место</TableHead>
                        <TableHead className="py-4 px-6 text-left text-sm font-semibold text-gray-500">Участник</TableHead>
                        <TableHead className="py-4 px-6 text-right text-sm font-semibold text-gray-500">Баллы</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-10">
                            Загрузка данных...
                          </TableCell>
                        </TableRow>
                      ) : participants.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-10">
                            Нет данных для отображения
                          </TableCell>
                        </TableRow>
                      ) : (
                        participants.map((participant) => (
                          <TableRow 
                            key={participant.id} 
                            className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                          >
                            <TableCell className="py-4 px-6">
                              <div className="flex items-center">
                                {participant.rank <= 3 ? (
                                  <span className={`flex items-center justify-center w-8 h-8 rounded-full ${
                                    participant.rank === 1 
                                      ? 'bg-yellow-100 text-yellow-600' 
                                      : participant.rank === 2 
                                        ? 'bg-gray-100 text-gray-600' 
                                        : 'bg-amber-100 text-amber-600'
                                  }`}>
                                    {participant.rank}
                                  </span>
                                ) : (
                                  <span className="text-gray-500 font-medium pl-2">
                                    {participant.rank}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="py-4 px-6 font-medium text-kamp-dark">
                              {participant.name}
                            </TableCell>
                            <TableCell className="py-4 px-6 text-right font-bold text-kamp-primary">
                              {participant.points}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* How to earn points */}
          <div className="md:col-span-2 reveal-on-scroll">
            <Card className="h-full">
              <CardHeader className="p-6 border-b border-gray-100">
                <h3 className="font-bold text-kamp-dark">Как заработать баллы?</h3>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {loading ? (
                  <div className="py-10 text-center">Загрузка активностей...</div>
                ) : (
                  activities.map((activity) => (
                    <div 
                      key={activity.id} 
                      className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        {getIconComponent(activity.icon)}
                      </div>
                      <div className="ml-4 flex-grow">
                        <span className="font-medium text-gray-800">{activity.title}</span>
                      </div>
                      <div className="text-kamp-primary font-bold">
                        +{activity.points} баллов
                      </div>
                    </div>
                  ))
                )}
              </CardContent>

              <div className="p-6 bg-gradient-to-r from-kamp-primary to-blue-600 text-white">
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
          </div>
        </div>
      </div>
    </section>
  );
};
