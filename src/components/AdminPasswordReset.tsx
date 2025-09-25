import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const AdminPasswordReset: React.FC = () => {
  const { adminResetPassword } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const resetPassword = async () => {
      await adminResetPassword('dishka.da@yandex.ru', 'Dishk@82');
    };

    resetPassword();
  }, [adminResetPassword]);

  return null;
};