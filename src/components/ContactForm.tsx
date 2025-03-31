
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Send, Clock, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    course: 'male', // default to male course
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Countdown timer for next course start (April 7, 2025)
  const targetDate = new Date("2025-04-07T00:00:00");
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save submission to Supabase
      const { error } = await supabase
        .from('contact_submissions')
        .insert([
          { 
            name: formData.name,
            phone: formData.phone,
            course: formData.course
          }
        ]);

      if (error) {
        throw error;
      }

      // Reset form and show success state
      setFormData({
        name: '',
        phone: '',
        course: 'male',
      });
      setSubmitted(true);
      toast.success("Вы успешно зарегестрировались на курс", {
        duration: 5000,
      });

      // Open Google Form in new tab
      window.open("https://forms.gle/ZcyxhZawxxakThWb6", "_blank");
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="kamp-section bg-black text-white">
      <div className="kamp-container">
        <div className="section-heading reveal-on-scroll">
          <span className="inline-block text-kamp-primary font-semibold mb-2">Записаться на курс</span>
          <h2 className="text-white">Готов проверить себя?</h2>
          <p className="text-gray-300">
            Заполни форму ниже, и мы свяжемся с тобой для уточнения деталей. 
            Количество мест ограничено, не упусти свой шанс.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="reveal-on-scroll">
            <div className="bg-[#111] rounded-xl shadow-soft p-8 border border-gray-800">
              <h3 className="text-xl font-bold text-white mb-6">Оставить заявку</h3>
              
              {submitted ? (
                <div className="p-6 bg-kamp-accent/20 rounded-lg text-center">
                  <div className="text-2xl font-bold text-kamp-accent mb-2">Спасибо за заявку!</div>
                  <p className="text-white/80 mb-4">
                    Вы успешно зарегестрировались на курс. Мы свяжемся с вами в ближайшее время.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="kamp-button-primary"
                  >
                    Отправить ещё одну заявку
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label 
                      htmlFor="name" 
                      className="block text-sm font-medium text-gray-300 mb-1"
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
                      className="block text-sm font-medium text-gray-300 mb-1"
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
                      className="block text-sm font-medium text-gray-300 mb-1"
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
                      className="kamp-button-primary w-full flex items-center justify-center"
                      disabled={isSubmitting}
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
              )}
            </div>
            
            {/* Ask a Question Button */}
            <div className="mt-6 bg-[#111] rounded-xl shadow-soft p-6 border border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MessageSquare size={20} className="text-kamp-accent mr-3" />
                  <span className="font-medium">Остались вопросы?</span>
                </div>
                <a 
                  href="https://t.me/Dmitriy_nar" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="kamp-button-primary text-sm px-4 py-2"
                >
                  Задать вопрос
                </a>
              </div>
            </div>
          </div>

          {/* Timer and Info */}
          <div className="reveal-on-scroll">
            <div className="bg-gradient-to-r from-kamp-accent to-kamp-primary text-white rounded-xl overflow-hidden shadow-lg h-full flex flex-col">
              <div className="flex-grow p-8">
                <h3 className="text-xl font-bold mb-6">Не упусти свой шанс</h3>
                <p className="text-white/80 mb-8">
                  Следующий поток КЭМП стартует 7 апреля 2025 года. Количество мест ограничено, 
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
              
              <div className="p-6 bg-black/20 backdrop-blur-sm border-t border-white/10">
                <div className="flex items-center">
                  <div className="flex-grow">
                    <div className="text-xl font-bold">Ограниченный набор</div>
                    <div className="text-white/70 text-sm">Запишись прямо сейчас</div>
                  </div>
                  <a 
                    href="https://forms.gle/ZcyxhZawxxakThWb6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="kamp-button text-kamp-primary bg-white hover:bg-white/90"
                  >
                    Записаться
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
