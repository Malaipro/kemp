import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useRole } from '@/hooks/useRole';
import { Calendar, Clock, User, Plus, Edit2, Trash2, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

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
  max_participants: number | null;
  is_active: boolean;
}

export const DetailedScheduleManagement: React.FC = () => {
  const { isSuperAdmin } = useRole();
  const queryClient = useQueryClient();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);
  
  // Form state
  const [dateSpecific, setDateSpecific] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [timeStart, setTimeStart] = useState('06:00');
  const [timeEnd, setTimeEnd] = useState('07:30');
  const [activityName, setActivityName] = useState('');
  const [description, setDescription] = useState('');
  const [instructor, setInstructor] = useState('');
  const [lecturer, setLecturer] = useState('');
  const [location, setLocation] = useState('');
  const [eventType, setEventType] = useState('training');
  const [asceticMeaningKemp, setAsceticMeaningKemp] = useState('');
  const [asceticMeaningNutrition, setAsceticMeaningNutrition] = useState('');
  const [highlightColor, setHighlightColor] = useState('none');
  const [maxParticipants, setMaxParticipants] = useState<number | null>(null);

  // Get schedule events
  const { data: scheduleEvents, isLoading } = useQuery({
    queryKey: ['detailed-schedule'],
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

  const addEventMutation = useMutation({
    mutationFn: async (eventData: any) => {
      const { error } = await supabase
        .from('schedule')
        .insert(eventData);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Мероприятие добавлено в расписание');
      queryClient.invalidateQueries({ queryKey: ['detailed-schedule'] });
      resetForm();
    },
    onError: (error: any) => {
      toast.error('Ошибка: ' + error.message);
    }
  });

  const updateEventMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase
        .from('schedule')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Мероприятие обновлено');
      queryClient.invalidateQueries({ queryKey: ['detailed-schedule'] });
      resetForm();
    },
    onError: (error: any) => {
      toast.error('Ошибка: ' + error.message);
    }
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('schedule')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Мероприятие удалено из расписания');
      queryClient.invalidateQueries({ queryKey: ['detailed-schedule'] });
    },
    onError: (error: any) => {
      toast.error('Ошибка: ' + error.message);
    }
  });

  const resetForm = () => {
    setShowAddForm(false);
    setEditingEvent(null);
    setDateSpecific('');
    setDayOfWeek(1);
    setTimeStart('06:00');
    setTimeEnd('07:30');
    setActivityName('');
    setDescription('');
    setInstructor('');
    setLecturer('');
    setLocation('');
    setEventType('training');
    setAsceticMeaningKemp('');
    setAsceticMeaningNutrition('');
    setHighlightColor('none');
    setMaxParticipants(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!activityName.trim()) {
      toast.error('Введите название мероприятия');
      return;
    }

    const eventData = {
      date_specific: dateSpecific || null,
      day_of_week: dayOfWeek,
      time_start: timeStart,
      time_end: timeEnd,
      activity_name: activityName.trim(),
      description: description.trim() || null,
      instructor: instructor.trim() || null,
      lecturer: lecturer.trim() || null,
      location: location.trim() || null,
      event_type: eventType,
      ascetic_meaning_kemp: asceticMeaningKemp.trim() || null,
      ascetic_meaning_nutrition: asceticMeaningNutrition.trim() || null,
      highlight_color: highlightColor === 'none' ? null : highlightColor,
      max_participants: maxParticipants,
      is_active: true
    };

    if (editingEvent) {
      updateEventMutation.mutate({ id: editingEvent.id, updates: eventData });
    } else {
      addEventMutation.mutate(eventData);
    }
  };

  const handleEdit = (event: ScheduleEvent) => {
    setEditingEvent(event);
    setDateSpecific(event.date_specific || '');
    setDayOfWeek(event.day_of_week);
    setTimeStart(event.time_start);
    setTimeEnd(event.time_end);
    setActivityName(event.activity_name);
    setDescription(event.description || '');
    setInstructor(event.instructor || '');
    setLecturer(event.lecturer || '');
    setLocation(event.location || '');
    setEventType(event.event_type);
    setAsceticMeaningKemp(event.ascetic_meaning_kemp || '');
    setAsceticMeaningNutrition(event.ascetic_meaning_nutrition || '');
    setHighlightColor(event.highlight_color || 'none');
    setMaxParticipants(event.max_participants);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить это мероприятие?')) {
      deleteEventMutation.mutate(id);
    }
  };

  const getRowColor = (color: string | null) => {
    switch (color) {
      case 'red': return 'bg-red-500/20 border-red-500/50';
      case 'yellow': return 'bg-yellow-500/20 border-yellow-500/50';
      case 'green': return 'bg-green-500/20 border-green-500/50';
      case 'blue': return 'bg-blue-500/20 border-blue-500/50';
      case 'purple': return 'bg-purple-500/20 border-purple-500/50';
      case 'orange': return 'bg-orange-500/20 border-orange-500/50';
      case 'pink': return 'bg-pink-500/20 border-pink-500/50';
      case 'cyan': return 'bg-cyan-500/20 border-cyan-500/50';
      case 'indigo': return 'bg-indigo-500/20 border-indigo-500/50';
      case 'teal': return 'bg-teal-500/20 border-teal-500/50';
      default: return 'bg-gray-800/30 border-gray-700';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'lecture': return <BookOpen className="w-4 h-4" />;
      case 'test': return <Calendar className="w-4 h-4" />;
      case 'special': return <User className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getDayName = (dayNumber: number) => {
    const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    return days[dayNumber];
  };

  if (!isSuperAdmin) {
    return (
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="p-6 text-center">
          <p className="text-gray-400">Доступ запрещен. Только для администраторов.</p>
        </CardContent>
      </Card>
    );
  }

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-kamp-accent" />
            Управление расписанием потока
          </h2>
          <p className="text-gray-400">Детальное расписание мероприятий с полным редактированием</p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-kamp-accent hover:bg-kamp-accent/90 text-black"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить мероприятие
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">
              {editingEvent ? 'Редактировать мероприятие' : 'Добавить новое мероприятие'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Date and Time */}
                <div>
                  <Label>Конкретная дата</Label>
                  <Input
                    type="date"
                    value={dateSpecific}
                    onChange={(e) => setDateSpecific(e.target.value)}
                    className="bg-white border-gray-300"
                  />
                </div>

                <div>
                  <Label>День недели</Label>
                  <Select value={dayOfWeek.toString()} onValueChange={(value) => setDayOfWeek(parseInt(value))}>
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-300 z-50">
                      <SelectItem value="1">Понедельник</SelectItem>
                      <SelectItem value="2">Вторник</SelectItem>
                      <SelectItem value="3">Среда</SelectItem>
                      <SelectItem value="4">Четверг</SelectItem>
                      <SelectItem value="5">Пятница</SelectItem>
                      <SelectItem value="6">Суббота</SelectItem>
                      <SelectItem value="0">Воскресенье</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Время начала</Label>
                  <Input
                    type="time"
                    value={timeStart}
                    onChange={(e) => setTimeStart(e.target.value)}
                    className="bg-white border-gray-300"
                  />
                </div>

                <div>
                  <Label>Время окончания</Label>
                  <Input
                    type="time"
                    value={timeEnd}
                    onChange={(e) => setTimeEnd(e.target.value)}
                    className="bg-white border-gray-300"
                  />
                </div>

                <div>
                  <Label>Тип мероприятия</Label>
                  <Select value={eventType} onValueChange={setEventType}>
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-300 z-50">
                      <SelectItem value="training">Тренировка</SelectItem>
                      <SelectItem value="lecture">Лекция</SelectItem>
                      <SelectItem value="test">Тестирование</SelectItem>
                      <SelectItem value="special">Специальное мероприятие</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Цвет выделения</Label>
                  <Select value={highlightColor} onValueChange={setHighlightColor}>
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-300 z-50">
                      <SelectItem value="none">Без выделения</SelectItem>
                      <SelectItem value="red">🔴 Красный</SelectItem>
                      <SelectItem value="yellow">🟡 Желтый</SelectItem>
                      <SelectItem value="green">🟢 Зеленый</SelectItem>
                      <SelectItem value="blue">🔵 Синий</SelectItem>
                      <SelectItem value="purple">🟣 Фиолетовый</SelectItem>
                      <SelectItem value="orange">🟠 Оранжевый</SelectItem>
                      <SelectItem value="pink">🩷 Розовый</SelectItem>
                      <SelectItem value="cyan">🩵 Голубой</SelectItem>
                      <SelectItem value="indigo">🔷 Индиго</SelectItem>
                      <SelectItem value="teal">🔸 Бирюзовый</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Main fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Название мероприятия *</Label>
                  <Input
                    value={activityName}
                    onChange={(e) => setActivityName(e.target.value)}
                    placeholder="Тренировка по БЖЖ, Лекция по питанию..."
                    className="bg-white border-gray-300"
                  />
                </div>

                <div>
                  <Label>Место проведения</Label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Зал 1, Лекционная..."
                    className="bg-white border-gray-300"
                  />
                </div>
              </div>

              {/* Ascetic meanings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Смысл аскезы/Парамата КЭМП</Label>
                  <Textarea
                    value={asceticMeaningKemp}
                    onChange={(e) => setAsceticMeaningKemp(e.target.value)}
                    placeholder="Смысл аскезы для КЭМП"
                    className="bg-white border-gray-300"
                    rows={2}
                  />
                </div>

                <div>
                  <Label>Смысл аскезы/Нутрициология</Label>
                  <Textarea
                    value={asceticMeaningNutrition}
                    onChange={(e) => setAsceticMeaningNutrition(e.target.value)}
                    placeholder="Смысл аскезы для нутрициологии"
                    className="bg-white border-gray-300"
                    rows={2}
                  />
                </div>
              </div>

              {/* Instructor and lecturer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Инструктор</Label>
                  <Input
                    value={instructor}
                    onChange={(e) => setInstructor(e.target.value)}
                    placeholder="Имя инструктора"
                    className="bg-white border-gray-300"
                  />
                </div>

                <div>
                  <Label>Лектор</Label>
                  <Input
                    value={lecturer}
                    onChange={(e) => setLecturer(e.target.value)}
                    placeholder="Дмитрий Шеларушев"
                    className="bg-white border-gray-300"
                  />
                </div>
              </div>

              {/* Description and participants */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Label>Описание</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Подробное описание мероприятия"
                    className="bg-white border-gray-300"
                  />
                </div>

                <div>
                  <Label>Макс. участников</Label>
                  <Input
                    type="number"
                    min="1"
                    value={maxParticipants || ''}
                    onChange={(e) => setMaxParticipants(e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="Неограниченно"
                    className="bg-white border-gray-300"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={addEventMutation.isPending || updateEventMutation.isPending}
                  className="bg-kamp-accent hover:bg-kamp-accent/90 text-black"
                >
                  {editingEvent ? 'Обновить' : 'Добавить'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Отмена
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Schedule Table */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Расписание потока</CardTitle>
        </CardHeader>
        <CardContent>
          {scheduleEvents?.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Расписание пусто</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Смысл аскезы/Парамата КЭМП</TableHead>
                    <TableHead className="text-gray-300">Смысл аскезы/Нутрициология</TableHead>
                    <TableHead className="text-gray-300">Дата</TableHead>
                    <TableHead className="text-gray-300">День недели</TableHead>
                    <TableHead className="text-gray-300">Время</TableHead>
                    <TableHead className="text-gray-300">Мероприятие</TableHead>
                    <TableHead className="text-gray-300">Лектор</TableHead>
                    <TableHead className="text-gray-300">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduleEvents?.map(event => (
                    <TableRow key={event.id} className={`border-gray-700 ${getRowColor(event.highlight_color)}`}>
                      <TableCell className="text-gray-300 text-sm max-w-[200px]">
                        {event.ascetic_meaning_kemp || '-'}
                      </TableCell>
                      <TableCell className="text-gray-300 text-sm max-w-[200px]">
                        {event.ascetic_meaning_nutrition || '-'}
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
                      <TableCell className="text-gray-300">
                        {event.time_start}-{event.time_end}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getEventTypeIcon(event.event_type)}
                          <div>
                            <div className="text-white font-medium">{event.activity_name}</div>
                            {event.description && (
                              <div className="text-gray-400 text-xs">{event.description}</div>
                            )}
                            {event.location && (
                              <div className="text-gray-500 text-xs">📍 {event.location}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {event.lecturer || event.instructor || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(event)}
                            className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(event.id)}
                            className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};