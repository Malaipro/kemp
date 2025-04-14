
import React from 'react';
import { Participant } from '@/types/leaderboard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

interface ParticipantTableProps {
  participants: Participant[];
}

export const ParticipantTable: React.FC<ParticipantTableProps> = ({ participants }) => {
  const isMobile = useIsMobile();
  
  // Show only top 5 participants on mobile
  const displayedParticipants = isMobile ? participants.slice(0, 5) : participants;
  
  return (
    <Card className="overflow-hidden border-gray-700 bg-black bg-opacity-60 text-gray-200 h-full">
      <CardHeader className={`flex flex-row justify-between items-center ${isMobile ? 'p-1.5' : 'p-6'} border-b border-gray-800`}>
        <h3 className={`font-bold text-kamp-dark ${isMobile ? 'text-xs' : 'text-base'}`}>Рейтинг участников</h3>
        {!isMobile && <span className="text-sm text-gray-400">Актуальный рейтинг</span>}
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-black bg-opacity-50 border-b border-gray-800">
                <TableHead className={`${isMobile ? 'py-1.5 px-1.5' : 'py-4 px-6'} text-left text-xs md:text-sm font-semibold text-gray-300`}>Место</TableHead>
                <TableHead className={`${isMobile ? 'py-1.5 px-1.5' : 'py-4 px-6'} text-left text-xs md:text-sm font-semibold text-gray-300`}>Участник</TableHead>
                <TableHead className={`${isMobile ? 'py-1.5 px-1.5' : 'py-4 px-6'} text-right text-xs md:text-sm font-semibold text-gray-300`}>Баллы</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedParticipants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className={`text-center ${isMobile ? 'py-4' : 'py-8'} text-gray-400 text-xs md:text-base`}>
                    Нет данных для отображения
                  </TableCell>
                </TableRow>
              ) : (
                displayedParticipants.map((participant) => (
                  <TableRow 
                    key={participant.id} 
                    className="border-t border-gray-800 hover:bg-gray-900 transition-colors"
                  >
                    <TableCell className={`${isMobile ? 'py-1 px-1.5' : 'py-4 px-6'}`}>
                      <div className="flex items-center">
                        {participant.rank && participant.rank <= 3 ? (
                          <span className={`flex items-center justify-center ${isMobile ? 'w-5 h-5' : 'w-8 h-8'} rounded-full ${
                            participant.rank === 1 
                              ? 'bg-yellow-900 text-yellow-400' 
                              : participant.rank === 2 
                                ? 'bg-gray-800 text-gray-300' 
                                : 'bg-amber-900 text-amber-400'
                          } ${isMobile ? 'text-[10px]' : 'text-sm'}`}>
                            {participant.rank}
                          </span>
                        ) : (
                          <span className={`text-gray-400 font-medium pl-2 ${isMobile ? 'text-[10px]' : 'text-sm'}`}>
                            {participant.rank}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className={`${isMobile ? 'py-1 px-1.5 text-[10px]' : 'py-4 px-6 text-base'} font-medium text-kamp-dark`}>
                      {participant.name}
                    </TableCell>
                    <TableCell className={`${isMobile ? 'py-1 px-1.5 text-[10px]' : 'py-4 px-6 text-base'} text-right font-bold text-kamp-accent`}>
                      {participant.points}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
