
import React from 'react';
import { Dumbbell, Award, Users } from 'lucide-react';

const features = [
  {
    id: 1,
    icon: <Dumbbell className="w-10 h-10 text-kamp-primary" />,
    title: 'Испытания',
    description: 'Жёсткие тренировки, закаливание, дисциплина. Преодолей себя и стань сильнее.',
  },
  {
    id: 2,
    icon: <Users className="w-10 h-10 text-kamp-primary" />,
    title: 'Поддержка',
    description: 'Лучшие наставники, сообщество единомышленников. Вместе мы достигнем большего.',
  },
  {
    id: 3,
    icon: <Award className="w-10 h-10 text-kamp-primary" />,
    title: 'Лидерборд',
    description: 'Докажи свою силу, соревнуйся с другими участниками, получи заслуженную награду.',
  },
];

export const AboutUs: React.FC = () => {
  return (
    <section id="about" className="kamp-section bg-kamp-light">
      <div className="kamp-container">
        <div className="section-heading reveal-on-scroll">
          <span className="inline-block text-kamp-primary font-semibold mb-2">О нас</span>
          <h2 className="text-kamp-dark">Мы создаем условия для развития настоящей силы</h2>
          <p>
            Мы — команда профессионалов, объединенных одной целью: создавать условия для развития настоящей силы. 
            Наш курс — это не просто тренировки. Это система испытаний, которые делают тебя сильнее во всех сферах жизни.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16 stagger-animation">
          {features.map((feature) => (
            <div 
              key={feature.id} 
              className="kamp-card p-8 reveal-on-scroll hover-lift"
            >
              <div className="mb-6 bg-blue-50 inline-flex p-4 rounded-lg">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-kamp-dark">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center reveal-on-scroll">
          <div className="relative overflow-hidden rounded-xl shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05" 
              alt="Групповые тренировки"
              className="w-full h-auto object-cover rounded-xl"
              style={{ maxHeight: '500px' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full p-8 text-white text-left">
              <h3 className="text-2xl font-bold mb-2">Что тебя ждет?</h3>
              <p className="text-white/80 max-w-xl">
                Интенсивные тренировки, испытания на выносливость, работа в команде и индивидуальный рост.
                Каждый день — новый вызов, каждый день — новая победа над собой.
              </p>
              <button className="mt-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-2 rounded-lg transition-all duration-300 flex items-center">
                Узнать больше
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
