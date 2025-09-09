import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Users, Target, Medal } from 'lucide-react';

interface ProgressStats {
  totalPoints: number;
  totalZakals: number;
  totalGrans: number;
  totalShramy: number;
  participantCount: number;
  zakalsByType: {
    bjj: number;
    kick: number;
    ofp: number;
  };
  shramsByType: {
    bjj: number;
    kick: number;
    ofp: number;
    tactics: number;
  };
}

export const AllParticipantsProgress: React.FC = () => {
  const { data: progressStats, isLoading, error } = useQuery({
    queryKey: ['all-participants-progress'],
    queryFn: async (): Promise<ProgressStats> => {
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
      const { data: participants, error: participantsError } = await supabase
        .from('участники')
        .select('id, points')
        .eq('stream_id', currentStream.id);

      if (participantsError) throw participantsError;

      const participantIds = participants?.map(p => p.id) || [];
      
      if (participantIds.length === 0) {
        return {
          totalPoints: 0,
          totalZakals: 0,
          totalGrans: 0,
          totalShramy: 0,
          participantCount: 0,
          zakalsByType: { bjj: 0, kick: 0, ofp: 0 },
          shramsByType: { bjj: 0, kick: 0, ofp: 0, tactics: 0 }
        };
      }

      // Get activities for current stream participants
      const { data: activities, error: activitiesError } = await supabase
        .from('кэмп_активности')
        .select('reward_type, zakal_subtype, shram_subtype, points, multiplier')
        .in('participant_id', participantIds);

      if (activitiesError) throw activitiesError;

      const totalPoints = participants?.reduce((sum, p) => sum + (p.points || 0), 0) || 0;
      
      let totalZakals = 0;
      let totalGrans = 0;
      let totalShramy = 0;
      
      const zakalsByType = { bjj: 0, kick: 0, ofp: 0 };
      const shramsByType = { bjj: 0, kick: 0, ofp: 0, tactics: 0 };

      activities?.forEach(activity => {
        switch (activity.reward_type) {
          case 'zakal':
            totalZakals++;
            if (activity.zakal_subtype) {
              zakalsByType[activity.zakal_subtype]++;
            }
            break;
          case 'gran':
            totalGrans++;
            break;
          case 'shram':
            totalShramy++;
            if (activity.shram_subtype) {
              shramsByType[activity.shram_subtype]++;
            }
            break;
        }
      });

      return {
        totalPoints,
        totalZakals,
        totalGrans,
        totalShramy,
        participantCount: participants?.length || 0,
        zakalsByType,
        shramsByType
      };
    }
  });

  if (isLoading) {
    return (
      <section className="kamp-section">
        <div className="kamp-container">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kamp-accent mx-auto"></div>
            <p className="text-gray-400 mt-4">Загружаем прогресс участников...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="kamp-section">
        <div className="kamp-container">
          <div className="text-center text-red-400">
            Ошибка загрузки данных
          </div>
        </div>
      </section>
    );
  }

  const stats = progressStats!;

  return (
    <section className="kamp-section">
      <div className="kamp-container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            <Trophy className="w-10 h-10 text-kamp-accent inline-block mr-3" />
            Общий прогресс КЭМП
          </h2>
          <p className="text-gray-400 text-lg">
            Текущие достижения и прогресс по всем направлениям
          </p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">{stats.participantCount}</div>
              <div className="text-gray-400 text-sm">Участников</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 text-kamp-accent mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">{stats.totalPoints}</div>
              <div className="text-gray-400 text-sm">Общие баллы</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">{stats.totalZakals}</div>
              <div className="text-gray-400 text-sm">Закалы</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6 text-center">
              <Medal className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">{stats.totalShramy}</div>
              <div className="text-gray-400 text-sm">Шрамы</div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Progress */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Закалы (физика) */}
          <Card className="bg-blue-900/20 border-blue-800/50">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Закалы (физика)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">БЖЖ:</span>
                <span className="text-white font-bold">{stats.zakalsByType.bjj}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Кикбоксинг:</span>
                <span className="text-white font-bold">{stats.zakalsByType.kick}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">ОФП:</span>
                <span className="text-white font-bold">{stats.zakalsByType.ofp}</span>
              </div>
            </CardContent>
          </Card>

          {/* Грани (теория) */}
          <Card className="bg-green-900/20 border-green-800/50">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Грани (теория)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Всего:</span>
                <span className="text-white font-bold">{stats.totalGrans}</span>
              </div>
              <p className="text-gray-400 text-sm mt-2">
                Лекции + ДЗ по Пирамиде КЭМП и нутрициологии
              </p>
            </CardContent>
          </Card>

          {/* Шрамы (испытания) */}
          <Card className="bg-red-900/20 border-red-800/50">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <Medal className="w-5 h-5" />
                Шрамы (испытания)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">БЖЖ:</span>
                <span className="text-white font-bold">{stats.shramsByType.bjj}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Кикбоксинг:</span>
                <span className="text-white font-bold">{stats.shramsByType.kick}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">ОФП:</span>
                <span className="text-white font-bold">{stats.shramsByType.ofp}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Тактика:</span>
                <span className="text-white font-bold">{stats.shramsByType.tactics}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};