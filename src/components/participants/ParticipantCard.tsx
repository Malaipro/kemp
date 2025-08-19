import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Star, Target, Award } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface Achievement {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface Participant {
  id: string;
  name: string;
  points: number;
  rank?: number;
  achievements?: Achievement[];
  specialBadges?: number;
  directionsCompleted?: number;
  totalDirections?: number;
}

interface ParticipantCardProps {
  participant: Participant;
  showRank?: boolean;
}

export const ParticipantCard: React.FC<ParticipantCardProps> = ({ 
  participant, 
  showRank = true 
}) => {
  const isMobile = useIsMobile();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRankColor = (rank?: number) => {
    if (!rank) return 'hsl(var(--muted))';
    if (rank === 1) return 'hsl(var(--achievement-gold))';
    if (rank === 2) return 'hsl(var(--achievement-silver))';
    if (rank === 3) return 'hsl(var(--achievement-bronze))';
    return 'hsl(var(--muted))';
  };

  const progressPercentage = participant.totalDirections 
    ? (participant.directionsCompleted || 0) / participant.totalDirections * 100 
    : 0;

  return (
    <Card className="glass-card hover-lift group">
      <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
        <div className="flex items-start gap-4">
          {/* Avatar and Rank */}
          <div className="relative flex-shrink-0">
            <Avatar className={`${isMobile ? 'h-12 w-12' : 'h-16 w-16'} border-2`} 
                    style={{ borderColor: getRankColor(participant.rank) }}>
              <AvatarFallback className="bg-kamp-secondary text-kamp-light font-bold">
                {getInitials(participant.name)}
              </AvatarFallback>
            </Avatar>
            {showRank && participant.rank && participant.rank <= 3 && (
              <div 
                className={`absolute -top-1 -right-1 ${isMobile ? 'w-6 h-6' : 'w-8 h-8'} rounded-full flex items-center justify-center text-xs font-bold border-2 border-background`}
                style={{ backgroundColor: getRankColor(participant.rank) }}
              >
                <Trophy className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-white`} />
              </div>
            )}
          </div>

          {/* Participant Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className={`font-semibold text-kamp-light truncate ${isMobile ? 'text-sm' : 'text-lg'}`}>
                {participant.name}
              </h3>
              {showRank && participant.rank && (
                <Badge variant="outline" className={`text-xs ${isMobile ? 'px-2 py-0' : 'px-3 py-1'}`}>
                  #{participant.rank}
                </Badge>
              )}
            </div>

            {/* Points and Progress */}
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1">
                <Star className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-kamp-accent`} />
                <span className={`font-bold text-kamp-accent ${isMobile ? 'text-sm' : 'text-base'}`}>
                  {participant.points}
                </span>
                <span className={`text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  очков
                </span>
              </div>
              
              {participant.totalDirections && (
                <div className="flex items-center gap-1">
                  <Target className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-blue-400`} />
                  <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-300`}>
                    {participant.directionsCompleted || 0}/{participant.totalDirections}
                  </span>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            {participant.totalDirections && (
              <div className="mb-3">
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-kamp-primary to-kamp-accent h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 mt-1">
                  Прогресс: {Math.round(progressPercentage)}%
                </span>
              </div>
            )}

            {/* Achievements and Badges */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {participant.achievements && participant.achievements.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Award className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-yellow-400`} />
                    <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-300`}>
                      {participant.achievements.length}
                    </span>
                  </div>
                )}
                
                {participant.specialBadges && participant.specialBadges > 0 && (
                  <div className="flex items-center gap-1">
                    <Badge variant="secondary" className="text-xs">
                      +{participant.specialBadges} значков
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};