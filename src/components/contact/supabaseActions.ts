
import { supabase } from '@/integrations/supabase/client';

export interface FormData {
  name: string;
  phone: string;
  social: string;
}

export const saveContactSubmission = async (formData: FormData) => {
  console.log('Saving contact submission:', formData);
  
  try {
    const response = await supabase
      .from('contact_submissions')
      .insert([
        { 
          name: formData.name,
          phone: formData.phone,
          course: 'male', // Устанавливаем значение по умолчанию, так как поле обязательное в БД
          social: formData.social || ''
        }
      ]);
      
    console.log('Supabase response:', response);
    return response;
  } catch (error) {
    console.error('Error saving contact submission:', error);
    throw error;
  }
};
