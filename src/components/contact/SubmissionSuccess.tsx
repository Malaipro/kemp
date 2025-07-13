
import React from 'react';

interface SubmissionSuccessProps {
  onReset: () => void;
}

export const SubmissionSuccess: React.FC<SubmissionSuccessProps> = ({ onReset }) => {
  return (
    <div className="p-6 bg-kamp-accent/20 rounded-lg text-center">
      <div className="text-2xl font-bold text-kamp-accent mb-2">Спасибо за заявку!</div>
      <p className="text-white/80 mb-4">
        Вы успешно зарегистрировались в клуб. Мы свяжемся с вами в ближайшее время.
      </p>
      <button 
        onClick={onReset}
        className="kamp-button-primary"
      >
        Отправить ещё одну заявку
      </button>
    </div>
  );
};
