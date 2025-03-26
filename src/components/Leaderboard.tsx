
import React, { useState } from 'react';
import { Medal, Target, Sun, DropletIcon, Utensils, Share2 } from 'lucide-react';

const pointSources = [
  {
    icon: <Target className="w-5 h-5 text-kamp-primary" />,
    title: 'Посещение тренировки',
    points: '+10 баллов',
  },
  {
    icon: <Medal className="w-5 h-5 text-kamp-primary" />,
    title: 'Победа в спарринге',
    points: '+20 баллов',
  },
  {
    icon: <Sun className="w-5 h-5 text-kamp-primary" />,
    title: 'Утренние пробежки',
    points: '+5 баллов',
  },
  {
    icon: <DropletIcon className="w-5 h-5 text-kamp-primary" />,
    title: 'Закаливание',
    points: '+10 баллов',
  },
  {
    icon: <Utensils className="w-5 h-5 text-kamp-primary" />,
    title: 'Отчет о питании',
    points: '+5 баллов',
  },
  {
    icon: <Share2 className="w-5 h-5 text-kamp-primary" />,
    title: 'Активность в соцсетях',
    points: '+5 баллов',
  },
];

// Mock data for leaderboard
const mockParticipants = [
  { id: 1, name: 'Алексей Петров', points: 240, rank: 1 },
  { id: 2, name: 'Иван Смирнов', points: 225, rank: 2 },
  { id: 3, name: 'Сергей Иванов', points: 210, rank: 3 },
  { id: 4, name: 'Дмитрий Козлов', points: 195, rank: 4 },
  { id: 5, name: 'Николай Морозов', points: 180, rank: 5 },
  { id: 6, name: 'Артем Волков', points: 170, rank: 6 },
  { id: 7, name: 'Максим Соколов', points: 165, rank: 7 },
  { id: 8, name: 'Владимир Новиков', points: 155, rank: 8 },
  { id: 9, name: 'Георгий Лебедев', points: 140, rank: 9 },
  { id: 10, name: 'Антон Орлов', points: 130, rank: 10 },
];

export const Leaderboard: React.FC = () => {
  const [isPointsVisible, setIsPointsVisible] = useState(false);

  const togglePointsVisibility = () => {
    setIsPointsVisible(!isPointsVisible);
  };

  return (
    <section id="leaderboard" className="kamp-section bg-gray-50">
      <div className="kamp-container">
        <div className="section-heading reveal-on-scroll">
          <span className="inline-block text-kamp-primary font-semibold mb-2">Лидерборд</span>
          <h2 className="text-kamp-dark">Соревнуйся и побеждай</h2>
          <p>
            КЭМП — это не только саморазвитие, но и соревнование. 
            Зарабатывай баллы, поднимайся в рейтинге и получи награду в конце курса.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-5 gap-8">
          {/* Leaderboard Table */}
          <div className="md:col-span-3 reveal-on-scroll">
            <div className="bg-white rounded-xl shadow-soft overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h3 className="font-bold text-kamp-dark">Рейтинг участников</h3>
                <span className="text-sm text-gray-500">Обновлено: сегодня</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-500">Место</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-500">Участник</th>
                      <th className="py-4 px-6 text-right text-sm font-semibold text-gray-500">Баллы</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockParticipants.map((participant) => (
                      <tr 
                        key={participant.id} 
                        className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            {participant.rank <= 3 ? (
                              <span className={`flex items-center justify-center w-8 h-8 rounded-full ${
                                participant.rank === 1 
                                  ? 'bg-yellow-100 text-yellow-600' 
                                  : participant.rank === 2 
                                    ? 'bg-gray-100 text-gray-600' 
                                    : 'bg-amber-100 text-amber-600'
                              }`}>
                                {participant.rank}
                              </span>
                            ) : (
                              <span className="text-gray-500 font-medium pl-2">
                                {participant.rank}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 font-medium text-kamp-dark">
                          {participant.name}
                        </td>
                        <td className="py-4 px-6 text-right font-bold text-kamp-primary">
                          {participant.points}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* How to earn points */}
          <div className="md:col-span-2 reveal-on-scroll">
            <div className="bg-white rounded-xl shadow-soft overflow-hidden h-full">
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-bold text-kamp-dark">Как заработать баллы?</h3>
              </div>

              <div className="p-6 space-y-4">
                {pointSources.map((source, index) => (
                  <div 
                    key={index} 
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      {source.icon}
                    </div>
                    <div className="ml-4 flex-grow">
                      <span className="font-medium text-gray-800">{source.title}</span>
                    </div>
                    <div className="text-kamp-primary font-bold">
                      {source.points}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-gradient-to-r from-kamp-primary to-blue-600 text-white">
                <h3 className="font-bold mb-3">Что в конце курса?</h3>
                <div 
                  className={`relative overflow-hidden transition-all duration-500 ${
                    isPointsVisible ? 'max-h-96' : 'max-h-20'
                  }`}
                >
                  <p className="mb-4">
                    Участники, занявшие призовые места, получат ценные призы и особое признание.
                    Но главная награда — это преображение, которое происходит с каждым участником КЭМП.
                  </p>
                  
                  {isPointsVisible && (
                    <div className="space-y-3 mt-4">
                      <div className="p-3 bg-white/10 backdrop-blur-md rounded-lg">
                        <span className="font-bold text-white">1 место:</span> 
                        <p className="text-white/80 text-sm">Годовой абонемент в премиум-зал и персональный комплект экипировки</p>
                      </div>
                      <div className="p-3 bg-white/10 backdrop-blur-md rounded-lg">
                        <span className="font-bold text-white">2 место:</span> 
                        <p className="text-white/80 text-sm">Полугодовой абонемент и спортивный инвентарь</p>
                      </div>
                      <div className="p-3 bg-white/10 backdrop-blur-md rounded-lg">
                        <span className="font-bold text-white">3 место:</span> 
                        <p className="text-white/80 text-sm">Трехмесячный абонемент и комплект спортивной одежды</p>
                      </div>
                    </div>
                  )}
                  
                  <div className={`absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-kamp-primary to-transparent ${isPointsVisible ? 'hidden' : 'block'}`}></div>
                </div>
                
                <button 
                  onClick={togglePointsVisibility}
                  className="mt-3 text-sm font-medium hover:underline focus:outline-none"
                >
                  {isPointsVisible ? 'Скрыть детали' : 'Узнать подробнее'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
