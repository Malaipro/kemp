import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Star, Award } from 'lucide-react';

interface AchievementType {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  shape: string;
}

interface UserAchievement {
  id: string;
  participant_id: string;
  achievement_type_id: string;
  earned_at: string;
  position?: number;
  achievement_types: AchievementType;
}

const getIconComponent = (iconName: string, color: string) => {
  const iconClass = `w-6 h-6 ${color}`;
  
  switch (iconName) {
    case 'Trophy':
      return <Trophy className={iconClass} />;
    case 'Medal':
      return <Medal className={iconClass} />;
    case 'Star':
      return <Star className={iconClass} />;
    case 'Award':
      return <Award className={iconClass} />;
    default:
      return <Trophy className={iconClass} />;
  }
};

export const AchievementSystem: React.FC = () => {
  const { data: achievements, isLoading } = useQuery({
    queryKey: ['user-achievements'],
    queryFn: async (): Promise<UserAchievement[]> => {
      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievement_types:achievement_type_id (
            id,
            name,
            description,
            icon,
            color,
            shape
          )
        `)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  if (isLoading) {
    return (
      <Card className="kamp-card animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const groupedAchievements = achievements?.reduce((acc, achievement) => {
    const type = achievement.achievement_types.name;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(achievement);
    return acc;
  }, {} as Record<string, UserAchievement[]>);

  return (
    <Card className="kamp-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="w-6 h-6 text-kamp-accent" />
          <span className="text-kamp-accent">Мои достижения</span>
        </CardTitle>
        <p className="text-sm text-gray-400">
          Все ваши заслуженные награды и достижения
        </p>
      </CardHeader>
      
      <CardContent>
        {!achievements || achievements.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-400 mb-2">
              Пока нет достижений
            </h3>
            <p className="text-sm text-gray-500">
              Участвуйте в тренировках и мероприятиях, чтобы получить первые награды!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedAchievements || {}).map(([type, typeAchievements]) => (
              <div key={type} className="space-y-3">
                <h4 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                  {type}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {typeAchievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="p-4 rounded-lg bg-black/50 border border-gray-700 hover:border-kamp-accent/50 transition-all duration-300"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          {getIconComponent(
                            achievement.achievement_types.icon,
                            `text-${achievement.achievement_types.color}`
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-white text-sm">
                            {achievement.achievement_types.name}
                          </h5>
                          
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                            {achievement.achievement_types.description}
                          </p>
                          
                          <div className="flex items-center justify-between mt-3">
                            <Badge variant="secondary" className="text-xs">
                              {new Date(achievement.earned_at).toLocaleDateString('ru-RU')}
                            </Badge>
                            
                            {achievement.position && (
                              <Badge variant="outline" className="text-xs text-kamp-accent border-kamp-accent">
                                #{achievement.position}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            <div className="mt-6 pt-6 border-t border-gray-700 text-center">
              <div className="text-2xl font-bold text-kamp-accent mb-1">
                {achievements.length}
              </div>
              <div className="text-sm text-gray-400">
                Всего достижений получено
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};