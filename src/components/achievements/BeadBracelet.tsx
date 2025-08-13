import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BeadData {
  id: string;
  type: 'achievement' | 'badge' | 'totem';
  color: string;
  name: string;
  earned_at: string;
  position?: number;
}

export const BeadBracelet: React.FC = () => {
  const { data: beads, isLoading } = useQuery({
    queryKey: ['bead-bracelet'],
    queryFn: async (): Promise<BeadData[]> => {
      const beads: BeadData[] = [];
      
      // Get achievements
      const { data: achievements } = await supabase
        .from('user_achievements')
        .select(`
          id,
          earned_at,
          position,
          achievement_types:achievement_type_id (
            name,
            color
          )
        `)
        .order('earned_at', { ascending: true });

      if (achievements) {
        achievements.forEach(achievement => {
          beads.push({
            id: achievement.id,
            type: 'achievement',
            color: achievement.achievement_types.color,
            name: achievement.achievement_types.name,
            earned_at: achievement.earned_at,
            position: achievement.position
          });
        });
      }

      // Get special badges
      const { data: badges } = await supabase
        .from('user_special_badges')
        .select(`
          id,
          earned_at,
          special_badges:badge_id (
            name
          )
        `)
        .order('earned_at', { ascending: true });

      if (badges) {
        badges.forEach(badge => {
          beads.push({
            id: badge.id,
            type: 'badge',
            color: 'purple',
            name: badge.special_badges.name,
            earned_at: badge.earned_at
          });
        });
      }

      // Get totems (from completed directions)
      const { data: totems } = await supabase
        .from('direction_progress')
        .select(`
          id,
          updated_at,
          directions:direction_id (
            totem_name
          )
        `)
        .eq('totem_earned', true)
        .order('updated_at', { ascending: true });

      if (totems) {
        totems.forEach(totem => {
          beads.push({
            id: totem.id,
            type: 'totem',
            color: 'gold',
            name: totem.directions.totem_name,
            earned_at: totem.updated_at
          });
        });
      }

      // Sort all beads by earned date
      return beads.sort((a, b) => new Date(a.earned_at).getTime() - new Date(b.earned_at).getTime());
    },
  });

  const getBeadColor = (color: string, type: string) => {
    const colorMap: Record<string, string> = {
      'gold': 'bg-yellow-400 shadow-yellow-400/50',
      'silver': 'bg-gray-300 shadow-gray-300/50',
      'bronze': 'bg-orange-400 shadow-orange-400/50',
      'purple': 'bg-purple-500 shadow-purple-500/50',
      'blue': 'bg-blue-500 shadow-blue-500/50',
      'green': 'bg-green-500 shadow-green-500/50',
      'red': 'bg-red-500 shadow-red-500/50',
    };

    if (type === 'totem') return colorMap['gold'];
    if (type === 'badge') return colorMap['purple'];
    return colorMap[color] || 'bg-gray-500 shadow-gray-500/50';
  };

  if (isLoading) {
    return (
      <Card className="kamp-card animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 overflow-x-auto py-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="w-8 h-8 bg-muted rounded-full flex-shrink-0"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="kamp-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-kamp-accent rounded-full"></div>
          <span className="text-kamp-accent">Браслет достижений</span>
        </CardTitle>
        <p className="text-sm text-gray-400">
          Каждая бусина представляет ваше достижение в хронологическом порядке
        </p>
      </CardHeader>
      
      <CardContent>
        {!beads || beads.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 border-2 border-dashed border-gray-600 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
            </div>
            <h3 className="text-lg font-semibold text-gray-400 mb-2">
              Браслет пуст
            </h3>
            <p className="text-sm text-gray-500">
              Получите первые достижения, чтобы начать собирать браслет!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Bracelet visualization */}
            <div className="relative">
              <div className="flex items-center space-x-1 overflow-x-auto pb-4 scrollbar-hide">
                {beads.map((bead, index) => (
                  <div
                    key={bead.id}
                    className="group relative flex-shrink-0"
                    title={`${bead.name} - ${new Date(bead.earned_at).toLocaleDateString('ru-RU')}`}
                  >
                    {/* Connection line */}
                    {index > 0 && (
                      <div className="absolute -left-1 top-1/2 w-2 h-0.5 bg-gray-600 -translate-y-1/2 z-0"></div>
                    )}
                    
                    {/* Bead */}
                    <div className={`
                      relative w-8 h-8 rounded-full shadow-lg transition-all duration-300 
                      group-hover:scale-110 group-hover:shadow-xl z-10
                      ${getBeadColor(bead.color, bead.type)}
                    `}>
                      {/* Position indicator for achievements */}
                      {bead.position && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-kamp-accent text-white text-xs flex items-center justify-center rounded-full font-bold">
                          {bead.position}
                        </div>
                      )}
                      
                      {/* Type indicator */}
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                        {bead.type === 'totem' && <span className="text-xs">👑</span>}
                        {bead.type === 'badge' && <span className="text-xs">⭐</span>}
                        {bead.type === 'achievement' && <span className="text-xs">🏆</span>}
                      </div>
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                      <div className="bg-black/90 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                        <div className="font-semibold">{bead.name}</div>
                        <div className="text-gray-300">
                          {new Date(bead.earned_at).toLocaleDateString('ru-RU')}
                        </div>
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-black/90"></div>
                    </div>
                  </div>
                ))}
                
                {/* Add placeholder beads to show potential */}
                {Array.from({ length: Math.max(0, 20 - beads.length) }).map((_, index) => (
                  <div
                    key={`placeholder-${index}`}
                    className="w-8 h-8 rounded-full border-2 border-dashed border-gray-600 flex-shrink-0 opacity-30"
                  ></div>
                ))}
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-kamp-accent">
                  {beads.filter(b => b.type === 'achievement').length}
                </div>
                <div className="text-xs text-gray-400">Достижения</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-2xl font-bold text-purple-400">
                  {beads.filter(b => b.type === 'badge').length}
                </div>
                <div className="text-xs text-gray-400">Значки</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-2xl font-bold text-yellow-400">
                  {beads.filter(b => b.type === 'totem').length}
                </div>
                <div className="text-xs text-gray-400">Тотемы</div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center space-x-6 text-xs text-gray-400">
              <div className="flex items-center space-x-1">
                <span>🏆</span>
                <span>Достижение</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>⭐</span>
                <span>Значок</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>👑</span>
                <span>Тотем</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};