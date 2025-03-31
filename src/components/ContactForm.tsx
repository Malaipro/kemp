
import React, { useState } from 'react';
import { toast } from 'sonner';
import { AskQuestion } from './contact/AskQuestion';
import { ContactFormFields } from './contact/ContactFormFields';
import { CountdownTimer } from './contact/CountdownTimer';
import { CourseInfo } from './contact/CourseInfo';
import { SubmissionSuccess } from './contact/SubmissionSuccess';
import { saveContactSubmission, FormData } from './contact/supabaseActions';

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    course: 'male', // default to male course
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Set target date for countdown timer (April 7, 2025)
  const targetDate = new Date("2025-04-07T00:00:00");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
            <AskQuestion />
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

                <CountdownTimer targetDate={targetDate} />
                
                <CourseInfo />
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
