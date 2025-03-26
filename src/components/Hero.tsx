
import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { VideoBackground } from './ui/VideoBackground';

export const Hero: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      window.scrollTo({
        top: aboutSection.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <VideoBackground
      imageUrl="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"
      overlayColor="rgba(0, 0, 0, 0.7)"
      className="h-screen flex items-center"
    >
      <div className="kamp-container text-center">
        <div className={`space-y-6 max-w-4xl mx-auto transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
          <span className="inline-block text-white/80 text-sm md:text-base font-semibold uppercase tracking-wider mb-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm">
            Курс Эффективного Мужского Прогресса
          </span>
          
          <h1 className="text-white font-display font-bold leading-tight">
            КЭМП — интенсив для тех, кто готов пройти испытания и стать 
            <span className="text-gradient bg-gradient-to-r from-blue-400 to-indigo-500"> сильнее.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto font-light">
            Пройди курс выносливости, дисциплины и лидерства. Тренировки по кикбоксингу, кроссфиту, выездные испытания, закаливание и реальные вызовы. В конце — награда сильнейшим!
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <button 
              onClick={() => {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                  window.scrollTo({
                    top: contactSection.offsetTop - 80,
                    behavior: 'smooth'
                  });
                }
              }}
              className="kamp-button-primary bg-kamp-accent hover:bg-opacity-90"
            >
              Записаться на курс
            </button>
            <button 
              onClick={() => {
                const programSection = document.getElementById('program');
                if (programSection) {
                  window.scrollTo({
                    top: programSection.offsetTop - 80,
                    behavior: 'smooth'
                  });
                }
              }}
              className="kamp-button-secondary text-white bg-white/10 border-white/20 hover:bg-white/20"
            >
              Программа курса
            </button>
          </div>
        </div>
        
        <button 
          onClick={scrollToAbout}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white animate-bounce-slow"
          aria-label="Scroll down"
        >
          <ChevronDown size={32} />
        </button>
      </div>
    </VideoBackground>
  );
};
