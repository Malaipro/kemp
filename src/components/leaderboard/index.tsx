
import React, { useState } from 'react';
import { ParticipantTable } from './ParticipantTable';
import { ActivityList } from './ActivityList';
import { participants, activities } from './data';

export const Leaderboard: React.FC = () => {
  const [isPointsVisible, setIsPointsVisible] = useState(false);

  const togglePointsVisibility = () => {
    setIsPointsVisible(!isPointsVisible);
  };

  return (
    <section id="leaderboard" className="kamp-section bg-kamp-secondary">
      <div className="kamp-container">
        <div className="section-heading reveal-on-scroll">
          <span className="inline-block text-kamp-accent font-semibold mb-2">Лидерборд</span>
          <h2 className="text-kamp-dark">Соревнуйся и побеждай</h2>
          <p className="text-gray-400">
            КЭМП — это не только саморазвитие, но и соревнование. 
            Зарабатывай баллы, поднимайся в рейтинге и получи награду в конце курса.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-5 gap-8">
          {/* Leaderboard Table */}
          <div className="md:col-span-3 reveal-on-scroll">
            <ParticipantTable participants={participants} />
          </div>

          {/* How to earn points */}
          <div className="md:col-span-2 reveal-on-scroll">
            <ActivityList 
              activities={activities}
              isPointsVisible={isPointsVisible}
              togglePointsVisibility={togglePointsVisibility}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
