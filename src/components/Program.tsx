
import React, { useState } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

const programs = [
  {
    id: 1,
    title: 'Кикбоксинг',
    description: 'Техника ударов, спарринги, работа в парах. Развитие координации и скорости реакции.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
    days: ['Понедельник', 'Четверг'],
    time: '18:00 - 20:00',
  },
  {
    id: 2,
    title: 'Кроссфит',
    description: 'Функциональные тренировки, силовые испытания. Развитие выносливости и силы.',
    image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843',
    days: ['Вторник', 'Пятница'],
    time: '18:00 - 19:30',
  },
  {
    id: 3,
    title: 'Выездные испытания',
    description: 'Голубое озеро, баня, экстремальные челленджи. Закалка духа и командная работа.',
    image: 'https://images.unsplash.com/photo-1465379944081-7f47de8d74ac',
    days: ['Суббота'],
    time: '08:00 - 14:00',
  },
  {
    id: 4,
    title: 'Реабилитация',
    description: 'Крио-сауна, восстановительные процедуры в ЦГВС. Восстановление и регенерация.',
    image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21',
    days: ['Среда'],
    time: '19:00 - 20:30',
  },
  {
    id: 5,
    title: 'Пробежки и закаливание',
    description: 'Утренние забеги, холодные ванны. Развитие дисциплины и стойкости.',
    image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843',
    days: ['Ежедневно'],
    time: '06:00 - 07:00',
  },
];

export const Program: React.FC = () => {
  const [activeProgram, setActiveProgram] = useState(programs[0]);

  return (
    <section id="program" className="kamp-section bg-gray-50">
      <div className="kamp-container">
        <div className="section-heading reveal-on-scroll">
          <span className="inline-block text-kamp-primary font-semibold mb-2">Программа курса</span>
          <h2 className="text-kamp-dark">Интенсивные тренировки для тела и духа</h2>
          <p>
            Наша программа разработана для всестороннего развития. 
            Каждая тренировка — это шаг к совершенству, каждое испытание — возможность стать сильнее.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-4 reveal-on-scroll">
            {programs.map((program) => (
              <button
                key={program.id}
                onClick={() => setActiveProgram(program)}
                className={`w-full text-left p-5 rounded-lg transition-all duration-300 flex items-center ${
                  activeProgram.id === program.id 
                  ? 'bg-white shadow-soft border-l-4 border-kamp-primary' 
                  : 'bg-white/50 hover:bg-white hover:shadow-soft'
                }`}
              >
                <div>
                  <h3 className={`font-bold ${activeProgram.id === program.id ? 'text-kamp-primary' : 'text-gray-700'}`}>
                    {program.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{program.days.join(', ')}</span>
                  </div>
                </div>
                <ArrowRight className={`ml-auto transition-transform ${
                  activeProgram.id === program.id ? 'transform translate-x-1 text-kamp-primary' : 'text-gray-400'
                }`} size={18} />
              </button>
            ))}
          </div>

          <div className="md:col-span-2 reveal-on-scroll">
            <div className="bg-white rounded-xl shadow-soft overflow-hidden h-full">
              <div className="h-64 md:h-80 relative">
                <img 
                  src={activeProgram.image} 
                  alt={activeProgram.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out transform hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <span className="kamp-badge bg-kamp-primary text-white mb-2">
                    {activeProgram.time}
                  </span>
                  <h3 className="text-2xl font-bold">{activeProgram.title}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700">{activeProgram.description}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {activeProgram.days.map((day) => (
                    <span key={day} className="kamp-badge bg-gray-100 text-gray-800">
                      {day}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
