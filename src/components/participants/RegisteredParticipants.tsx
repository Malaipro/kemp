import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ParticipantCard } from './ParticipantCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Search, Filter, Trophy } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ParticipantWithAchievements {
  id: string;
  name: string;
  points: number;
  rank?: number;
  achievements?: any[];
  specialBadgesCount?: number;
  directionsCompleted?: number;
  totalDirections?: number;
}

export const RegisteredParticipants: React.FC = () => {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'points' | 'name' | 'achievements'>('points');

  // Fetch participants with their achievements
  const { data: participants, isLoading, error } = useQuery({
    queryKey: ['registered-participants'],
    queryFn: async (): Promise<ParticipantWithAchievements[]> => {
      // Получаем всех участников из представления leaderboard
      const { data: leaderboardData, error: leaderboardError } = await supabase
        .from('leaderboard')
        .select('*')
        .order('rank', { ascending: true });

      if (leaderboardError) throw leaderboardError;

      // Фильтруем супер админа
      const filteredData = leaderboardData?.filter(participant => 
        participant.name !== 'dishka' && 
        participant.name !== 'Дима' &&
        participant.name !== 'Димон'
      ) || [];

      const participantIds = filteredData?.map(p => p.id) || [];
      
      const [achievementsData, badgesData, directionsData, totalDirectionsData] = await Promise.all([
        // Get achievements count
        supabase
          .from('user_achievements')
          .select('participant_id, id')
          .in('participant_id', participantIds),
        
        // Get special badges count  
        supabase
          .from('user_special_badges')
          .select('participant_id, id')
          .in('participant_id', participantIds),
          
        // Get direction progress
        supabase
          .from('direction_progress')
          .select('participant_id, totem_earned')
          .in('participant_id', participantIds),
          
        // Get total directions count
        supabase
          .from('directions')
          .select('id')
      ]);

      const achievementsCounts = achievementsData.data?.reduce((acc, item) => {
        acc[item.participant_id] = (acc[item.participant_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const badgesCounts = badgesData.data?.reduce((acc, item) => {
        acc[item.participant_id] = (acc[item.participant_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const directionsCompleted = directionsData.data?.reduce((acc, item) => {
        if (item.totem_earned) {
          acc[item.participant_id] = (acc[item.participant_id] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>) || {};

      const totalDirections = totalDirectionsData.data?.length || 0;

      // Combine all data
      return filteredData?.map((participant, index) => ({
        id: participant.id || '',
        name: participant.name || '',
        points: participant.points || 0,
        rank: index + 1, // Пересчитываем ранг после фильтрации
        achievements: [], // Массив достижений
        specialBadgesCount: badgesCounts[participant.id || ''] || 0,
        directionsCompleted: directionsCompleted[participant.id || ''] || 0,
        totalDirections
      })) || [];
    },
    staleTime: 30000, // 30 seconds
  });

  // Filter and sort participants
  const filteredAndSortedParticipants = React.useMemo(() => {
    if (!participants) return [];

    let filtered = participants.filter(participant =>
      participant.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'points':
          return (b.points || 0) - (a.points || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'achievements':
          return (b.specialBadgesCount || 0) - (a.specialBadgesCount || 0);
        default:
          return 0;
      }
    });
  }, [participants, searchTerm, sortBy]);

  const totalParticipants = participants?.length || 0;
  const averagePoints = participants?.length 
    ? Math.round(participants.reduce((sum, p) => sum + (p.points || 0), 0) / participants.length)
    : 0;

  if (error) {
    return (
      <section id="participants" className="kamp-section bg-black">
        <div className="kamp-container">
          <Card className="glass-card">
            <CardContent className="p-8 text-center">
              <p className="text-red-400">Ошибка загрузки участников</p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="participants" className="kamp-section bg-black">
      <div className="kamp-container space-y-8">
        {/* Section Header */}
        <div className="section-heading">
          <h2 className="text-gradient">Участники КЭМП</h2>
          <p>Активные участники клуба и их достижения в системе геймификации</p>
        </div>

        {/* Statistics */}
        <div className={`grid ${isMobile ? 'grid-cols-2 gap-4' : 'grid-cols-4 gap-6'}`}>
          <Card className="glass-card">
            <CardContent className={`${isMobile ? 'p-4' : 'p-6'} text-center`}>
              <Users className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-kamp-accent mx-auto mb-2`} />
              <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-kamp-light`}>
                {totalParticipants}
              </div>
              <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-400`}>
                Участников
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className={`${isMobile ? 'p-4' : 'p-6'} text-center`}>
              <Trophy className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-yellow-400 mx-auto mb-2`} />
              <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-kamp-light`}>
                {averagePoints}
              </div>
              <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-400`}>
                Средний балл
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Controls */}
        <Card className="glass-card">
          <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
            <div className={`flex ${isMobile ? 'flex-col gap-4' : 'flex-row items-center justify-between gap-6'}`}>
              <div className={`flex items-center gap-2 ${isMobile ? 'w-full' : 'flex-1 max-w-md'}`}>
                <Search className="w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Поиск участников..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-black/50 border-gray-700 text-kamp-light"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <Select value={sortBy} onValueChange={(value: 'points' | 'name' | 'achievements') => setSortBy(value)}>
                  <SelectTrigger className={`${isMobile ? 'w-full' : 'w-48'} bg-white border-gray-300 text-gray-900`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300 z-50">
                    <SelectItem value="points">По баллам</SelectItem>
                    <SelectItem value="name">По имени</SelectItem>
                    <SelectItem value="achievements">По достижениям</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Participants Grid */}
        {isLoading ? (
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-2 w-full" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {filteredAndSortedParticipants.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="p-8 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">
                    {searchTerm ? 'Участники не найдены' : 'Нет зарегистрированных участников'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
                {filteredAndSortedParticipants.map((participant) => (
                  <ParticipantCard
                    key={participant.id}
                    participant={{
                      ...participant,
                      specialBadges: participant.specialBadgesCount
                    }}
                    showRank={sortBy === 'points'}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};