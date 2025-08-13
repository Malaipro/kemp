import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Crown, Shield, Zap } from 'lucide-react';

interface SpecialBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: string;
}

interface UserBadge {
  id: string;
  badge_id: string;
  earned_at: string;
  special_badges: SpecialBadge;
}

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'Star':
      return <Star className="w-6 h-6" />;
    case 'Crown':
      return <Crown className="w-6 h-6" />;
    case 'Shield':
      return <Shield className="w-6 h-6" />;
    case 'Zap':
      return <Zap className="w-6 h-6" />;
    default:
      return <Star className="w-6 h-6" />;
  }
};

export const SpecialBadges: React.FC = () => {
  const { data: userBadges, isLoading } = useQuery({
    queryKey: ['user-special-badges'],
    queryFn: async (): Promise<UserBadge[]> => {
      const { data, error } = await supabase
        .from('user_special_badges')
        .select(`
          *,
          special_badges:badge_id (
            id,
            name,
            description,
            icon,
            criteria
          )
        `);

      if (error) throw error;
      return data || [];
    },
  });

  const { data: allBadges } = useQuery({
    queryKey: ['all-special-badges'],
    queryFn: async (): Promise<SpecialBadge[]> => {
      const { data, error } = await supabase
        .from('special_badges')
        .select('*');

      if (error) throw error;
      return data || [];
    },
  });

  if (isLoading) {
    return (
      <Card className="kamp-card animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const earnedBadgeIds = new Set(userBadges?.map(ub => ub.badge_id) || []);

  return (
    <Card className="kamp-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Crown className="w-6 h-6 text-kamp-accent" />
          <span className="text-kamp-accent">Специальные значки</span>
        </CardTitle>
        <p className="text-sm text-gray-400">
          Особые награды за выдающиеся достижения
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {allBadges?.map((badge) => {
            const isEarned = earnedBadgeIds.has(badge.id);
            const userBadge = userBadges?.find(ub => ub.badge_id === badge.id);
            
            return (
              <div
                key={badge.id}
                className={`relative p-4 rounded-lg border transition-all duration-300 ${
                  isEarned
                    ? 'bg-kamp-accent/20 border-kamp-accent/50 shadow-lg'
                    : 'bg-gray-800/50 border-gray-700/50 opacity-60'
                }`}
              >
                <div className="text-center space-y-2">
                  <div className={`mx-auto ${isEarned ? 'text-kamp-accent' : 'text-gray-500'}`}>
                    {getIconComponent(badge.icon)}
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className={`text-sm font-semibold ${
                      isEarned ? 'text-white' : 'text-gray-400'
                    }`}>
                      {badge.name}
                    </h4>
                    
                    <p className="text-xs text-gray-400 line-clamp-2">
                      {badge.description}
                    </p>
                  </div>
                  
                  {isEarned && userBadge && (
                    <Badge variant="secondary" className="text-xs">
                      {new Date(userBadge.earned_at).toLocaleDateString('ru-RU')}
                    </Badge>
                  )}
                  
                  {!isEarned && (
                    <div className="text-xs text-gray-500 mt-2">
                      <div className="font-medium">Критерии:</div>
                      <div className="line-clamp-2">{badge.criteria}</div>
                    </div>
                  )}
                </div>
                
                {isEarned && (
                  <div className="absolute -top-1 -right-1">
                    <div className="w-3 h-3 bg-kamp-accent rounded-full border-2 border-black"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {userBadges && userBadges.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="text-center">
              <div className="text-2xl font-bold text-kamp-accent mb-1">
                {userBadges.length}
              </div>
              <div className="text-sm text-gray-400">
                Специальных значков получено
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};