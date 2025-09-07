import React, { useEffect } from 'react';
import { AskQuestion } from './contact/AskQuestion';
import { CountdownTimer } from './contact/CountdownTimer';
import { CourseInfo } from './contact/CourseInfo';
import { useIsMobile } from '@/hooks/use-mobile';

// Declare Bitrix form interface for TypeScript
declare global {
  interface Window {
    B24Form?: {
      init: (config: { id: number; type: string; container: string }) => void;
    };
  }
}
export const ContactForm: React.FC = () => {
  const isMobile = useIsMobile();
  useEffect(() => {
    // Безопасная загрузка Битрикс скрипта без dangerouslySetInnerHTML
    const loadBitrixForm = () => {
      // Проверяем, что скрипт еще не загружен
      if (document.querySelector('[data-bitrix-form-loaded]')) {
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn-ru.bitrix24.ru/b23536290/crm/form/loader_134.js?' + (Date.now() / 180000 | 0);
      script.async = true;
      script.setAttribute('data-bitrix-form-loaded', 'true');
      
      script.onload = () => {
        console.log('Битрикс скрипт загружен безопасно');
        
        // Инициализируем форму после загрузки скрипта
        if (window.B24Form) {
          window.B24Form.init({
            id: 134,
            type: 'inline',
            container: 'bitrix-form-container'
          });
        }
      };
      
      script.onerror = () => {
        console.error('Ошибка загрузки Битрикс формы');
      };
      
      document.head.appendChild(script);
    };

    loadBitrixForm();

    // Очистка при размонтировании компонента
    return () => {
      const script = document.querySelector('[data-bitrix-form-loaded]');
      if (script && document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);
  const scrollToContactForm = () => {
    const contactFormElement = document.getElementById('contact-form');
    if (contactFormElement) {
      contactFormElement.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return <section id="contact" className="kamp-section bg-black text-white py-6 md:py-16">
      <div className="kamp-container">
        <div className="section-heading reveal-on-scroll">
          <span className="inline-block text-kamp-primary font-semibold mb-2">Записаться в клуб</span>
          <h2 className="text-white">Готов проверить себя?</h2>
          <p className="text-gray-300">
            Заполни форму ниже, и мы свяжемся с тобой для уточнения деталей. 
            Количество мест ограничено, не упусти свой шанс.
          </p>
        </div>

        <div className="mt-8 md:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-12">
          {/* Contact Form */}
          <div className="reveal-on-scroll">
            <div id="contact-form" className={`bg-[#111] rounded-xl shadow-soft ${isMobile ? 'p-4' : 'p-8'} border border-gray-800`}>
              <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-white mb-4 md:mb-6`}>Оставить заявку</h3>
              
              {/* Безопасный контейнер для Битрикс формы */}
              <div 
                id="bitrix-form-container" 
                className="bitrix-form-container min-h-[300px] flex items-center justify-center"
              >
                <div className="text-gray-400 text-center">
                  <div className="animate-spin w-6 h-6 border-2 border-kamp-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-sm">Загрузка формы...</p>
                </div>
              </div>
            </div>
            
            {/* Ask a Question Button */}
            {!isMobile && <AskQuestion />}
          </div>

          {/* Timer and Info */}
          <div className="reveal-on-scroll">
            <div className="bg-gradient-to-r from-kamp-accent to-kamp-primary text-white rounded-xl overflow-hidden shadow-lg h-full flex flex-col">
              <div className={`flex-grow ${isMobile ? 'p-4' : 'p-8'}`}>
                <h3 className={`${isMobile ? 'text-lg mb-3' : 'text-xl mb-6'} font-bold`}>Новый интенсив</h3>
                {isMobile ? <p className="text-white/80 mb-4 text-sm">
                    Интенсив начинается 1 сентября! Записывайся сейчас - количество мест ограничено!
                  </p> : <p className="text-white/80 mb-8">Новый интенсив стартует 8 сентября 2025! Записывайся сейчас - количество мест ограничено, чтобы мы могли уделить внимание каждому участнику.</p>}

                <CountdownTimer targetDate={new Date('2025-09-01T00:00:00')} />
                
                {!isMobile && <CourseInfo />}
              </div>
              
              <div className={`${isMobile ? 'p-4' : 'p-6'} bg-black/20 backdrop-blur-sm border-t border-white/10`}>
                <div className="flex items-center">
                  <div className="flex-grow">
                    <div className={`${isMobile ? 'text-base' : 'text-xl'} font-bold`}>Ограниченный набор</div>
                    <div className="text-white/70 text-xs md:text-sm">Запишись прямо сейчас</div>
                  </div>
                  <button onClick={scrollToContactForm} className={`kamp-button text-kamp-primary bg-white hover:bg-white/90 ${isMobile ? 'text-xs px-3 py-1.5' : ''}`}>
                    Записаться
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};