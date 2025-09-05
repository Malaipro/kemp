import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Calendar, CheckCircle, XCircle, Target } from 'lucide-react';

interface ParticipantAscetic {
  id: string;
  name: string;
  description: string;
  duration_days: number;
  start_date: string;
  end_date: string;
  completion_percentage: number;
  is_completed: boolean;
}

export const AsceticTracker: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [newAsceticName, setNewAsceticName] = useState('');
  const [newAsceticDescription, setNewAsceticDescription] = useState('');
  const [newAsceticDuration, setNewAsceticDuration] = useState(14);
  const [newAsceticStartDate, setNewAsceticStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: participant } = useQuery({
    queryKey: ['current-participant'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('участники')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: ascetics = [] } = useQuery({
    queryKey: ['participant-ascetics', participant?.id],
    queryFn: async (): Promise<ParticipantAscetic[]> => {
      if (!participant?.id) return [];
      
      const { data, error } = await supabase
        .from('аскезы_участников')
        .select('*')
        .eq('participant_id', participant.id)
        .order('start_date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!participant?.id,
  });

  const handleCreateAscetic = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!participant) {
      toast({
        title: "Ошибка",
        description: "Необходимо войти в систему",
        variant: "destructive",
      });
      return;
    }

    if (!newAsceticName.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите название аскезы",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const startDate = new Date(newAsceticStartDate);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + newAsceticDuration - 1);

      const { error } = await supabase
        .from('аскезы_участников')
        .insert({
          participant_id: participant.id,
          name: newAsceticName.trim(),
          description: newAsceticDescription.trim() || null,
          duration_days: newAsceticDuration,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0]
        });

      if (error) throw error;

      toast({
        title: "Успешно!",
        description: "Аскеза создана",
      });

      // Сбрасываем форму
      setNewAsceticName('');
      setNewAsceticDescription('');
      setNewAsceticDuration(14);
      setNewAsceticStartDate(new Date().toISOString().split('T')[0]);
      setShowForm(false);

      // Обновляем кэш
      queryClient.invalidateQueries({ queryKey: ['participant-ascetics'] });
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось создать аскезу",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkDay = async (asceticId: string, date: string, completed: boolean) => {
    try {
    const { error } = await supabase
      .from('прогресс_аскез')
      .upsert({
          ascetic_id: asceticId,
          date,
          completed
        }, {
          onConflict: 'ascetic_id,date'
        });

      if (error) throw error;

      // Пересчитываем процент выполнения
      await updateAsceticCompletion(asceticId);

      queryClient.invalidateQueries({ queryKey: ['participant-ascetics'] });
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось обновить прогресс",
        variant: "destructive",
      });
    }
  };

  const updateAsceticCompletion = async (asceticId: string) => {
    try {
      // Получаем данные об аскезе и её прогрессе
      const { data: ascetic } = await supabase
        .from('аскезы_участников')
        .select('duration_days')
        .eq('id', asceticId)
        .single();

      const { data: progress } = await supabase
        .from('прогресс_аскез')
        .select('completed')
        .eq('ascetic_id', asceticId);

      if (ascetic && progress) {
        const completedDays = progress.filter(p => p.completed).length;
        const percentage = Math.round((completedDays / ascetic.duration_days) * 100);
        const isCompleted = percentage >= 85; // 85% для завершения

        await supabase
          .from('аскезы_участников')
          .update({
            completion_percentage: percentage,
            is_completed: isCompleted
          })
          .eq('id', asceticId);
      }
    } catch (error) {
      console.error('Error updating ascetic completion:', error);
    }
  };

  const getAsceticDays = (ascetic: ParticipantAscetic) => {
    const days = [];
    const startDate = new Date(ascetic.start_date);
    
    for (let i = 0; i < ascetic.duration_days; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date.toISOString().split('T')[0]);
    }
    
    return days;
  };

  if (!participant) {
    return (
      <Card className="kamp-card">
        <CardContent className="text-center py-8">
          <p className="text-gray-400">Для отслеживания аскез необходимо войти в систему</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="kamp-card">
        <CardHeader>
          <CardTitle className="text-xl text-kamp-accent flex items-center gap-2">
            <Target className="w-5 h-5" />
            Трекер аскез
          </CardTitle>
          <p className="text-gray-400">Отслеживайте выполнение личных вызовов и аскез</p>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-300">
              Для получения тотема "Монах" нужно выполнить 2 аскезы по 14 дней каждая с результатом ≥85%
            </p>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-kamp-accent text-black hover:bg-kamp-accent/80"
            >
              <Plus className="w-4 h-4 mr-2" />
              Новая аскеза
            </Button>
          </div>

          {showForm && (
            <Card className="mb-6 bg-gray-800/50 border-gray-700">
              <CardContent className="pt-6">
                <form onSubmit={handleCreateAscetic} className="space-y-4">
                  <div>
                    <Label htmlFor="ascetic-name">Название аскезы *</Label>
                    <Input
                      id="ascetic-name"
                      value={newAsceticName}
                      onChange={(e) => setNewAsceticName(e.target.value)}
                      placeholder="Например: Без сахара, Медитация 10 мин, Сон ≥7 часов"
                    />
                  </div>

                  <div>
                    <Label htmlFor="ascetic-description">Описание</Label>
                    <Textarea
                      id="ascetic-description"
                      value={newAsceticDescription}
                      onChange={(e) => setNewAsceticDescription(e.target.value)}
                      placeholder="Подробное описание правил аскезы"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ascetic-duration">Длительность (дней)</Label>
                      <Input
                        id="ascetic-duration"
                        type="number"
                        min="1"
                        max="365"
                        value={newAsceticDuration}
                        onChange={(e) => setNewAsceticDuration(parseInt(e.target.value) || 14)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="ascetic-start-date">Дата начала</Label>
                      <Input
                        id="ascetic-start-date"
                        type="date"
                        value={newAsceticStartDate}
                        onChange={(e) => setNewAsceticStartDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-kamp-accent text-black hover:bg-kamp-accent/80"
                    >
                      {isSubmitting ? 'Создание...' : 'Создать аскезу'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                      Отмена
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {ascetics.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>У вас пока нет активных аскез</p>
                <p className="text-sm">Создайте первую аскезу для начала пути к тотему "Монах"</p>
              </div>
            ) : (
              ascetics.map((ascetic) => (
                <AsceticCard
                  key={ascetic.id}
                  ascetic={ascetic}
                  onMarkDay={handleMarkDay}
                  days={getAsceticDays(ascetic)}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface AsceticCardProps {
  ascetic: ParticipantAscetic;
  days: string[];
  onMarkDay: (asceticId: string, date: string, completed: boolean) => void;
}

const AsceticCard: React.FC<AsceticCardProps> = ({ ascetic, days, onMarkDay }) => {
  const { data: progress = [] } = useQuery({
    queryKey: ['ascetic-progress', ascetic.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('прогресс_аскез')
        .select('*')
        .eq('ascetic_id', ascetic.id);
      
      if (error) throw error;
      return data || [];
    },
  });

  const progressMap = new Map(progress.map(p => [p.date, p.completed]));
  const today = new Date().toISOString().split('T')[0];
  const endDate = new Date(ascetic.end_date);
  const isFinished = new Date() > endDate;

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg text-white">{ascetic.name}</CardTitle>
            {ascetic.description && (
              <p className="text-sm text-gray-400 mt-1">{ascetic.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={ascetic.is_completed ? "default" : "secondary"}>
              {ascetic.completion_percentage}%
            </Badge>
            {ascetic.is_completed && (
              <Badge className="bg-green-500 text-white">
                Завершено
              </Badge>
            )}
            {isFinished && !ascetic.is_completed && (
              <Badge variant="destructive">
                Не выполнено
              </Badge>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Прогресс</span>
            <span>{ascetic.completion_percentage}% (нужно ≥85%)</span>
          </div>
          <Progress value={ascetic.completion_percentage} className="h-2" />
        </div>
        
        <div className="text-sm text-gray-400">
          <div className="flex justify-between">
            <span>Период:</span>
            <span>
              {new Date(ascetic.start_date).toLocaleDateString('ru-RU')} - {new Date(ascetic.end_date).toLocaleDateString('ru-RU')}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Длительность:</span>
            <span>{ascetic.duration_days} дней</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {days.map((date, index) => {
            const isCompleted = progressMap.get(date) === true;
            const isFailed = progressMap.has(date) && !isCompleted;
            const isPast = date < today;
            const isToday = date === today;
            const isFuture = date > today;
            
            return (
              <button
                key={date}
                onClick={() => {
                  if (!isFuture && !isFinished) {
                    onMarkDay(ascetic.id, date, !isCompleted);
                  }
                }}
                disabled={isFuture || isFinished}
                className={`
                  aspect-square rounded-lg text-xs font-medium transition-colors
                  ${isCompleted 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : isFailed 
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : isToday
                        ? 'bg-kamp-accent text-black hover:bg-kamp-accent/80'
                        : isPast
                          ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                          : 'bg-gray-700 text-gray-400'
                  }
                  ${(isFuture || isFinished) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                `}
                title={`День ${index + 1} (${new Date(date).toLocaleDateString('ru-RU')})`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
        
        <div className="mt-4 text-xs text-gray-400 text-center">
          Нажмите на день, чтобы отметить выполнение/невыполнение
        </div>
      </CardContent>
    </Card>
  );
};