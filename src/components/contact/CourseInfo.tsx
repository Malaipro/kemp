
import React from 'react';

export const CourseInfo: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
        <h4 className="font-bold text-lg mb-2">Что включено?</h4>
        <ul className="space-y-2 text-white/80">
          <li className="flex items-start">
            <span className="text-white mr-2">•</span>
            <span>10 тренировок по кикбоксингу</span>
          </li>
          <li className="flex items-start">
            <span className="text-white mr-2">•</span>
            <span>8 функциональных тренировок</span>
          </li>
          <li className="flex items-start">
            <span className="text-white mr-2">•</span>
            <span>4 выездных мероприятия</span>
          </li>
          <li className="flex items-start">
            <span className="text-white mr-2">•</span>
            <span>Персональное сопровождение</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
