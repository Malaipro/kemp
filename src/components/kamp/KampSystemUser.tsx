import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KampInstructions } from './KampInstructions';
import { KampProgress } from './KampProgress';
import { AsceticTracker } from './AsceticTracker';
import { KampManual } from '@/components/instructions/KampManual';
import { Book, Trophy, Target, FileText } from 'lucide-react';

export const KampSystemUser: React.FC = () => {
  return (
    <section id="kamp-system" className="kamp-section bg-black">
      <div className="kamp-container">
        <div className="section-heading mb-8">
          <h2 className="text-gradient">Система КЭМП</h2>
          <p>Ваш личный прогресс и инструкции</p>
        </div>

        <Tabs defaultValue="progress" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Мой прогресс
            </TabsTrigger>
            <TabsTrigger value="instructions" className="flex items-center gap-2">
              <Book className="w-4 h-4" />
              Инструкция
            </TabsTrigger>
            <TabsTrigger value="ascetics" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Аскезы
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Руководство
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="progress">
            <KampProgress />
          </TabsContent>
          
          <TabsContent value="instructions">
            <KampInstructions />
          </TabsContent>
          
          <TabsContent value="ascetics">
            <AsceticTracker />
          </TabsContent>
          
          <TabsContent value="manual">
            <KampManual />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};