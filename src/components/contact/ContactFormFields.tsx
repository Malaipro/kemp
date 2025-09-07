
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { validateName, validatePhone, sanitizeInput, rateLimiter } from '@/lib/validation';

interface ContactFormFieldsProps {
  formData: {
    name: string;
    phone: string;
    social: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isSubmitting: boolean;
}

export const ContactFormFields: React.FC<ContactFormFieldsProps> = ({
  formData,
  handleChange,
  isSubmitting,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSecureChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    
    // Validate input
    const newErrors = { ...errors };
    
    if (name === 'name' && sanitizedValue && !validateName(sanitizedValue)) {
      newErrors.name = 'Имя должно содержать только буквы, пробелы и дефисы';
    } else {
      delete newErrors.name;
    }
    
    if (name === 'phone' && sanitizedValue && !validatePhone(sanitizedValue)) {
      newErrors.phone = 'Введите корректный номер телефона';
    } else {
      delete newErrors.phone;
    }
    
    setErrors(newErrors);
    
    // Call original handler with sanitized value
    handleChange({
      ...e,
      target: {
        ...e.target,
        value: sanitizedValue
      }
    } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>);
  };

  const handleSubmit = (e: React.FormEvent) => {
    // Rate limiting check
    if (!rateLimiter.isAllowed('contact-form-submit', 3, 60000)) {
      alert('Слишком много попыток отправки. Попробуйте через минуту.');
      e.preventDefault();
      return;
    }
  };

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
          onChange={handleSecureChange}
          required
          maxLength={50}
          className={`kamp-input ${errors.name ? 'border-red-500' : ''}`}
          placeholder="Введите ваше имя"
        />
        {errors.name && (
          <p className="text-red-400 text-xs mt-1">{errors.name}</p>
        )}
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
          onChange={handleSecureChange}
          required
          maxLength={20}
          className={`kamp-input ${errors.phone ? 'border-red-500' : ''}`}
          placeholder="+7 (___) ___-__-__"
        />
        {errors.phone && (
          <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
        )}
      </div>
      
      <div className="mt-5">
        <label 
          htmlFor="social" 
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          Соц. сети
        </label>
        <input
          type="text"
          id="social"
          name="social"
          value={formData.social}
          onChange={handleSecureChange}
          maxLength={100}
          className="kamp-input"
          placeholder="Ваш Instagram, Telegram или другие соц. сети"
        />
      </div>
      
      <div className="mt-8">
        <button 
          type="submit"
          onClick={handleSubmit}
          className="kamp-button-primary w-full flex items-center justify-center"
          disabled={isSubmitting || Object.keys(errors).length > 0}
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
