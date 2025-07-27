
import React from 'react';
import { Instagram, Facebook, Phone, MapPin } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export const Footer: React.FC = () => {
  const isMobile = useIsMobile();
  
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

  const menuItems = [
    { id: 'about', label: 'О нас' },
    { id: 'program', label: 'Программа' },
    { id: 'trainers', label: 'Тренеры' },
    { id: 'leaderboard', label: 'Рейтинг' },
    { id: 'contact', label: 'Контакты' }
  ];

  const programItems = [
    { label: 'Кикбоксинг' },
    { label: 'Джиу-джитсу' },
    { label: 'Выездные испытания' },
    { label: 'Реабилитация' },
    { label: 'Пробежки и закаливание' }
  ];

  if (isMobile) {
    return (
      <footer className="bg-gray-900 text-white text-xs">
        <div className="kamp-container py-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2">
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                className="text-base font-display font-bold"
              >
                КЭМП
              </a>
              <p className="mt-1 text-gray-400 text-[10px]">
                Клуб Эффективного Мужского Прогресса — интенсивная программа для тех, 
                кто готов пройти испытания и стать сильнее.
              </p>
              <div className="flex space-x-2 mt-2">
                <a 
                  href="https://t.me/KEMPRYX" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 p-1 rounded-full transition-colors flex items-center justify-center"
                  aria-label="Telegram"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send">
                    <path d="m22 2-7 20-4-9-9-4Z"></path>
                    <path d="M22 2 11 13"></path>
                  </svg>
                </a>
                <a 
                  href="https://www.instagram.com/cemp_kazan" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 p-1 rounded-full transition-colors flex items-center justify-center"
                  aria-label="Instagram"
                >
                  <Instagram size={12} />
                </a>
                <a 
                  href="https://vk.com/kemp_ryx" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 p-1 rounded-full transition-colors flex items-center justify-center"
                  aria-label="VKontakte"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-xs font-bold mt-2 mb-1">Навигация</h3>
              <ul className="grid grid-cols-2 gap-x-1 gap-y-0.5">
                {menuItems.map((item) => (
                  <li key={item.id} className="text-[10px]">
                    <button 
                      onClick={() => scrollToSection(item.id)} 
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-xs font-bold mt-2 mb-1">Контакты</h3>
              <ul className="space-y-1">
                <li className="flex">
                  <Phone size={10} className="mr-1 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-400 text-[10px]">89673785151</span>
                </li>
                <li className="flex">
                  <MapPin size={10} className="mr-1 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-400 text-[10px]">ул. Павлюхина 108б к2, г. Казань</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-3 pt-2 flex flex-col items-center">
            <p className="text-gray-500 text-[9px]">
              © {new Date().getFullYear()} КЭМП. Все права защищены.
            </p>
            <div className="mt-1 flex space-x-3">
              <a href="#" className="text-gray-500 hover:text-gray-300 text-[9px]">
                Политика конфиденциальности
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-300 text-[9px]">
                Условия использования
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="kamp-container py-8">
        <div className="grid md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              className="text-xl font-display font-bold"
            >
              КЭМП
            </a>
            <p className="mt-2 text-gray-400 text-sm">
              Клуб Эффективного Мужского Прогресса — интенсивная программа для тех, 
              кто готов пройти испытания и стать сильнее.
            </p>
            <div className="flex space-x-3 mt-3">
              <a 
                href="https://t.me/KEMPRYX" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors flex items-center justify-center"
                aria-label="Telegram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send">
                  <path d="m22 2-7 20-4-9-9-4Z"></path>
                  <path d="M22 2 11 13"></path>
                </svg>
              </a>
              <a 
                href="https://www.instagram.com/cemp_kazan" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors flex items-center justify-center"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a 
                href="https://vk.com/kemp_ryx" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors flex items-center justify-center"
                aria-label="VKontakte"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-base font-bold mb-2">Навигация</h3>
            <ul className="space-y-1.5">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button 
                    onClick={() => scrollToSection(item.id)} 
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-base font-bold mb-2">Программы</h3>
            <ul className="space-y-1.5">
              {programItems.map((item, index) => (
                <li key={index}>
                  <button 
                    onClick={() => scrollToSection('program')} 
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-base font-bold mb-2">Контакты</h3>
            <ul className="space-y-2">
              <li className="flex">
                <Phone size={16} className="mr-2 text-gray-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">89673785151</span>
              </li>
              <li className="flex">
                <MapPin size={16} className="mr-2 text-gray-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">ул. Павлюхина 108б к2, г. Казань</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-6 pt-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} КЭМП. Все права защищены.
          </p>
          <div className="mt-2 md:mt-0 flex space-x-4">
            <a href="#" className="text-gray-500 hover:text-gray-300 text-xs">
              Политика конфиденциальности
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-300 text-xs">
              Условия использования
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
