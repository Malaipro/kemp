import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/components/Layout';
import { Achievements } from '@/components/achievements';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-kamp-accent/20 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-kamp-accent" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Личный кабинет
                  </h1>
                  <p className="text-gray-400">
                    {user.user_metadata?.name || user.email}
                  </p>
                </div>
              </div>

              <Button
                onClick={handleSignOut}
                variant="outline"
                className="border-kamp-accent text-kamp-accent hover:bg-kamp-accent hover:text-black"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </section>

        {/* User Achievements */}
        <Achievements />
      </div>
    </Layout>
  );
};