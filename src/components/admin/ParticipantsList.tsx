import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Trophy, Target, Book, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Participant {
  id: string;
  name: string;
  points: number;
  created_at: string;
  user_id: string;
  progress?: {
    zakal_bjj: number;
    zakal_kick: number;
    zakal_ofp: number;
    gran: number;
    shram_bjj: number;
    shram_kick: number;
    shram_ofp: number;
    shram_tactics: number;
    total_points: number;
  };
  totems?: Array<{
    totem_type: string;
    earned_at: string;
  }>;
}

export const ParticipantsList: React.FC = () => {
  const { data: participants = [], isLoading } = useQuery({
    queryKey: ['participants-list'],
    queryFn: async (): Promise<Participant[]> => {
      const { data, error } = await supabase
        .from('участники')
        .select(`
          id,
          name,
          points,
          created_at,
          user_id
        `)
        .order('points', { ascending: false });

      if (error) throw error;

      // Получаем прогресс и тотемы для каждого участника
      const participantsWithProgress = await Promise.all(
        (data || []).map(async (participant) => {
          try {
            // Получаем прогресс
            const { data: progress } = await supabase.rpc('calculate_participant_progress', {
              p_participant_id: participant.id
            });

            // Получаем тотемы
            const { data: totems } = await supabase
              .from('тотемы_участников')
              .select('totem_type, earned_at')
              .eq('participant_id', participant.id);

            return {
              ...participant,
              progress: progress && typeof progress === 'object' ? progress as any : undefined,
              totems: totems || []
            };
          } catch (error) {
            console.error('Error loading participant data:', error);
            return {
              ...participant,
              progress: undefined,
              totems: []
            };
          }
        })
      );

      return participantsWithProgress;
    },
  });

  const getTotemIcon = (totemType: string) => {
    const icons: Record<string, string> = {
      snake: '🐍',
      paw: '🐾', 
      hammer: '🔨',
      star: '⭐',
      sprout: '🌱',
      compass: '🧭',
      monk: '🧘',
      blade: '⚔️',
      lighthouse: '🏮',
      bear: '🐻'
    };
    return icons[totemType] || '🏆';
  };

  if (isLoading) {
    return (
      <Card className="kamp-card">
        <CardContent className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kamp-accent mx-auto"></div>
          <p className="text-gray-400 mt-4">Загрузка участников...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="kamp-card">
      <CardHeader>
        <CardTitle className="text-2xl text-kamp-accent flex items-center gap-2">
          <Users className="w-6 h-6" />
          Зарегистрированные участники ({participants.length})
        </CardTitle>
        <p className="text-gray-400">Список всех участников системы КЭМП с их прогрессом</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {participants.map((participant, index) => (
            <div key={participant.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-kamp-accent/20 rounded-full flex items-center justify-center">
                    <span className="text-kamp-accent font-bold">#{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{participant.name}</h3>
                    <p className="text-sm text-gray-400">
                      Регистрация: {format(new Date(participant.created_at), 'dd MMMM yyyy', { locale: ru })}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-kamp-accent">
                    {participant.progress?.total_points || participant.points}
                  </div>
                  <div className="text-sm text-gray-400">баллов</div>
                </div>
              </div>

              {participant.progress && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <div className="text-center p-2 bg-blue-500/10 rounded border border-blue-500/30">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Target className="w-3 h-3 text-blue-400" />
                      <span className="text-xs text-blue-400">Закалы</span>
                    </div>
                    <div className="text-sm font-bold text-blue-400">
                      {participant.progress.zakal_bjj + participant.progress.zakal_kick + participant.progress.zakal_ofp}
                    </div>
                  </div>

                  <div className="text-center p-2 bg-green-500/10 rounded border border-green-500/30">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Book className="w-3 h-3 text-green-400" />
                      <span className="text-xs text-green-400">Грани</span>
                    </div>
                    <div className="text-sm font-bold text-green-400">
                      {participant.progress.gran}
                    </div>
                  </div>

                  <div className="text-center p-2 bg-red-500/10 rounded border border-red-500/30">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Zap className="w-3 h-3 text-red-400" />
                      <span className="text-xs text-red-400">Шрамы</span>
                    </div>
                    <div className="text-sm font-bold text-red-400">
                      {participant.progress.shram_bjj + participant.progress.shram_kick + participant.progress.shram_ofp + participant.progress.shram_tactics}
                    </div>
                  </div>

                  <div className="text-center p-2 bg-kamp-accent/10 rounded border border-kamp-accent/30">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Trophy className="w-3 h-3 text-kamp-accent" />
                      <span className="text-xs text-kamp-accent">Тотемы</span>
                    </div>
                    <div className="text-sm font-bold text-kamp-accent">
                      {participant.totems?.length || 0}
                    </div>
                  </div>
                </div>
              )}

              {participant.totems && participant.totems.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {participant.totems.map((totem, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-kamp-accent/20 text-kamp-accent border-kamp-accent/30">
                      <span className="mr-1">{getTotemIcon(totem.totem_type)}</span>
                      {totem.totem_type}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {participants.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Пока нет зарегистрированных участников</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};