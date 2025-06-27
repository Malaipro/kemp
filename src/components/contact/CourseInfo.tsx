
import React from 'react';

export const CourseInfo: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
        <h4 className="font-bold text-lg mb-2">Что включено?</h4>
        <ul className="space-y-2 text-white/80">
          <li className="flex items-start">
            <span className="text-white mr-2">•</span>
            <span>Тренировки по джиу-джитсу и кикбоксингу</span>
          </li>
          <li className="flex items-start">
            <span className="text-white mr-2">•</span>
            <span>Мастер-классы</span>
          </li>
          <li className="flex items-start">
            <span className="text-white mr-2">•</span>
            <span>Бизнес завтраки</span>
          </li>
          <li className="flex items-start">
            <span className="text-white mr-2">•</span>
            <span>Баня</span>
          </li>
          <li className="flex items-start">
            <span className="text-white mr-2">•</span>
            <span>Ретриты в лесу</span>
          </li>
          <li className="flex items-start">
            <span className="text-white mr-2">•</span>
            <span>Пробежки</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
