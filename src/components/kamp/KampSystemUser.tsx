import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KampInstructions } from './KampInstructions';
import { KampProgress } from './KampProgress';
import { AsceticManagement } from './AsceticManagement';
import { KampManual } from '@/components/instructions/KampManual';
import { PersonalProfile, AccountSettings } from '@/components/profile';
import { Book, Trophy, Target, FileText, User, Settings } from 'lucide-react';

export const KampSystemUser: React.FC = () => {
  return (
    <section id="kamp-system" className="kamp-section bg-black">
      <div className="kamp-container">
        <div className="section-heading mb-8">
          <h2 className="text-gradient">Система КЭМП</h2>
          <p>Ваш личный прогресс и инструкции</p>
        </div>

        <Tabs defaultValue="progress" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 mb-8 h-auto gap-1 p-1">
            <TabsTrigger value="progress" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 px-1">
              <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-center">Прогресс</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 px-1">
              <User className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-center">Профиль</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 px-1">
              <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-center">Настройки</span>
            </TabsTrigger>
            <TabsTrigger value="instructions" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 px-1">
              <Book className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-center">Инструкция</span>
            </TabsTrigger>
            <TabsTrigger value="ascetics" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 px-1">
              <Target className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-center">Аскезы</span>
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 px-1">
              <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-center">Руководство</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="progress">
            <KampProgress />
          </TabsContent>
          
          <TabsContent value="profile">
            <PersonalProfile />
          </TabsContent>
          
          <TabsContent value="settings">
            <AccountSettings />
          </TabsContent>
          
          <TabsContent value="instructions">
            <KampInstructions />
          </TabsContent>
          
          <TabsContent value="ascetics">
            <AsceticManagement />
          </TabsContent>
          
          <TabsContent value="manual">
            <KampManual />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};