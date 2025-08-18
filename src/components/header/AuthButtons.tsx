import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { User, LogIn } from 'lucide-react';

export const AuthButtons: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-8 h-8 animate-pulse bg-gray-200 rounded"></div>
    );
  }

  if (user) {
    return (
      <Link to="/dashboard">
        <Button 
          variant="outline" 
          className="border-kamp-accent text-kamp-accent hover:bg-kamp-accent hover:text-white transition-all duration-200"
        >
          <User className="w-4 h-4 mr-2" />
          Кабинет
        </Button>
      </Link>
    );
  }

  return (
    <Link to="/auth">
      <Button 
        variant="outline" 
        className="border-kamp-accent text-kamp-accent hover:bg-kamp-accent hover:text-white transition-all duration-200"
      >
        <LogIn className="w-4 h-4 mr-2" />
        Вход
      </Button>
    </Link>
  );
};