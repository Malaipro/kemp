
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

interface ParticipantTableProps {
  participants: Participant[];
}

export const ParticipantTable: React.FC<ParticipantTableProps> = ({ participants }) => {
  return (
    <Card className="overflow-hidden border-gray-700 bg-black bg-opacity-60 text-gray-200">
      <CardHeader className="flex flex-row justify-between items-center p-6 border-b border-gray-800">
        <h3 className="font-bold text-kamp-dark">Рейтинг участников</h3>
        <span className="text-sm text-gray-400">Актуальный рейтинг</span>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-black bg-opacity-50 border-b border-gray-800">
                <TableHead className="py-4 px-6 text-left text-sm font-semibold text-gray-300">Место</TableHead>
                <TableHead className="py-4 px-6 text-left text-sm font-semibold text-gray-300">Участник</TableHead>
                <TableHead className="py-4 px-6 text-right text-sm font-semibold text-gray-300">Баллы</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants.map((participant) => (
                <TableRow 
                  key={participant.id} 
                  className="border-t border-gray-800 hover:bg-gray-900 transition-colors"
                >
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center">
                      {participant.rank <= 3 ? (
                        <span className={`flex items-center justify-center w-8 h-8 rounded-full ${
                          participant.rank === 1 
                            ? 'bg-yellow-900 text-yellow-400' 
                            : participant.rank === 2 
                              ? 'bg-gray-800 text-gray-300' 
                              : 'bg-amber-900 text-amber-400'
                        }`}>
                          {participant.rank}
                        </span>
                      ) : (
                        <span className="text-gray-400 font-medium pl-2">
                          {participant.rank}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6 font-medium text-kamp-dark">
                    {participant.name}
                  </TableCell>
                  <TableCell className="py-4 px-6 text-right font-bold text-kamp-accent">
                    {participant.points}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
