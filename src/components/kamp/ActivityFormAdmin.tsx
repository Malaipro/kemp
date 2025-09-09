import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Target, Book, Zap, Plus, User } from 'lucide-react';
import { toast } from 'sonner';

export const ActivityFormAdmin: React.FC = () => {
  const [selectedParticipantId, setSelectedParticipantId] = useState<string>('');
  const [rewardType, setRewardType] = useState<string>('');
  const [subtype, setSubtype] = useState<string>('');
  const [points, setPoints] = useState<number>(1);
  const [multiplier, setMultiplier] = useState<number>(1.0);
  const [description, setDescription] = useState<string>('');
  const [verifiedBy, setVerifiedBy] = useState<string>('');
  const [activityDate, setActivityDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const queryClient = useQueryClient();

  // Get current stream participants
  const { data: participants, isLoading: participantsLoading } = useQuery({
    queryKey: ['current-stream-participants'],
    queryFn: async () => {
      // Get current stream
      const { data: currentStream } = await supabase
        .from('intensive_streams')
        .select('id')
        .eq('is_current', true)
        .single();

      if (!currentStream) {
        throw new Error('No current stream found');
      }

      // Get participants from current stream
      const { data, error } = await supabase
        .from('участники')
        .select('id, name, last_name, points')
        .eq('stream_id', currentStream.id)
        .order('name');

      if (error) throw error;
      return data;
    }
  });

  const addActivityMutation = useMutation({
    mutationFn: async (activityData: any) => {
      const { error } = await supabase
        .from('кэмп_активности')
        .insert(activityData);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Активность добавлена успешно');
      
      // Reset form
      setSelectedParticipantId('');
      setRewardType('');
      setSubtype('');
      setPoints(1);
      setMultiplier(1.0);
      setDescription('');
      setVerifiedBy('');
      setActivityDate(new Date().toISOString().split('T')[0]);

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['kamp-progress'] });
      queryClient.invalidateQueries({ queryKey: ['kamp-activities'] });
      queryClient.invalidateQueries({ queryKey: ['participants-list'] });
    },
    onError: (error: any) => {
      toast.error('Ошибка добавления активности: ' + error.message);
    }
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
    
    if (value === 'zakal' || value === 'gran') {
      setPoints(1);
    } else if (value === 'shram') {
      setPoints(6);
    }
  };

  const handleSubtypeChange = (value: string) => {
    setSubtype(value);
    
    const key = `${rewardType}-${value}`;
    if (pointsPresets[key]) {
      setPoints(pointsPresets[key]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedParticipantId) {
      toast.error('Выберите участника');
      return;
    }

    if (!rewardType) {
      toast.error('Выберите тип награды');
      return;
    }

    const selectedRewardType = rewardTypes.find(rt => rt.value === rewardType);
    if (selectedRewardType?.subtypes.length > 0 && !subtype) {
      toast.error('Выберите подтип для данного типа награды');
      return;
    }

    const activityData: any = {
      participant_id: selectedParticipantId,
      reward_type: rewardType,
      points,
      multiplier,
      description: description || null,
      verified_by: verifiedBy || null,
      activity_date: activityDate
    };

    if (rewardType === 'zakal' && subtype) {
      activityData.zakal_subtype = subtype;
    } else if (rewardType === 'shram' && subtype) {
      activityData.shram_subtype = subtype;
    }

    addActivityMutation.mutate(activityData);
  };

  const selectedRewardType = rewardTypes.find(rt => rt.value === rewardType);
  const finalPoints = Math.round(points * multiplier);

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader>
        <CardTitle className="text-xl text-kamp-accent flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Добавить активность участнику
        </CardTitle>
        <p className="text-gray-400">Добавьте активность любому участнику текущего потока</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Participant Selection */}
          <div>
            <Label htmlFor="participant">Участник *</Label>
            <Select value={selectedParticipantId} onValueChange={setSelectedParticipantId}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите участника" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300 z-50">
                {participantsLoading ? (
                  <SelectItem value="loading" disabled>Загрузка участников...</SelectItem>
                ) : (
                  participants?.map((participant) => (
                    <SelectItem key={participant.id} value={participant.id}>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {participant.name} {participant.last_name} ({participant.points} баллов)
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Reward Type */}
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

          {/* Subtype */}
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

          {/* Points and Multiplier */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="points">Базовые баллы</Label>
              <Input
                id="points"
                type="number"
                min="1"
                value={points}
                onChange={(e) => setPoints(parseInt(e.target.value) || 1)}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div>
              <Label htmlFor="multiplier">Множитель</Label>
              <Select value={multiplier.toString()} onValueChange={(value) => setMultiplier(parseFloat(value))}>
                <SelectTrigger className="bg-white border-gray-300">
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

          {/* Activity Date */}
          <div>
            <Label htmlFor="activity-date">Дата активности</Label>
            <Input
              id="activity-date"
              type="date"
              value={activityDate}
              onChange={(e) => setActivityDate(e.target.value)}
              className="bg-gray-800 border-gray-700"
            />
          </div>

          {/* Verified By */}
          <div>
            <Label htmlFor="verified-by">Подтвердил (тренер/куратор)</Label>
            <Input
              id="verified-by"
              value={verifiedBy}
              onChange={(e) => setVerifiedBy(e.target.value)}
              placeholder="Имя тренера или куратора"
              className="bg-gray-800 border-gray-700"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Описание (необязательно)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Дополнительная информация об активности"
              rows={3}
              className="bg-gray-800 border-gray-700"
            />
          </div>

          <Button
            type="submit"
            disabled={addActivityMutation.isPending}
            className="w-full bg-kamp-accent text-black hover:bg-kamp-accent/80"
          >
            {addActivityMutation.isPending ? 'Добавление...' : 'Добавить активность'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};