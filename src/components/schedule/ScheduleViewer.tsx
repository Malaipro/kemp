import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, BookOpen, User, MapPin } from 'lucide-react';

interface ScheduleEvent {
  id: string;
  date_specific: string | null;
  day_of_week: number;
  time_start: string;
  time_end: string;
  activity_name: string;
  description: string | null;
  instructor: string | null;
  lecturer: string | null;
  location: string | null;
  event_type: string;
  ascetic_meaning_kemp: string | null;
  ascetic_meaning_nutrition: string | null;
  highlight_color: string | null;
}

export const ScheduleViewer: React.FC = () => {
  // Get schedule events for participants
  const { data: scheduleEvents, isLoading } = useQuery({
    queryKey: ['schedule-viewer'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schedule')
        .select('*')
        .eq('is_active', true)
        .order('date_specific', { ascending: true })
        .order('time_start', { ascending: true });

      if (error) throw error;
      return data;
    }
  });

  const getRowColor = (color: string | null) => {
    switch (color) {
      case 'red': return 'bg-red-500/10 border-red-500/30';
      case 'yellow': return 'bg-yellow-500/10 border-yellow-500/30';
      case 'green': return 'bg-green-500/10 border-green-500/30';
      case 'blue': return 'bg-blue-500/10 border-blue-500/30';
      case 'purple': return 'bg-purple-500/10 border-purple-500/30';
      case 'orange': return 'bg-orange-500/10 border-orange-500/30';
      case 'pink': return 'bg-pink-500/10 border-pink-500/30';
      case 'cyan': return 'bg-cyan-500/10 border-cyan-500/30';
      case 'indigo': return 'bg-indigo-500/10 border-indigo-500/30';
      case 'teal': return 'bg-teal-500/10 border-teal-500/30';
      default: return 'bg-gray-800/30 border-gray-700';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'lecture': return <BookOpen className="w-4 h-4 text-blue-400" />;
      case 'test': return <Calendar className="w-4 h-4 text-orange-400" />;
      case 'special': return <User className="w-4 h-4 text-purple-400" />;
      default: return <Clock className="w-4 h-4 text-kamp-accent" />;
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'lecture': return 'Лекция';
      case 'test': return 'Тест';
      case 'special': return 'Спец. мероприятие';
      default: return 'Тренировка';
    }
  };

  const getDayName = (dayNumber: number) => {
    const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    return days[dayNumber];
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kamp-accent mx-auto"></div>
          <p className="text-gray-400 mt-2">Загрузка расписания...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Calendar className="w-6 h-6 text-kamp-accent" />
          Расписание потока
        </h2>
        <p className="text-gray-400">Детальное расписание всех мероприятий</p>
      </div>

      {/* Schedule Table */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-kamp-accent" />
            Расписание мероприятий
          </CardTitle>
        </CardHeader>
        <CardContent>
          {scheduleEvents?.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Расписание пока не добавлено</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300 min-w-[180px]">Смысл аскезы/КЭМП</TableHead>
                    <TableHead className="text-gray-300 min-w-[180px]">Смысл аскезы/Нутрициология</TableHead>
                    <TableHead className="text-gray-300 min-w-[100px]">Дата</TableHead>
                    <TableHead className="text-gray-300 min-w-[120px]">День недели</TableHead>
                    <TableHead className="text-gray-300 min-w-[100px]">Время</TableHead>
                    <TableHead className="text-gray-300 min-w-[200px]">Мероприятие</TableHead>
                    <TableHead className="text-gray-300 min-w-[120px]">Лектор</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduleEvents?.map(event => (
                    <TableRow key={event.id} className={`border-gray-700 ${getRowColor(event.highlight_color)}`}>
                      <TableCell className="text-gray-300 text-sm">
                        <div className="max-w-[180px] overflow-hidden">
                          {event.ascetic_meaning_kemp || '-'}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300 text-sm">
                        <div className="max-w-[180px] overflow-hidden">
                          {event.ascetic_meaning_nutrition || '-'}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {event.date_specific 
                          ? new Date(event.date_specific).toLocaleDateString('ru-RU')
                          : '-'
                        }
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {getDayName(event.day_of_week)}
                      </TableCell>
                      <TableCell className="text-gray-300 font-mono">
                        {event.time_start}-{event.time_end}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {getEventTypeIcon(event.event_type)}
                            <span className="text-white font-medium">{event.activity_name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <Badge variant="secondary" className="text-xs">
                              {getEventTypeLabel(event.event_type)}
                            </Badge>
                          </div>
                          {event.description && (
                            <div className="text-gray-400 text-xs mt-1 max-w-[200px]">
                              {event.description}
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center gap-1 text-gray-500 text-xs">
                              <MapPin className="w-3 h-3" />
                              {event.location}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {event.lecturer || event.instructor || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-white mb-2">Обозначения:</h3>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-kamp-accent" />
              <span className="text-gray-300">Тренировка</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span className="text-gray-300">Лекция</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-400" />
              <span className="text-gray-300">Тестирование</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-purple-400" />
              <span className="text-gray-300">Специальное мероприятие</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};