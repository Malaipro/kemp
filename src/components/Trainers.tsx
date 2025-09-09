import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';

interface Trainer {
  id: string;
  name: string;
  role: string;
  image_url?: string;
  quote?: string;
  experience?: string;
  bio?: string;
  sort_order: number;
}

export const Trainers: React.FC = () => {
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const isMobile = useIsMobile();

  // Загружаем тренеров из базы данных
  const { data: trainers = [], isLoading } = useQuery({
    queryKey: ['trainers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trainers')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      if (error) throw error;
      return data as Trainer[];
    },
  });

  if (isLoading) {
    return (
      <section id="trainers" className="kamp-section bg-black py-4 md:py-16">
        <div className="kamp-container flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kamp-primary"></div>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="trainers" 
      className="kamp-section bg-black py-4 md:py-16"
    >
      <div className="kamp-container">
        <div className="section-heading reveal-on-scroll text-white">
          <span className="inline-block text-kamp-primary font-semibold mb-1 text-sm">Тренеры</span>
          <h2 className="text-white text-xl md:text-4xl">Наша команда профессионалов</h2>
          <p className="text-gray-300 text-xs md:text-base mt-2">
            Опытные наставники, которые не только научат технике, но и помогут раскрыть весь потенциал.
            Каждый из них — эксперт в своей области.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-8 mt-3 md:mt-16">
          {trainers.map((trainer) => (
            <div 
              key={trainer.id} 
              className="kamp-card overflow-hidden reveal-on-scroll hover-lift cursor-pointer bg-black border border-gray-800"
              onClick={() => setSelectedTrainer(trainer)}
            >
              <div className={`${isMobile ? 'aspect-[3/4]' : 'aspect-[3/4]'} overflow-hidden`}>
                <img 
                  src={trainer.image_url} 
                  alt={trainer.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out transform hover:scale-105"
                />
              </div>
              <div className={`${isMobile ? 'p-1.5' : 'p-4 md:p-6'} bg-black`}>
                <h3 className={`${isMobile ? 'text-xs' : 'text-lg md:text-xl'} font-bold text-white`}>{trainer.name}</h3>
                <p className={`text-kamp-primary font-medium ${isMobile ? 'text-[10px]' : 'text-xs md:text-sm'} mb-1 md:mb-3`}>{trainer.role}</p>
                {!isMobile && (
                  <p className="text-gray-600 text-xs md:text-sm italic mb-3 md:mb-4">"{trainer.quote}"</p>
                )}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTrainer(trainer);
                  }}
                  className="text-kamp-primary font-medium text-[10px] md:text-sm hover:underline"
                >
                  Подробнее
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedTrainer && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4">
          <div 
            className="bg-black rounded-xl w-full max-w-3xl max-h-[90vh] overflow-auto animate-scale-in text-white border border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <button 
                onClick={() => setSelectedTrainer(null)}
                className="absolute top-2 md:top-4 right-2 md:right-4 bg-gray-900 text-white rounded-full p-2 shadow-md z-10"
              >
                <X size={isMobile ? 16 : 20} />
              </button>
              
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/3">
                  <div className="h-48 md:h-full">
                    <img 
                      src={selectedTrainer.image_url} 
                      alt={selectedTrainer.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>
                <div className="w-full md:w-2/3 p-4 md:p-8 bg-black">
                  <span className="text-kamp-primary font-semibold text-xs md:text-sm">{selectedTrainer.role}</span>
                  <h3 className="text-xl md:text-2xl font-bold text-white mt-1 mb-3 md:mb-4">{selectedTrainer.name}</h3>
                  
                  <div className="bg-gray-900 p-3 md:p-4 rounded-lg mb-4 md:mb-6">
                    <p className="italic text-gray-300 text-sm md:text-base">"{selectedTrainer.quote}"</p>
                  </div>
                  
                  {selectedTrainer.experience && (
                    <div className="mb-4 md:mb-6">
                      <h4 className="font-bold text-white text-sm md:text-base mb-1 md:mb-2">Опыт</h4>
                      <p className="text-gray-300 text-xs md:text-sm">{selectedTrainer.experience}</p>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-bold text-white text-sm md:text-base mb-1 md:mb-2">Профессиональный подход</h4>
                    <p className="text-gray-300 text-xs md:text-sm">{selectedTrainer.bio}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
