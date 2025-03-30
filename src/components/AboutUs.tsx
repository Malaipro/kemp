
import React from 'react';
import { Dumbbell, Award, Users } from 'lucide-react';
import { Button } from './ui/button';

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
  // Function to scroll to the Program section
  const scrollToProgram = () => {
    const programSection = document.getElementById('program');
    if (programSection) {
      programSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

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

        <div className="mt-16 reveal-on-scroll">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Text Content - Left Side */}
            <div className="text-left">
              <h3 className="text-2xl font-bold mb-4 text-kamp-dark">Что тебя ждет?</h3>
              <p className="text-gray-700 mb-6">
                Интенсивные тренировки, испытания на выносливость, работа в команде и индивидуальный рост.
                Каждый день — новый вызов, каждый день — новая победа над собой.
              </p>
              <button 
                onClick={scrollToProgram}
                className="inline-flex items-center gap-2 bg-kamp-primary hover:bg-kamp-primary/90 text-white px-6 py-3 rounded-lg transition-all duration-300 font-medium"
              >
                Узнать больше
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            {/* iPhone Frame with Video - Right Side */}
            <div className="flex justify-center">
              <div className="relative">
                {/* iPhone Frame */}
                <div className="relative w-[280px] h-[570px] bg-black rounded-[40px] p-3 shadow-xl border-4 border-gray-800">
                  {/* iPhone Notch */}
                  <div className="absolute top-0 left-0 right-0 flex justify-center z-10">
                    <div className="w-[120px] h-[30px] bg-black rounded-b-[14px] flex items-center justify-center">
                      <div className="w-[8px] h-[8px] bg-gray-600 rounded-full mr-2"></div>
                      <div className="w-[40px] h-[6px] bg-gray-600 rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Power Button */}
                  <div className="absolute top-[100px] right-[-8px] w-[4px] h-[60px] bg-gray-700 rounded-r-md"></div>
                  
                  {/* Volume Buttons */}
                  <div className="absolute top-[100px] left-[-8px] w-[4px] h-[30px] bg-gray-700 rounded-l-md"></div>
                  <div className="absolute top-[140px] left-[-8px] w-[4px] h-[60px] bg-gray-700 rounded-l-md"></div>
                  
                  {/* Screen with Video */}
                  <div className="relative h-full w-full rounded-[32px] overflow-hidden bg-white">
                    <video 
                      className="w-full h-full object-cover"
                      autoPlay 
                      muted 
                      loop 
                      playsInline
                    >
                      <source src="https://i.imgur.com/eXVpT0r.mp4" type="video/mp4" />
                      Ваш браузер не поддерживает видео.
                    </video>
                  </div>
                </div>
                
                {/* Reflection effect */}
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-white/20 to-transparent rounded-[40px] pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
