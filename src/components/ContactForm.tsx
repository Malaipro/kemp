import React, { useEffect } from 'react';
import { AskQuestion } from './contact/AskQuestion';
import { CountdownTimer } from './contact/CountdownTimer';
import { CourseInfo } from './contact/CourseInfo';
import { useIsMobile } from '@/hooks/use-mobile';

export const ContactForm: React.FC = () => {
  const isMobile = useIsMobile();

  useEffect(() => {
    // Загружаем скрипт Битрикс формы
    const script = document.createElement('script');
    script.setAttribute('data-b24-form', 'inline/134/km4hms');
    script.setAttribute('data-skip-moving', 'true');
    script.innerHTML = `
      (function(w,d,u){
        var s=d.createElement('script');s.async=true;s.src=u+'?'+(Date.now()/180000|0);
        var h=d.getElementsByTagName('script')[0];h.parentNode.insertBefore(s,h);
      })(window,document,'https://cdn-ru.bitrix24.ru/b23536290/crm/form/loader_134.js');
    `;
    
    // Добавляем скрипт в head
    document.head.appendChild(script);

    // Очистка при размонтировании компонента
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const scrollToContactForm = () => {
    const contactFormElement = document.getElementById('contact-form');
    if (contactFormElement) {
      contactFormElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="contact" className="kamp-section bg-black text-white py-6 md:py-16">
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
              
              {/* Контейнер для Битрикс формы */}
              <div className="bitrix-form-container">
                {/* Форма Битрикс загрузится здесь автоматически */}
              </div>
              
              {/* Кнопка отправки формы */}
              <div className="mt-6">
                <button 
                  type="button"
                  className="w-full px-6 py-3 bg-kamp-accent hover:bg-kamp-accent/90 text-white font-semibold rounded-lg transition-all duration-300 cursor-pointer z-10 relative"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('Кнопка нажата');
                    
                    // Попытаемся найти и отправить форму Битрикс
                    const bitrixForm = document.querySelector('[data-b24-form="inline/134/km4hms"] form, .bitrix-form-container form, .b24-form form') as HTMLFormElement;
                    console.log('Найденная форма Битрикс:', bitrixForm);
                    
                    if (bitrixForm) {
                      console.log('Отправляем форму Битрикс');
                      bitrixForm.requestSubmit();
                    } else {
                      console.log('Форма Битрикс не найдена, попробуем другие селекторы');
                      // Попробуем найти любую форму внутри контейнера
                      const anyForm = document.querySelector('.bitrix-form-container form, #contact-form form, form') as HTMLFormElement;
                      console.log('Любая найденная форма:', anyForm);
                      if (anyForm) {
                        anyForm.requestSubmit();
                      } else {
                        alert('Форма загружается... Попробуйте через несколько секунд');
                      }
                    }
                  }}
                >
                  Записаться в клуб
                </button>
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
                {isMobile ? (
                  <p className="text-white/80 mb-4 text-sm">
                    Интенсив начинается 1 сентября! Записывайся сейчас - количество мест ограничено!
                  </p>
                ) : (
                  <p className="text-white/80 mb-8">
                    Новый интенсив стартует 1 сентября 2025! Записывайся сейчас - количество мест ограничено, 
                    чтобы мы могли уделить внимание каждому участнику.
                  </p>
                )}

                <CountdownTimer targetDate={new Date('2025-09-01T00:00:00')} />
                
                {!isMobile && <CourseInfo />}
              </div>
              
              <div className={`${isMobile ? 'p-4' : 'p-6'} bg-black/20 backdrop-blur-sm border-t border-white/10`}>
                <div className="flex items-center">
                  <div className="flex-grow">
                    <div className={`${isMobile ? 'text-base' : 'text-xl'} font-bold`}>Ограниченный набор</div>
                    <div className="text-white/70 text-xs md:text-sm">Запишись прямо сейчас</div>
                  </div>
                  <button 
                    onClick={scrollToContactForm}
                    className={`kamp-button text-kamp-primary bg-white hover:bg-white/90 ${isMobile ? 'text-xs px-3 py-1.5' : ''}`}
                  >
                    Записаться
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};