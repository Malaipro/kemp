import React, { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const AdminPasswordReset: React.FC = () => {
  const { toast } = useToast();

  useEffect(() => {
    const resetPassword = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('admin-reset-password', {
          body: { 
            email: 'dishka.da@yandex.ru', 
            newPassword: 'Dishk@82' 
          }
        });

        if (error) {
          toast({
            title: "Ошибка",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Пароль изменен",
            description: "Пароль успешно обновлен на Dishk@82",
          });
        }
      } catch (error: any) {
        toast({
          title: "Ошибка",
          description: "Произошла ошибка при изменении пароля",
          variant: "destructive",
        });
      }
    };

    resetPassword();
  }, [toast]);

  return null;
};