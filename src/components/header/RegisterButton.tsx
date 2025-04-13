
import React from 'react';

interface RegisterButtonProps {
  onClick: () => void;
}

export const RegisterButton: React.FC<RegisterButtonProps> = ({ onClick }) => {
  return (
    <div className="hidden md:block">
      <button 
        className="kamp-button-accent text-xs py-1 px-2 lg:py-1.5 lg:px-4"
        onClick={onClick}
      >
        Записаться
      </button>
    </div>
  );
};
