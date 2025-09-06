import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useRole = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      if (!user) {
        setIsAdmin(false);
        setIsSuperAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // Проверяем роли пользователя
        const { data: roles, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error checking roles:', error);
          setLoading(false);
          return;
        }

        const hasAdminRole = roles?.some(r => r.role === 'admin') || false;
        const isSuperAdminUser = user.email === 'dishka.da@yandex.ru' && hasAdminRole;

        setIsAdmin(hasAdminRole);
        setIsSuperAdmin(isSuperAdminUser);
      } catch (error) {
        console.error('Error in checkRole:', error);
      } finally {
        setLoading(false);
      }
    };

    checkRole();
  }, [user]);

  return { isAdmin, isSuperAdmin, loading };
};