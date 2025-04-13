
import React from 'react';

interface RegisterButtonProps {
  onClick: () => void;
}

export const RegisterButton: React.FC<RegisterButtonProps> = ({ onClick }) => {
  return (
    <div className="hidden md:block">
      <button 
        className="kamp-button-accent text-sm py-1.5 px-3 lg:py-2 lg:px-5"
        onClick={onClick}
      >
        Записаться
      </button>
    </div>
  );
};
