
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

  // Function to get icon component based on string name
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Target':
        return <Target className="w-5 h-5 text-kamp-accent" />;
      case 'Medal':
        return <Medal className="w-5 h-5 text-kamp-accent" />;
      case 'Sun':
        return <Sun className="w-5 h-5 text-kamp-accent" />;
      case 'DropletIcon':
        return <DropletIcon className="w-5 h-5 text-kamp-accent" />;
      case 'Utensils':
        return <Utensils className="w-5 h-5 text-kamp-accent" />;
      case 'Share2':
        return <Share2 className="w-5 h-5 text-kamp-accent" />;
      default:
        return <Target className="w-5 h-5 text-kamp-accent" />;
    }
  };

  // Mocked data if Supabase data fails to load
  const fallbackParticipants: Participant[] = [
    { id: '1', name: 'Алексей', points: 150, rank: 1 },
    { id: '2', name: 'Михаил', points: 135, rank: 2 },
    { id: '3', name: 'Дмитрий', points: 120, rank: 3 },
    { id: '4', name: 'Сергей', points: 105, rank: 4 },
    { id: '5', name: 'Иван', points: 95, rank: 5 },
    { id: '6', name: 'Николай', points: 85, rank: 6 },
    { id: '7', name: 'Андрей', points: 75, rank: 7 },
    { id: '8', name: 'Павел', points: 65, rank: 8 },
  ];
  
  const fallbackActivities: Activity[] = [
    { id: '1', title: 'Тренировка по кикбоксингу', icon: 'Target', points: 20 },
    { id: '2', title: 'Утренняя тренировка', icon: 'Sun', points: 15 },
    { id: '3', title: 'Закаливание', icon: 'DropletIcon', points: 10 },
    { id: '4', title: 'Правильное питание', icon: 'Utensils', points: 15 },
    { id: '5', title: 'Участие в командной активности', icon: 'Share2', points: 25 },
  ];

  // Load data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Load participants list from leaderboard view
        const { data: participantsData, error: participantsError } = await supabase
          .from('leaderboard')
          .select('*')
          .order('rank', { ascending: true })
          .limit(10);
        
        if (participantsError) {
          console.error('Error loading participants:', participantsError);
          setParticipants(fallbackParticipants); // Use fallback data
        } else if (participantsData && participantsData.length > 0) {
          setParticipants(participantsData);
        } else {
          // If no data, use fallback
          setParticipants(fallbackParticipants);
        }
        
        // Load activities list
        const { data: activitiesData, error: activitiesError } = await supabase
          .from('activities')
          .select('*');
        
        if (activitiesError) {
          console.error('Error loading activities:', activitiesError);
          setActivities(fallbackActivities); // Use fallback data
        } else if (activitiesData && activitiesData.length > 0) {
          setActivities(activitiesData);
        } else {
          // If no data, use fallback
          setActivities(fallbackActivities);
        }
      } catch (error) {
        console.error('An error occurred:', error);
        // Use fallback data on any error
        setParticipants(fallbackParticipants);
        setActivities(fallbackActivities);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

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
            <Card className="overflow-hidden border-gray-700 bg-black bg-opacity-60 text-gray-200">
              <CardHeader className="flex flex-row justify-between items-center p-6 border-b border-gray-800">
                <h3 className="font-bold text-kamp-dark">Рейтинг участников</h3>
                <span className="text-sm text-gray-400">Обновлено: сегодня</span>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-black bg-opacity-50 border-b border-gray-800">
                        <TableHead className="py-4 px-6 text-left text-sm font-semibold text-gray-300">Место</TableHead>
                        <TableHead className="py-4 px-6 text-left text-sm font-semibold text-gray-300">Участник</TableHead>
                        <TableHead className="py-4 px-6 text-right text-sm font-semibold text-gray-300">Баллы</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-10 text-gray-400">
                            Загрузка данных...
                          </TableCell>
                        </TableRow>
                      ) : participants.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-10 text-gray-400">
                            Нет данных для отображения
                          </TableCell>
                        </TableRow>
                      ) : (
                        participants.map((participant) => (
                          <TableRow 
                            key={participant.id} 
                            className="border-t border-gray-800 hover:bg-gray-900 transition-colors"
                          >
                            <TableCell className="py-4 px-6">
                              <div className="flex items-center">
                                {participant.rank <= 3 ? (
                                  <span className={`flex items-center justify-center w-8 h-8 rounded-full ${
                                    participant.rank === 1 
                                      ? 'bg-yellow-900 text-yellow-400' 
                                      : participant.rank === 2 
                                        ? 'bg-gray-800 text-gray-300' 
                                        : 'bg-amber-900 text-amber-400'
                                  }`}>
                                    {participant.rank}
                                  </span>
                                ) : (
                                  <span className="text-gray-400 font-medium pl-2">
                                    {participant.rank}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="py-4 px-6 font-medium text-kamp-dark">
                              {participant.name}
                            </TableCell>
                            <TableCell className="py-4 px-6 text-right font-bold text-kamp-accent">
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
            <Card className="h-full border-gray-700 bg-black bg-opacity-60 text-gray-200">
              <CardHeader className="p-6 border-b border-gray-800">
                <h3 className="font-bold text-kamp-dark">Как заработать баллы?</h3>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {loading ? (
                  <div className="py-10 text-center text-gray-400">Загрузка активностей...</div>
                ) : (
                  activities.map((activity) => (
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
                  ))
                )}
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
          </div>
        </div>
      </div>
    </section>
  );
};
