import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Target, Book, Zap, Plus } from 'lucide-react';

interface ActivityFormProps {
  onClose?: () => void;
}

export const ActivityForm: React.FC<ActivityFormProps> = ({ onClose }) => {
  const [rewardType, setRewardType] = useState<string>('');
  const [subtype, setSubtype] = useState<string>('');
  const [points, setPoints] = useState<number>(1);
  const [multiplier, setMultiplier] = useState<number>(1.0);
  const [description, setDescription] = useState<string>('');
  const [verifiedBy, setVerifiedBy] = useState<string>('');
  const [activityDate, setActivityDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: participant, isLoading } = useQuery({
    queryKey: ['current-participant'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('ActivityForm: Current user:', user?.id, user?.email);
      
      if (!user) {
        console.log('ActivityForm: No user found');
        return null;
      }
      
      // Сначала пытаемся найти существующую запись участника
      const { data: existingParticipant, error: selectError } = await supabase
        .from('участники')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (selectError) {
        console.error('ActivityForm: Error finding participant:', selectError);
        throw selectError;
      }

      if (existingParticipant) {
        console.log('ActivityForm: Found existing participant:', existingParticipant.id);
        return existingParticipant;
      }

      // Если записи нет, создаем новую
      console.log('ActivityForm: Creating new participant for user:', user.id);
      const { data: newParticipant, error: insertError } = await supabase
        .from('участники')
        .insert([{
          user_id: user.id,
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'Участник',
          last_name: user.user_metadata?.lastName || '',
          points: 0
        }])
        .select()
        .single();

      if (insertError) {
        console.error('ActivityForm: Error creating participant:', insertError);
        throw insertError;
      }

      console.log('ActivityForm: Created new participant:', newParticipant.id);
      return newParticipant;
    },
  });

  const rewardTypes = [
    { value: 'zakal', label: 'Закал (физика)', icon: <Target className="w-4 h-4" />, subtypes: ['bjj', 'kick', 'ofp'] },
    { value: 'gran', label: 'Грань (теория)', icon: <Book className="w-4 h-4" />, subtypes: ['homework_pyramid', 'nutrition'] },
    { value: 'shram', label: 'Шрам (испытания)', icon: <Zap className="w-4 h-4" />, subtypes: ['bjj', 'kick', 'ofp', 'tactics', 'crash_test_bjj', 'crash_test_kick', 'heroes_race'] }
  ];

  const subtypeLabels: Record<string, string> = {
    bjj: 'БЖЖ',
    kick: 'Кикбоксинг',
    ofp: 'ОФП',
    tactics: 'Тактика',
    homework_pyramid: 'ДЗ по Пирамиде',
    nutrition: 'Нутрициология',
    crash_test_bjj: 'Краш-тест БЖЖ',
    crash_test_kick: 'Краш-тест Кикбоксинг',
    heroes_race: 'Гонка героев'
  };

  const pointsPresets: Record<string, number> = {
    zakal: 1,
    gran: 1,
    'gran-homework_pyramid': 1,
    'gran-nutrition': 1,
    'shram-bjj': 6,
    'shram-kick': 6,
    'shram-ofp': 8,
    'shram-tactics': 3,
    'shram-crash_test_bjj': 6,
    'shram-crash_test_kick': 6,
    'shram-heroes_race': 8
  };

  const handleRewardTypeChange = (value: string) => {
    setRewardType(value);
    setSubtype('');
    
    // Устанавливаем базовые баллы
    if (value === 'zakal' || value === 'gran') {
      setPoints(1);
    } else if (value === 'shram') {
      setPoints(6); // Базовое значение для шрамов
    }
  };

  const handleSubtypeChange = (value: string) => {
    setSubtype(value);
    
    // Обновляем баллы в зависимости от подтипа
    const key = `${rewardType}-${value}`;
    if (pointsPresets[key]) {
      setPoints(pointsPresets[key]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!participant) {
      toast({
        title: "Ошибка",
        description: "Необходимо войти в систему",
        variant: "destructive",
      });
      return;
    }

    if (!rewardType) {
      toast({
        title: "Ошибка",
        description: "Выберите тип награды",
        variant: "destructive",
      });
      return;
    }

    // Проверяем обязательность подтипа
    const selectedRewardType = rewardTypes.find(rt => rt.value === rewardType);
    if (selectedRewardType?.subtypes.length > 0 && !subtype) {
      toast({
        title: "Ошибка",
        description: "Выберите подтип для данного типа награды",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const activityData: any = {
        participant_id: participant.id,
        reward_type: rewardType,
        points,
        multiplier,
        description: description || null,
        verified_by: verifiedBy || null,
        activity_date: activityDate
      };

      // Добавляем подтип если необходимо
      if (rewardType === 'zakal' && subtype) {
        activityData.zakal_subtype = subtype;
      } else if (rewardType === 'shram' && subtype) {
        activityData.shram_subtype = subtype;
      } else if (rewardType === 'gran' && subtype) {
        activityData.lecture_subtype = subtype;
      }

      const { error } = await supabase
        .from('кэмп_активности')
        .insert(activityData);

      if (error) throw error;

      toast({
        title: "Успешно!",
        description: "Активность добавлена",
      });

      // Сбрасываем форму
      setRewardType('');
      setSubtype('');
      setPoints(1);
      setMultiplier(1.0);
      setDescription('');
      setVerifiedBy('');
      setActivityDate(new Date().toISOString().split('T')[0]);

      // Обновляем кэш
      queryClient.invalidateQueries({ queryKey: ['kamp-progress'] });
      queryClient.invalidateQueries({ queryKey: ['kamp-activities'] });

      if (onClose) {
        onClose();
      }
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось добавить активность",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="kamp-card">
        <CardContent className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kamp-accent mx-auto mb-4"></div>
          <p className="text-gray-400">Загрузка данных участника...</p>
        </CardContent>
      </Card>
    );
  }

  if (!participant) {
    return (
      <Card className="kamp-card">
        <CardContent className="text-center py-8">
          <p className="text-gray-400 mb-4">Для добавления активностей необходимо войти в систему</p>
          <Button 
            onClick={() => window.location.href = '/auth'}
            className="bg-kamp-accent text-black hover:bg-kamp-accent/80"
          >
            Войти в систему
          </Button>
        </CardContent>
      </Card>
    );
  }

  const selectedRewardType = rewardTypes.find(rt => rt.value === rewardType);
  const finalPoints = Math.round(points * multiplier);

  return (
    <Card className="kamp-card">
      <CardHeader>
        <CardTitle className="text-xl text-kamp-accent flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Добавить активность КЭМП
        </CardTitle>
        <p className="text-gray-400">Зафиксируйте свои достижения в системе</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="reward-type">Тип награды *</Label>
            <Select value={rewardType} onValueChange={handleRewardTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип награды" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300 z-50">
                {rewardTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      {type.icon}
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedRewardType && selectedRewardType.subtypes.length > 0 && (
            <div>
              <Label htmlFor="subtype">Подтип *</Label>
              <Select value={subtype} onValueChange={handleSubtypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите подтип" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300 z-50">
                  {selectedRewardType.subtypes.map((st) => (
                    <SelectItem key={st} value={st}>
                      {subtypeLabels[st]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="points">Базовые баллы</Label>
              <Input
                id="points"
                type="number"
                min="1"
                value={points}
                onChange={(e) => setPoints(parseInt(e.target.value) || 1)}
              />
            </div>
            <div>
              <Label htmlFor="multiplier">Множитель</Label>
              <Select value={multiplier.toString()} onValueChange={(value) => setMultiplier(parseFloat(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300 z-50">
                  <SelectItem value="1.0">×1.0 (обычно)</SelectItem>
                  <SelectItem value="1.5">×1.5 (за сверхусилие)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {finalPoints !== points && (
            <div className="p-3 bg-kamp-accent/10 rounded-lg border border-kamp-accent/30">
              <p className="text-sm text-kamp-accent">
                Итоговые баллы с учетом множителя: <strong>{finalPoints}</strong>
              </p>
            </div>
          )}

          <div>
            <Label htmlFor="activity-date">Дата активности</Label>
            <Input
              id="activity-date"
              type="date"
              value={activityDate}
              onChange={(e) => setActivityDate(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="verified-by">Подтвердил (тренер/куратор)</Label>
            <Input
              id="verified-by"
              value={verifiedBy}
              onChange={(e) => setVerifiedBy(e.target.value)}
              placeholder="Имя тренера или куратора"
            />
          </div>

          <div>
            <Label htmlFor="description">Описание (необязательно)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Дополнительная информация об активности"
              rows={3}
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-kamp-accent text-black hover:bg-kamp-accent/80"
            >
              {isSubmitting ? 'Добавление...' : 'Добавить активность'}
            </Button>
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose}>
                Отмена
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};