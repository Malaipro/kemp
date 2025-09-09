import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import { Layout } from '@/components/Layout';
import { KampSystem } from '@/components/kamp';
import { KampSystemUser } from '@/components/kamp/KampSystemUser';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { ParticipantManagement } from '@/components/admin/ParticipantManagement';
import { StreamManagement } from '@/components/admin/StreamManagement';
import { ActivityFormAdmin } from '@/components/kamp/ActivityFormAdmin';
import { CooperTestManagement } from '@/components/cooper/CooperTestManagement';
import { DetailedScheduleManagement } from '@/components/schedule/DetailedScheduleManagement';
import { ScheduleViewer } from '@/components/schedule/ScheduleViewer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, User, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
  const { isSuperAdmin, loading: roleLoading } = useRole();
  const [participantData, setParticipantData] = useState<any>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const loadParticipantData = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('участники')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading participant data:', error);
          return;
        }

        setParticipantData(data);
      } catch (error) {
        console.error('Error in loadParticipantData:', error);
      }
    };

    if (user) {
      loadParticipantData();
    }
  }, [user]);

  if (loading || roleLoading) {
    return (
      <Layout>
        <div className="kamp-section bg-black min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kamp-accent"></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <Layout>
      <div className="bg-black">
        {/* Dashboard Header */}
        <section className="kamp-section bg-gradient-to-b from-black to-gray-900">
          <div className="kamp-container">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4 min-w-0 flex-1">
                <div className="w-12 h-12 bg-kamp-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-kamp-accent" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-white truncate">
                    Личный кабинет
                  </h1>
                  <p className="text-gray-400 text-sm sm:text-base truncate">
                    {user.user_metadata?.name || user.email}
                    {isSuperAdmin && <span className="ml-2 text-kamp-accent font-semibold">(Супер админ)</span>}
                  </p>
                </div>
              </div>

              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="border-kamp-accent text-kamp-accent hover:bg-kamp-accent hover:text-black flex-shrink-0"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Выйти</span>
              </Button>
            </div>
          </div>
        </section>

        {/* Dashboard Content */}
        <section className="kamp-section">
          <div className="kamp-container">
            {isSuperAdmin ? (
              <Tabs defaultValue="kamp" className="w-full">
                <TabsList className="grid w-full grid-cols-6 mb-6 h-auto p-1">
                  <TabsTrigger value="kamp" className="flex items-center gap-2 text-xs sm:text-sm px-2 py-3">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">КЭМП</span>
                  </TabsTrigger>
                  <TabsTrigger value="activities" className="flex items-center gap-2 text-xs sm:text-sm px-2 py-3">
                    <Shield className="w-4 h-4" />
                    <span className="hidden sm:inline">Активности</span>
                  </TabsTrigger>
                  <TabsTrigger value="participants" className="flex items-center gap-2 text-xs sm:text-sm px-2 py-3">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Участники</span>
                  </TabsTrigger>
                  <TabsTrigger value="streams" className="flex items-center gap-2 text-xs sm:text-sm px-2 py-3">
                    <Shield className="w-4 h-4" />
                    <span className="hidden sm:inline">Потоки</span>
                  </TabsTrigger>
                  <TabsTrigger value="cooper" className="flex items-center gap-2 text-xs sm:text-sm px-2 py-3">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Купер</span>
                  </TabsTrigger>
                  <TabsTrigger value="schedule" className="flex items-center gap-2 text-xs sm:text-sm px-2 py-3">
                    <Shield className="w-4 h-4" />
                    <span className="hidden sm:inline">Расписание</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="kamp">
                  <KampSystem />
                </TabsContent>
                
                <TabsContent value="activities">
                  <ActivityFormAdmin />
                </TabsContent>
                
                <TabsContent value="participants">
                  <ParticipantManagement />
                </TabsContent>
                
                <TabsContent value="streams">
                  <StreamManagement />
                </TabsContent>
                
                <TabsContent value="cooper">
                  <CooperTestManagement />
                </TabsContent>
                
                <TabsContent value="schedule">
                  <DetailedScheduleManagement />
                </TabsContent>
              </Tabs>
            ) : (
              <Tabs defaultValue="kamp" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6 h-auto p-1">
                  <TabsTrigger value="kamp" className="flex items-center gap-2 text-xs sm:text-sm px-2 py-3">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">КЭМП Система</span>
                    <span className="sm:hidden">КЭМП</span>
                  </TabsTrigger>
                  <TabsTrigger value="cooper" className="flex items-center gap-2 text-xs sm:text-sm px-2 py-3">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Тест Купера</span>
                    <span className="sm:hidden">Купер</span>
                  </TabsTrigger>
                  <TabsTrigger value="schedule" className="flex items-center gap-2 text-xs sm:text-sm px-2 py-3">
                    <Shield className="w-4 h-4" />
                    <span className="hidden sm:inline">Расписание</span>
                    <span className="sm:hidden">График</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="kamp">
                  <KampSystemUser />
                </TabsContent>
                
                <TabsContent value="cooper">
                  <CooperTestManagement />
                </TabsContent>
                
                <TabsContent value="schedule">
                  <ScheduleViewer />
                </TabsContent>
              </Tabs>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};