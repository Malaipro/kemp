
import React from 'react';
import { Send } from 'lucide-react';

interface ContactFormFieldsProps {
  formData: {
    name: string;
    phone: string;
    course: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isSubmitting: boolean;
}

export const ContactFormFields: React.FC<ContactFormFieldsProps> = ({
  formData,
  handleChange,
  isSubmitting,
}) => {
  return (
    <>
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
      
      <div className="mt-5">
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
      
      <div className="mt-5">
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
      
      <div className="mt-8">
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
    </>
  );
};
