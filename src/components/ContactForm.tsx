import React, { useState } from 'react';
import { toast } from 'sonner';
import { AskQuestion } from './contact/AskQuestion';
import { ContactFormFields } from './contact/ContactFormFields';
import { CountdownTimer } from './contact/CountdownTimer';
import { CourseInfo } from './contact/CourseInfo';
import { SubmissionSuccess } from './contact/SubmissionSuccess';
import { saveContactSubmission, FormData } from './contact/supabaseActions';
import { useIsMobile } from '@/hooks/use-mobile';

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    course: 'male', // default to male course
    social: '', // Add social field to the initial state
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const isMobile = useIsMobile();

  // The CountdownTimer now automatically sets to July 1, 2025
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    console.log('Form submitted:', formData);

    try {
      const { error } = await saveContactSubmission(formData);

      if (error) {
        throw error;
      }

      // Reset form and show success state
      setFormData({
        name: '',
        phone: '',
        course: 'male',
        social: '', // Reset social field as well
      });
      setSubmitted(true);
      toast.success("Вы успешно зарегестрировались в клуб", {
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
                <h3 className={`${isMobile ? 'text-lg mb-3' : 'text-xl mb-6'} font-bold`}>Не упусти свой шанс</h3>
                {isMobile ? (
                  <p className="text-white/80 mb-4 text-sm">
                    Успейте записаться! Набор закрывается 1 июля. Количество мест ограничено!
                  </p>
                ) : (
                  <p className="text-white/80 mb-8">
                    Успейте записаться! Набор закрывается 1 июля. Количество мест ограничено, 
                    чтобы мы могли уделить внимание каждому участнику.
                  </p>
                )}

                <CountdownTimer />
                
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
