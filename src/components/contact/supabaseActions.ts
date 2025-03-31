
import { supabase } from '@/integrations/supabase/client';

export interface FormData {
  name: string;
  phone: string;
  course: string;
}

export const saveContactSubmission = async (formData: FormData) => {
  console.log('Saving contact submission:', formData);
  
  // Add proper error handling and return the result of the insert operation
  try {
    const response = await supabase
      .from('contact_submissions')
      .insert([
        { 
          name: formData.name,
          phone: formData.phone,
          course: formData.course
        }
      ]);
      
    console.log('Supabase response:', response);
    return response;
  } catch (error) {
    console.error('Error saving contact submission:', error);
    throw error;
  }
};
