
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { AskQuestion } from './contact/AskQuestion';
import { ContactFormFields } from './contact/ContactFormFields';
import { CountdownTimer } from './contact/CountdownTimer';
import { CourseInfo } from './contact/CourseInfo';
import { SubmissionSuccess } from './contact/SubmissionSuccess';
import { ZapierIntegration } from './contact/ZapierIntegration';
import { WebhookIntegration } from './contact/WebhookIntegration';
import { NodulIntegration } from './contact/NodulIntegration';
import { saveContactSubmission, FormData } from './contact/supabaseActions';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    social: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [zapierWebhookUrl, setZapierWebhookUrl] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [nodulWebhookUrl, setNodulWebhookUrl] = useState('');
  const [showZapierSettings, setShowZapierSettings] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Загружаем сохраненные URLs из localStorage
    const savedZapierUrl = localStorage.getItem('zapierWebhookUrl');
    const savedWebhookUrl = localStorage.getItem('clubWebhookUrl');
    const savedNodulUrl = localStorage.getItem('clubNodulWebhookUrl');
    
    if (savedZapierUrl) {
      setZapierWebhookUrl(savedZapierUrl);
    }
    if (savedWebhookUrl) {
      setWebhookUrl(savedWebhookUrl);
    }
    if (savedNodulUrl) {
      setNodulWebhookUrl(savedNodulUrl);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const scrollToContactForm = () => {
    const contactFormElement = document.getElementById('contact-form');
    if (contactFormElement) {
      contactFormElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sendToWebhook = async (data: FormData) => {
    if (!webhookUrl) {
      return { success: false, error: 'Webhook URL не настроен' };
    }

    try {
      const webhookData = {
        name: data.name,
        phone: data.phone,
        social: data.social,
        course: 'male',
        source: 'КЭМП - Клуб Эффективного Мужского Прогресса',
        timestamp: new Date().toISOString(),
        website: 'https://mcruh.ru'
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return { success: true, data: await response.text() };
    } catch (error) {
      console.error('Ошибка отправки на вебхук:', error);
      return { success: false, error: error.message };
    }
  };

  const sendToZapier = async (data: FormData) => {
    if (!zapierWebhookUrl) {
      return { success: false, error: 'Zapier webhook URL не настроен' };
    }

    try {
      const { data: result, error } = await supabase.functions.invoke('zapier-webhook', {
        body: { 
          formData: data, 
          zapierWebhookUrl: zapierWebhookUrl 
        }
      });

      if (error) {
        throw error;
      }

      return { success: true, data: result };
    } catch (error) {
      console.error('Ошибка отправки в Zapier:', error);
      return { success: false, error: error.message };
    }
  };

  const sendToNodul = async (data: FormData) => {
    if (!nodulWebhookUrl) {
      return { success: false, error: 'Nodul webhook URL не настроен' };
    }

    try {
      const nodulData = {
        name: data.name,
        phone: data.phone,
        social: data.social,
        course: 'male',
        source: 'КЭМП - Клуб Эффективного Мужского Прогресса',
        timestamp: new Date().toISOString(),
        website: 'https://mcruh.ru'
      };

      const response = await fetch(nodulWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nodulData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      return { success: true, data: await response.text() };
    } catch (error) {
      console.error('Ошибка отправки в Nodul:', error);
      return { success: false, error: error.message };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    console.log('Form submitted:', formData);

    try {
      // Сохраняем в базу данных
      const { error } = await saveContactSubmission(formData);

      if (error) {
        throw error;
      }

      // Отправляем на вебхук (если настроен)
      if (webhookUrl) {
        const webhookResult = await sendToWebhook(formData);
        
        if (webhookResult.success) {
          console.log('Данные успешно отправлены на вебхук:', webhookResult.data);
          toast.success("Заявка отправлена и передана в систему!");
        } else {
          console.error('Ошибка отправки на вебхук:', webhookResult.error);
          toast.error("Заявка сохранена, но не удалось отправить на вебхук");
        }
      }

      // Отправляем в Zapier (если настроено)
      if (zapierWebhookUrl) {
        const zapierResult = await sendToZapier(formData);
        
        if (zapierResult.success) {
          console.log('Данные успешно отправлены в Zapier:', zapierResult.data);
          toast.success("Заявка отправлена и передана в CRM систему!");
        } else {
          console.error('Ошибка отправки в Zapier:', zapierResult.error);
          toast.error("Заявка сохранена, но не удалось отправить в CRM");
        }
      }

      // Отправляем в Nodul (если настроено)
      if (nodulWebhookUrl) {
        const nodulResult = await sendToNodul(formData);
        
        if (nodulResult.success) {
          console.log('Данные успешно отправлены в Nodul:', nodulResult.data);
          toast.success("Заявка отправлена и передана в Nodul!");
        } else {
          console.error('Ошибка отправки в Nodul:', nodulResult.error);
          toast.error("Заявка сохранена, но не удалось отправить в Nodul");
        }
      }

      // Если ни один из вебхуков не настроен
      if (!webhookUrl && !zapierWebhookUrl && !nodulWebhookUrl) {
        toast.success("Вы успешно зарегестрировались в клуб");
      }

      // Reset form and show success state
      setFormData({
        name: '',
        phone: '',
        social: '',
      });
      setSubmitted(true);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.");
    } finally {
      setIsSubmitting(false);
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
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-white`}>Оставить заявку</h3>
                <button
                  onClick={() => setShowZapierSettings(!showZapierSettings)}
                  className="text-gray-400 hover:text-white transition-colors"
                  title="Настройки интеграции"
                >
                  ⚙️
                </button>
              </div>

              {showZapierSettings && (
                <div className="mb-6 space-y-4">
                  <WebhookIntegration 
                    webhookUrl={webhookUrl}
                    onWebhookUrlChange={setWebhookUrl}
                  />
                  <ZapierIntegration 
                    webhookUrl={zapierWebhookUrl}
                    onWebhookUrlChange={setZapierWebhookUrl}
                  />
                  <NodulIntegration 
                    webhookUrl={nodulWebhookUrl}
                    onWebhookUrlChange={setNodulWebhookUrl}
                  />
                </div>
              )}
              
              {submitted ? (
                <SubmissionSuccess onReset={() => setSubmitted(false)} />
              ) : (
                <form onSubmit={handleSubmit}>
                  <ContactFormFields 
                    formData={formData}
                    handleChange={handleChange}
                    isSubmitting={isSubmitting}
                  />
                </form>
              )}
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
