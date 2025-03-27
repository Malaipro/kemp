
import React from 'react';
import { Instagram, Facebook, Twitter, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const menuItems = [
    { id: 'about', label: 'О нас' },
    { id: 'philosophy', label: 'Философия' },
    { id: 'program', label: 'Программа' },
    { id: 'trainers', label: 'Тренеры' },
    { id: 'leaderboard', label: 'Рейтинг' },
    { id: 'contact', label: 'Контакты' }
  ];

  const programItems = [
    { label: 'Кикбоксинг' },
    { label: 'Кроссфит' },
    { label: 'Выездные испытания' },
    { label: 'Реабилитация' },
    { label: 'Пробежки и закаливание' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="kamp-container py-16">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <a href="#" className="text-2xl font-display font-bold">КЭМП</a>
            <p className="mt-4 text-gray-400">
              Курс Эффективного Мужского Прогресса — интенсивная программа для тех, 
              кто готов пройти испытания и стать сильнее.
            </p>
            <div className="flex space-x-4 mt-6">
              <a 
                href="https://t.me/KEMPRYX" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                aria-label="Telegram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send">
                  <path d="m22 2-7 20-4-9-9-4Z"></path>
                  <path d="M22 2 11 13"></path>
                </svg>
              </a>
              <a 
                href="https://www.instagram.com/cemp_kazan" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://vk.com/kemp_ryx" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                aria-label="VKontakte"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-lg font-bold mb-4">Навигация</h3>
            <ul className="space-y-3">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <a 
                    href={`#${item.id}`} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-lg font-bold mb-4">Программы</h3>
            <ul className="space-y-3">
              {programItems.map((item, index) => (
                <li key={index}>
                  <a href="#program" className="text-gray-400 hover:text-white transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-lg font-bold mb-4">Контакты</h3>
            <ul className="space-y-4">
              <li className="flex">
                <Phone size={20} className="mr-3 text-gray-400 flex-shrink-0" />
                <span className="text-gray-400">+7 927 444 1844</span>
              </li>
              <li className="flex">
                <MapPin size={20} className="mr-3 text-gray-400 flex-shrink-0" />
                <span className="text-gray-400">ул. Павлюхина 108б к2, г. Казань</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} КЭМП. Все права защищены.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-gray-300 text-sm">
              Политика конфиденциальности
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-300 text-sm">
              Условия использования
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
