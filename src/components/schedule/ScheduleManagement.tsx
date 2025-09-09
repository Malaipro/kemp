import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Plus, Edit, Trash2, Clock, MapPin, Users } from 'lucide-react';
import { useRole } from '@/hooks/useRole';
import { sanitizeInput } from '@/lib/validation';

interface ScheduleItem {
  id: string;
  day_of_week: number;
  time_start: string;
  time_end: string;
  activity_name: string;
  location: string | null;
  instructor: string | null;
  max_participants: number | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

const DAYS_OF_WEEK = [
  { value: 1, label: 'Понедельник' },
  { value: 2, label: 'Вторник' },
  { value: 3, label: 'Среда' },
  { value: 4, label: 'Четверг' },
  { value: 5, label: 'Пятница' },
  { value: 6, label: 'Суббота' },
  { value: 0, label: 'Воскресенье' }
];

export const ScheduleManagement: React.FC = () => {
  const { toast } = useToast();
  const { isSuperAdmin } = useRole();
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);

  // Form state
  const [dayOfWeek, setDayOfWeek] = useState<number>(1);
  const [timeStart, setTimeStart] = useState('09:00');
  const [timeEnd, setTimeEnd] = useState('10:00');
  const [activityName, setActivityName] = useState('');
  const [location, setLocation] = useState('');
  const [instructor, setInstructor] = useState('');
  const [maxParticipants, setMaxParticipants] = useState<number>(10);
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('schedule')
        .select('*')
        .eq('is_active', true)
        .order('day_of_week')
        .order('time_start');

      if (error) {
        console.error('Error loading schedule:', error);
        return;
      }

      setSchedule(data || []);
    } catch (error) {
      console.error('Error in loadSchedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      toast({
        title: "Нет доступа",
        description: "Только супер-админ может редактировать расписание",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const scheduleData = {
        day_of_week: dayOfWeek,
        time_start: timeStart,
        time_end: timeEnd,
        activity_name: sanitizeInput(activityName),
        location: location ? sanitizeInput(location) : null,
        instructor: instructor ? sanitizeInput(instructor) : null,
        max_participants: maxParticipants > 0 ? maxParticipants : null,
        description: description ? sanitizeInput(description) : null
      };

      if (editingItem) {
        const { error } = await supabase
          .from('schedule')
          .update(scheduleData)
          .eq('id', editingItem.id);

        if (error) {
          toast({
            title: "Ошибка обновления",
            description: error.message,
            variant: "destructive"
          });
          return;
        }

        toast({
          title: "Расписание обновлено",
          description: "Занятие успешно обновлено"
        });
      } else {
        const { error } = await supabase
          .from('schedule')
          .insert([scheduleData]);

        if (error) {
          toast({
            title: "Ошибка добавления",
            description: error.message,
            variant: "destructive"
          });
          return;
        }

        toast({
          title: "Занятие добавлено",
          description: "Новое занятие успешно добавлено в расписание"
        });
      }

      // Reset form
      resetForm();
      loadSchedule();
    } catch (error) {
      console.error('Error saving schedule item:', error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при сохранении",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setDayOfWeek(1);
    setTimeStart('09:00');
    setTimeEnd('10:00');
    setActivityName('');
    setLocation('');
    setInstructor('');
    setMaxParticipants(10);
    setDescription('');
  };

  const handleEdit = (item: ScheduleItem) => {
    setEditingItem(item);
    setDayOfWeek(item.day_of_week);
    setTimeStart(item.time_start);
    setTimeEnd(item.time_end);
    setActivityName(item.activity_name);
    setLocation(item.location || '');
    setInstructor(item.instructor || '');
    setMaxParticipants(item.max_participants || 10);
    setDescription(item.description || '');
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!isSuperAdmin) {
      toast({
        title: "Нет доступа",
        description: "Только супер-админ может удалять занятия",
        variant: "destructive"
      });
      return;
    }

    if (!confirm('Вы уверены, что хотите удалить это занятие?')) return;

    try {
      const { error } = await supabase
        .from('schedule')
        .update({ is_active: false })
        .eq('id', id);

      if (error) {
        toast({
          title: "Ошибка удаления",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Занятие удалено",
        description: "Занятие успешно удалено из расписания"
      });

      loadSchedule();
    } catch (error) {
      console.error('Error deleting schedule item:', error);
    }
  };

  const getDayName = (dayOfWeek: number) => {
    return DAYS_OF_WEEK.find(day => day.value === dayOfWeek)?.label || 'Неизвестно';
  };

  const groupedSchedule = schedule.reduce((acc, item) => {
    if (!acc[item.day_of_week]) {
      acc[item.day_of_week] = [];
    }
    acc[item.day_of_week].push(item);
    return acc;
  }, {} as Record<number, ScheduleItem[]>);

  return (
    <Card className="kamp-card">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="flex items-center gap-2 text-kamp-accent">
            <Calendar className="w-5 h-5" />
            Расписание занятий
          </CardTitle>
          {isSuperAdmin && (
            <Button
              onClick={() => setShowForm(!showForm)}
              variant="outline"
              size="sm"
              className="border-kamp-accent text-kamp-accent hover:bg-kamp-accent hover:text-black"
            >
              <Plus className="w-4 h-4 mr-2" />
              Добавить занятие
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {showForm && isSuperAdmin && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 border border-gray-700 rounded-lg bg-gray-900/50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="day-of-week">День недели</Label>
                <Select value={dayOfWeek.toString()} onValueChange={(value) => setDayOfWeek(parseInt(value))}>
                  <SelectTrigger className="kamp-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS_OF_WEEK.map((day) => (
                      <SelectItem key={day.value} value={day.value.toString()}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time-start">Время начала</Label>
                <Input
                  id="time-start"
                  type="time"
                  value={timeStart}
                  onChange={(e) => setTimeStart(e.target.value)}
                  required
                  className="kamp-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time-end">Время окончания</Label>
                <Input
                  id="time-end"
                  type="time"
                  value={timeEnd}
                  onChange={(e) => setTimeEnd(e.target.value)}
                  required
                  className="kamp-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="activity-name">Название занятия</Label>
                <Input
                  id="activity-name"
                  value={activityName}
                  onChange={(e) => setActivityName(e.target.value)}
                  placeholder="БЖЖ, Кикбоксинг, ОФП..."
                  required
                  maxLength={100}
                  className="kamp-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instructor">Инструктор</Label>
                <Input
                  id="instructor"
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  placeholder="Имя инструктора"
                  maxLength={100}
                  className="kamp-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="location">Место проведения</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Зал, адрес..."
                  maxLength={200}
                  className="kamp-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="max-participants">Макс. участников</Label>
                <Input
                  id="max-participants"
                  type="number"
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(parseInt(e.target.value) || 0)}
                  min={1}
                  max={50}
                  className="kamp-input"
                />
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Дополнительная информация о занятии"
                maxLength={500}
                className="kamp-input"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button 
                type="submit" 
                className="kamp-button-primary"
                disabled={loading}
              >
                {loading ? 'Сохранение...' : editingItem ? 'Обновить' : 'Добавить'}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={resetForm}
                className="border-gray-600 text-gray-300"
              >
                Отмена
              </Button>
            </div>
          </form>
        )}

        {loading && schedule.length === 0 ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kamp-accent mx-auto"></div>
          </div>
        ) : schedule.length === 0 ? (
          <p className="text-gray-400 text-center py-4">
            Расписание пока не добавлено
          </p>
        ) : (
          <div className="grid gap-6">
            {DAYS_OF_WEEK.map((day) => {
              const daySchedule = groupedSchedule[day.value];
              if (!daySchedule || daySchedule.length === 0) return null;
              
              return (
                <div key={day.value} className="space-y-3">
                  <h3 className="text-lg font-semibold text-kamp-accent border-b border-gray-700 pb-2">
                    {day.label}
                  </h3>
                  <div className="grid gap-3">
                    {daySchedule.map((item) => (
                      <div 
                        key={item.id}
                        className="p-4 border border-gray-700 rounded-lg bg-gray-900/30 hover:bg-gray-900/50 transition-colors"
                      >
                        <div className="flex items-start justify-between flex-wrap gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-4 mb-2 flex-wrap">
                              <div className="flex items-center gap-2 text-kamp-accent">
                                <Clock className="w-4 h-4" />
                                <span className="font-semibold">
                                  {item.time_start} - {item.time_end}
                                </span>
                              </div>
                              <h4 className="text-lg font-bold text-white">
                                {item.activity_name}
                              </h4>
                            </div>
                            
                            <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                              {item.instructor && (
                                <span>👨‍🏫 {item.instructor}</span>
                              )}
                              {item.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {item.location}
                                </div>
                              )}
                              {item.max_participants && (
                                <div className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  до {item.max_participants} чел.
                                </div>
                              )}
                            </div>
                            
                            {item.description && (
                              <p className="text-gray-300 text-sm mt-2">{item.description}</p>
                            )}
                          </div>
                          
                          {isSuperAdmin && (
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleEdit(item)}
                                variant="outline"
                                size="sm"
                                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                onClick={() => handleDelete(item.id)}
                                variant="outline"
                                size="sm"
                                className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};