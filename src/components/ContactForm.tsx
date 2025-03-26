
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Send, Clock } from 'lucide-react';

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    course: 'male', // default to male course
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Countdown timer for next course start
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 14); // 14 days from now
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        clearInterval(interval);
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [targetDate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast.success("Заявка успешно отправлена!", {
        description: "Мы свяжемся с вами в ближайшее время.",
      });
      setFormData({
        name: '',
        phone: '',
        course: 'male',
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <section id="contact" className="kamp-section bg-white">
      <div className="kamp-container">
        <div className="section-heading reveal-on-scroll">
          <span className="inline-block text-kamp-primary font-semibold mb-2">Записаться на курс</span>
          <h2 className="text-kamp-dark">Готов проверить себя?</h2>
          <p>
            Заполни форму ниже, и мы свяжемся с тобой для уточнения деталей. 
            Количество мест ограничено, не упусти свой шанс.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="reveal-on-scroll">
            <div className="bg-white rounded-xl shadow-soft p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-kamp-dark mb-6">Оставить заявку</h3>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label 
                    htmlFor="name" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Имя
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="kamp-input"
                    placeholder="Введите ваше имя"
                  />
                </div>
                
                <div>
                  <label 
                    htmlFor="phone" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Телефон
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="kamp-input"
                    placeholder="+7 (___) ___-__-__"
                  />
                </div>
                
                <div>
                  <label 
                    htmlFor="course" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Выберите курс
                  </label>
                  <select
                    id="course"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    required
                    className="kamp-input"
                  >
                    <option value="male">Мужской курс</option>
                    <option value="female">Женский курс</option>
                  </select>
                </div>
                
                <div className="pt-3">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`kamp-button-primary w-full flex items-center justify-center ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Отправка...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Send size={18} className="mr-2" />
                        Отправить заявку
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Timer and Info */}
          <div className="reveal-on-scroll">
            <div className="bg-gradient-to-r from-kamp-primary to-blue-600 text-white rounded-xl overflow-hidden shadow-lg h-full flex flex-col">
              <div className="flex-grow p-8">
                <h3 className="text-xl font-bold mb-6">Не упусти свой шанс</h3>
                <p className="text-white/80 mb-8">
                  Следующий поток КЭМП стартует совсем скоро. Количество мест ограничено, 
                  чтобы мы могли уделить внимание каждому участнику.
                </p>

                <div className="mb-8">
                  <p className="text-white/80 mb-2 flex items-center">
                    <Clock size={16} className="mr-2" />
                    До старта следующего потока:
                  </p>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                      <div className="text-3xl font-bold">{timeLeft.days}</div>
                      <div className="text-xs text-white/70 mt-1">дней</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                      <div className="text-3xl font-bold">{timeLeft.hours}</div>
                      <div className="text-xs text-white/70 mt-1">часов</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                      <div className="text-3xl font-bold">{timeLeft.minutes}</div>
                      <div className="text-xs text-white/70 mt-1">минут</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                      <div className="text-3xl font-bold">{timeLeft.seconds}</div>
                      <div className="text-xs text-white/70 mt-1">секунд</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <h4 className="font-bold text-lg mb-2">Что включено?</h4>
                    <ul className="space-y-2 text-white/80">
                      <li className="flex items-start">
                        <span className="text-white mr-2">•</span>
                        <span>10 тренировок по кикбоксингу</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-white mr-2">•</span>
                        <span>8 функциональных тренировок</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-white mr-2">•</span>
                        <span>4 выездных мероприятия</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-white mr-2">•</span>
                        <span>Персональное сопровождение</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-white/10 backdrop-blur-sm border-t border-white/10">
                <div className="flex items-center">
                  <div className="flex-grow">
                    <div className="text-xl font-bold">30,000 ₽</div>
                    <div className="text-white/70 text-sm">за полный курс</div>
                  </div>
                  <button 
                    onClick={() => {
                      const form = document.querySelector('form');
                      if (form) {
                        form.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="kamp-button text-kamp-primary bg-white hover:bg-white/90"
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
