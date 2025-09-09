import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useRole } from '@/hooks/useRole';
import { useAuth } from '@/hooks/useAuth';
import { Target, User, Plus, Calendar, Award } from 'lucide-react';
import { toast } from 'sonner';
import { AsceticTracker } from './AsceticTracker';

interface Participant {
  id: string;
  name: string;
  last_name: string | null;
  points: number;
}

interface ParticipantAscetic {
  id: string;
  name: string;
  description: string | null;
  duration_days: number;
  start_date: string;
  end_date: string;
  completion_percentage: number;
  is_completed: boolean;
  participant_id: string;
  participant?: {
    name: string;
    last_name: string | null;
  };
}

export const AsceticManagement: React.FC = () => {
  const { user } = useAuth();
  const { isSuperAdmin } = useRole();
  const queryClient = useQueryClient();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showPointsForm, setShowPointsForm] = useState(false);
  const [selectedParticipantId, setSelectedParticipantId] = useState('');
  const [pointsParticipantId, setPointsParticipantId] = useState('');
  const [points, setPoints] = useState(5);
  const [pointsDescription, setPointsDescription] = useState('');

  // Ascetic form state
  const [asceticName, setAsceticName] = useState('');
  const [asceticDescription, setAsceticDescription] = useState('');
  const [asceticDuration, setAsceticDuration] = useState(14);
  const [asceticStartDate, setAsceticStartDate] = useState(new Date().toISOString().split('T')[0]);

  // Get current user's participant data
  const { data: currentParticipant } = useQuery({
    queryKey: ['current-participant-ascetic-mgmt'],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('участники')
        .select('id, name, last_name, points')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user && !isSuperAdmin
  });

  // Get all participants (admin only)
  const { data: allParticipants } = useQuery({
    queryKey: ['all-participants-ascetic'],
    queryFn: async () => {
      // Get current stream
      const { data: currentStream } = await supabase
        .from('intensive_streams')
        .select('id')
        .eq('is_current', true)
        .maybeSingle();

      if (!currentStream) return [];

      const { data, error } = await supabase
        .from('участники')
        .select('id, name, last_name, points')
        .eq('stream_id', currentStream.id)
        .order('name');

      if (error) throw error;
      return data;
    },
    enabled: isSuperAdmin
  });

  // Get all ascetics (admin view)
  const { data: allAscetics, isLoading: asceticsLoading } = useQuery({
    queryKey: ['all-ascetics', isSuperAdmin],
    queryFn: async () => {
      if (!isSuperAdmin) return [];

      // Get current stream participants
      const { data: currentStream } = await supabase
        .from('intensive_streams')
        .select('id')
        .eq('is_current', true)
        .maybeSingle();

      if (!currentStream) return [];

      const { data: streamParticipants } = await supabase
        .from('участники')
        .select('id')
        .eq('stream_id', currentStream.id);

      if (!streamParticipants?.length) return [];

      const participantIds = streamParticipants.map(p => p.id);

      // Get ascetics for these participants
      const { data: ascetics, error: asceticsError } = await supabase
        .from('аскезы_участников')
        .select('*')
        .in('participant_id', participantIds)
        .order('start_date', { ascending: false });

      if (asceticsError) throw asceticsError;

      if (!ascetics?.length) return [];

      // Get participant info
      const { data: participants, error: participantsError } = await supabase
        .from('участники')
        .select('id, name, last_name')
        .in('id', participantIds);

      if (participantsError) throw participantsError;

      const participantMap = new Map(participants?.map(p => [p.id, p]) || []);

      return ascetics.map(ascetic => ({
        ...ascetic,
        participant: participantMap.get(ascetic.participant_id) || null
      }));
    },
    enabled: isSuperAdmin
  });

  const createAsceticMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('аскезы_участников')
        .insert(data);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Аскеза создана для участника');
      queryClient.invalidateQueries({ queryKey: ['all-ascetics'] });
      resetAsceticForm();
    },
    onError: (error: any) => {
      toast.error('Ошибка: ' + error.message);
    }
  });

  const addPointsMutation = useMutation({
    mutationFn: async (data: { participantId: string; points: number; description: string }) => {
      // Add points activity
      const { error: activityError } = await supabase
        .from('кэмп_активности')
        .insert({
          participant_id: data.participantId,
          reward_type: 'gran',
          points: data.points,
          multiplier: 1.0,
          description: `Аскеза: ${data.description}`,
          verified_by: 'Система',
          activity_date: new Date().toISOString().split('T')[0]
        });

      if (activityError) throw activityError;

      // Update participant points
      const { data: currentParticipant, error: fetchError } = await supabase
        .from('участники')
        .select('points')
        .eq('id', data.participantId)
        .single();

      if (fetchError) throw fetchError;

      const { error: updateError } = await supabase
        .from('участники')
        .update({ 
          points: (currentParticipant?.points || 0) + data.points
        })
        .eq('id', data.participantId);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      toast.success('Баллы начислены участнику');
      queryClient.invalidateQueries({ queryKey: ['all-participants-ascetic'] });
      resetPointsForm();
    },
    onError: (error: any) => {
      toast.error('Ошибка: ' + error.message);
    }
  });

  const resetAsceticForm = () => {
    setShowCreateForm(false);
    setSelectedParticipantId('');
    setAsceticName('');
    setAsceticDescription('');
    setAsceticDuration(14);
    setAsceticStartDate(new Date().toISOString().split('T')[0]);
  };

  const resetPointsForm = () => {
    setShowPointsForm(false);
    setPointsParticipantId('');
    setPoints(5);
    setPointsDescription('');
  };

  const handleCreateAscetic = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedParticipantId) {
      toast.error('Выберите участника');
      return;
    }

    if (!asceticName.trim()) {
      toast.error('Введите название аскезы');
      return;
    }

    const startDate = new Date(asceticStartDate);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + asceticDuration - 1);

    createAsceticMutation.mutate({
      participant_id: selectedParticipantId,
      name: asceticName.trim(),
      description: asceticDescription.trim() || null,
      duration_days: asceticDuration,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0]
    });
  };

  const handleAddPoints = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pointsParticipantId) {
      toast.error('Выберите участника');
      return;
    }

    if (!pointsDescription.trim()) {
      toast.error('Введите описание за что начисляются баллы');
      return;
    }

    addPointsMutation.mutate({
      participantId: pointsParticipantId,
      points: points,
      description: pointsDescription.trim()
    });
  };

  if (!isSuperAdmin) {
    return <AsceticTracker />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-kamp-accent" />
            Управление аскезами
          </h2>
          <p className="text-gray-400">Создавайте аскезы для участников и начисляйте баллы</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-kamp-accent hover:bg-kamp-accent/90 text-black"
          >
            <Plus className="w-4 h-4 mr-2" />
            Создать аскезу
          </Button>
          <Button
            onClick={() => setShowPointsForm(true)}
            variant="outline"
            className="border-kamp-accent text-kamp-accent hover:bg-kamp-accent hover:text-black"
          >
            <Award className="w-4 h-4 mr-2" />
            Начислить баллы
          </Button>
        </div>
      </div>

      {/* Create Ascetic Form */}
      {showCreateForm && (
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Создать аскезу для участника</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateAscetic} className="space-y-4">
              <div>
                <Label>Участник *</Label>
                <Select value={selectedParticipantId} onValueChange={setSelectedParticipantId}>
                  <SelectTrigger className="bg-white border-gray-300">
                    <SelectValue placeholder="Выберите участника" />
                  </SelectTrigger>
                    <SelectContent className="bg-white border-gray-300 z-50">
                      {allParticipants?.map(participant => (
                        <SelectItem key={participant.id} value={participant.id} className="hover:bg-gray-100">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {participant.name} {participant.last_name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Название аскезы *</Label>
                <Input
                  value={asceticName}
                  onChange={(e) => setAsceticName(e.target.value)}
                  placeholder="Например: Без сахара, Медитация 10 мин"
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div>
                <Label>Описание</Label>
                <Textarea
                  value={asceticDescription}
                  onChange={(e) => setAsceticDescription(e.target.value)}
                  placeholder="Подробное описание правил аскезы"
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Длительность (дней)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="365"
                    value={asceticDuration}
                    onChange={(e) => setAsceticDuration(parseInt(e.target.value) || 14)}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <Label>Дата начала</Label>
                  <Input
                    type="date"
                    value={asceticStartDate}
                    onChange={(e) => setAsceticStartDate(e.target.value)}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={createAsceticMutation.isPending}
                  className="bg-kamp-accent hover:bg-kamp-accent/90 text-black"
                >
                  Создать
                </Button>
                <Button type="button" variant="outline" onClick={resetAsceticForm}>
                  Отмена
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Add Points Form */}
      {showPointsForm && (
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-kamp-accent" />
              Начислить баллы участнику
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddPoints} className="space-y-4">
              <div>
                <Label>Участник *</Label>
                <Select value={pointsParticipantId} onValueChange={setPointsParticipantId}>
                  <SelectTrigger className="bg-white border-gray-300">
                    <SelectValue placeholder="Выберите участника" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300 z-50">
                    {allParticipants?.map(participant => (
                      <SelectItem key={participant.id} value={participant.id} className="hover:bg-gray-100">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {participant.name} {participant.last_name} ({participant.points} баллов)
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Количество баллов *</Label>
                <Input
                  type="number"
                  min="1"
                  max="50"
                  value={points}
                  onChange={(e) => setPoints(parseInt(e.target.value) || 1)}
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div>
                <Label>Описание (за что баллы) *</Label>
                <Input
                  value={pointsDescription}
                  onChange={(e) => setPointsDescription(e.target.value)}
                  placeholder="Например: Завершение аскезы, особые достижения"
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={addPointsMutation.isPending}
                  className="bg-kamp-accent hover:bg-kamp-accent/90 text-black"
                >
                  Начислить баллы
                </Button>
                <Button type="button" variant="outline" onClick={resetPointsForm}>
                  Отмена
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* All Ascetics List */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Все аскезы участников</CardTitle>
        </CardHeader>
        <CardContent>
          {asceticsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kamp-accent mx-auto"></div>
              <p className="text-gray-400 mt-2">Загрузка аскез...</p>
            </div>
          ) : allAscetics?.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Нет активных аскез</p>
            </div>
          ) : (
            <div className="space-y-4">
              {allAscetics?.map(ascetic => (
                <Card key={ascetic.id} className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2 flex-wrap">
                          {ascetic.participant && (
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="font-semibold text-white">
                                {ascetic.participant.name} {ascetic.participant.last_name}
                              </span>
                            </div>
                          )}
                          <h4 className="font-semibold text-kamp-accent">{ascetic.name}</h4>
                          <Badge variant={ascetic.is_completed ? "default" : "secondary"}>
                            {ascetic.completion_percentage}%
                          </Badge>
                          {ascetic.is_completed && (
                            <Badge className="bg-green-600 text-white">Завершено</Badge>
                          )}
                        </div>
                        
                        {ascetic.description && (
                          <p className="text-gray-400 text-sm mb-2">{ascetic.description}</p>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(ascetic.start_date).toLocaleDateString('ru-RU')} - {new Date(ascetic.end_date).toLocaleDateString('ru-RU')}
                            </span>
                          </div>
                          <span>{ascetic.duration_days} дней</span>
                        </div>
                        
                        <Progress value={ascetic.completion_percentage} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};