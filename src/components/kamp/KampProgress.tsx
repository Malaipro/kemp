import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Book, Zap, Star } from 'lucide-react';

interface KampProgressData {
  zakal_bjj: number;
  zakal_kick: number;
  zakal_ofp: number;
  gran: number;
  shram_bjj: number;
  shram_kick: number;
  shram_ofp: number;
  shram_tactics: number;
  total_points: number;
}

interface TotemRequirement {
  totem_type: string;
  name: string;
  description: string;
  icon: string;
  requirements: any;
}

interface ParticipantTotem {
  totem_type: string;
  earned_at: string;
}

export const KampProgress: React.FC = () => {
  const { data: participant, isLoading } = useQuery({
    queryKey: ['current-participant-progress'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('KampProgress: Current user:', user?.id, user?.email);
      
      if (!user) {
        console.log('KampProgress: No user found');
        return null;
      }
      
      // Сначала пытаемся найти существующую запись участника
      const { data: existingParticipant, error: selectError } = await supabase
        .from('участники')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (selectError) {
        console.error('KampProgress: Error finding participant:', selectError);
        throw selectError;
      }

      if (existingParticipant) {
        console.log('KampProgress: Found existing participant:', existingParticipant.id);
        return existingParticipant;
      }

      // Если записи нет, создаем новую
      console.log('KampProgress: Creating new participant for user:', user.id);
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
        console.error('KampProgress: Error creating participant:', insertError);
        throw insertError;
      }

      console.log('KampProgress: Created new participant:', newParticipant.id);
      return newParticipant;
    },
  });

  const { data: progressData } = useQuery({
    queryKey: ['kamp-progress', participant?.id],
    queryFn: async (): Promise<KampProgressData | null> => {
      if (!participant?.id) return null;
      
      const { data, error } = await supabase.rpc('calculate_participant_progress', {
        p_participant_id: participant.id
      });
      
      if (error) throw error;
      
      // Проверяем, что data является объектом с нужными свойствами
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        return data as unknown as KampProgressData;
      }
      
      return null;
    },
    enabled: !!participant?.id,
  });

  const { data: totemRequirements = [] } = useQuery({
    queryKey: ['totem-requirements'],
    queryFn: async (): Promise<TotemRequirement[]> => {
      const { data, error } = await supabase
        .from('требования_тотемов')
        .select('*')
        .order('totem_type');
      
      if (error) throw error;
      return data || [];
    },
  });

  const { data: earnedTotems = [] } = useQuery({
    queryKey: ['participant-totems', participant?.id],
    queryFn: async (): Promise<ParticipantTotem[]> => {
      if (!participant?.id) return [];
      
      const { data, error } = await supabase
        .from('тотемы_участников')
        .select('totem_type, earned_at')
        .eq('participant_id', participant.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!participant?.id,
  });

  if (isLoading) {
    return (
      <Card className="kamp-card">
        <CardContent className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kamp-accent mx-auto mb-4"></div>
          <p className="text-gray-400">Загрузка прогресса...</p>
        </CardContent>
      </Card>
    );
  }

  if (!participant || !progressData) {
    return (
      <Card className="kamp-card">
        <CardContent className="text-center py-8">
          <p className="text-gray-400 mb-4">Для просмотра прогресса необходимо войти в систему</p>
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

  const getTotemProgress = (requirement: TotemRequirement) => {
    const req = requirement.requirements;
    const earnedTotem = earnedTotems.find(t => t.totem_type === requirement.totem_type);
    
    let progress = 0;
    let maxProgress = 1;
    
    if (requirement.totem_type === 'snake') {
      progress = (progressData.zakal_bjj >= (req.zakal_bjj || 0) ? 0.7 : 0) + 
                (progressData.shram_bjj >= (req.shram_bjj || 0) ? 0.3 : 0);
    } else if (requirement.totem_type === 'paw') {
      progress = (progressData.zakal_kick >= (req.zakal_kick || 0) ? 0.7 : 0) + 
                (progressData.shram_kick >= (req.shram_kick || 0) ? 0.3 : 0);
    } else if (requirement.totem_type === 'hammer') {
      progress = (progressData.zakal_ofp >= (req.zakal_ofp || 0) ? 0.7 : 0) + 
                (progressData.shram_ofp >= (req.shram_ofp || 0) ? 0.3 : 0);
    } else if (requirement.totem_type === 'blade') {
      const hasAllShramy = progressData.shram_bjj >= 1 && progressData.shram_kick >= 1 && progressData.shram_ofp >= 1;
      progress = hasAllShramy ? 1 : 0;
    } else {
      // Для других тотемов используем базовую логику
      progress = 0.5; // Примерный прогресс
    }
    
    return {
      progress: earnedTotem ? 100 : Math.round(progress * 100),
      isEarned: !!earnedTotem,
      earnedAt: earnedTotem?.earned_at
    };
  };

  return (
    <div className="space-y-6">
      <Card className="kamp-card">
        <CardHeader>
          <CardTitle className="text-2xl text-kamp-accent flex items-center gap-2">
            <Trophy className="w-6 h-6" />
            Мой прогресс КЭМП
          </CardTitle>
          <p className="text-gray-400">Текущие достижения и прогресс по направлениям</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-800/50 rounded-lg">
              <div className="text-2xl font-bold text-kamp-accent">{progressData.total_points}</div>
              <div className="text-sm text-gray-400">Общие баллы</div>
            </div>
            <div className="text-center p-4 bg-gray-800/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">
                {progressData.zakal_bjj + progressData.zakal_kick + progressData.zakal_ofp}
              </div>
              <div className="text-sm text-gray-400">Закалы</div>
            </div>
            <div className="text-center p-4 bg-gray-800/50 rounded-lg">
              <div className="text-2xl font-bold text-green-400">{progressData.gran}</div>
              <div className="text-sm text-gray-400">Грани</div>
            </div>
            <div className="text-center p-4 bg-gray-800/50 rounded-lg">
              <div className="text-2xl font-bold text-red-400">
                {progressData.shram_bjj + progressData.shram_kick + progressData.shram_ofp + progressData.shram_tactics}
              </div>
              <div className="text-sm text-gray-400">Шрамы</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Детализация по типам</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                <h4 className="font-semibold text-blue-400 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Закалы (физика)
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>БЖЖ:</span>
                    <span className="text-blue-400">{progressData.zakal_bjj}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Кикбоксинг:</span>
                    <span className="text-blue-400">{progressData.zakal_kick}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ОФП:</span>
                    <span className="text-blue-400">{progressData.zakal_ofp}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                <h4 className="font-semibold text-green-400 mb-3 flex items-center gap-2">
                  <Book className="w-4 h-4" />
                  Грани (теория)
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Всего:</span>
                    <span className="text-green-400">{progressData.gran}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Лекции + ДЗ по Пирамиде КЭМП и нутрициологии
                  </div>
                </div>
              </div>

              <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                <h4 className="font-semibold text-red-400 mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Шрамы (испытания)
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>БЖЖ:</span>
                    <span className="text-red-400">{progressData.shram_bjj}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Кикбоксинг:</span>
                    <span className="text-red-400">{progressData.shram_kick}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ОФП:</span>
                    <span className="text-red-400">{progressData.shram_ofp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Тактика:</span>
                    <span className="text-red-400">{progressData.shram_tactics}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="kamp-card">
        <CardHeader>
          <CardTitle className="text-xl text-kamp-accent flex items-center gap-2">
            <Star className="w-5 h-5" />
            Прогресс к тотемам
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {totemRequirements.filter(req => !req.requirements.special).map((requirement) => {
              const { progress, isEarned, earnedAt } = getTotemProgress(requirement);
              
              return (
                <div key={requirement.totem_type} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{requirement.icon}</span>
                      <div>
                        <h4 className="font-semibold text-white">{requirement.name}</h4>
                        <p className="text-xs text-gray-400">{requirement.description}</p>
                      </div>
                    </div>
                    {isEarned && (
                      <Badge className="bg-kamp-accent text-black">
                        Получен
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Прогресс</span>
                      <span className={isEarned ? "text-kamp-accent" : "text-gray-400"}>
                        {progress}%
                      </span>
                    </div>
                    <Progress 
                      value={progress} 
                      className="h-2"
                    />
                    {isEarned && earnedAt && (
                      <p className="text-xs text-gray-400">
                        Получен: {new Date(earnedAt).toLocaleDateString('ru-RU')}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};