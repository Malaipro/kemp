
import React from 'react';
import { MessageSquare } from 'lucide-react';

export const AskQuestion: React.FC = () => {
  return (
    <div className="mt-6 bg-[#111] rounded-xl shadow-soft p-6 border border-gray-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <MessageSquare size={20} className="text-kamp-accent mr-3" />
          <span className="font-medium">Остались вопросы?</span>
        </div>
        <a 
          href="https://t.me/Dmitriy_nar" 
          target="_blank" 
          rel="noopener noreferrer"
          className="kamp-button-primary text-sm px-4 py-2"
        >
          Задать вопрос
        </a>
      </div>
    </div>
  );
};
