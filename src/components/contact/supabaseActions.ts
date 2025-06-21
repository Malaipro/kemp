
import { supabase } from '@/integrations/supabase/client';

export interface FormData {
  name: string;
  phone: string;
  course: string;
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
          course: formData.course,
          social: formData.social || null
        }
      ])
      .select();
      
    console.log('Supabase response:', response);
    
    if (response.error) {
      console.error('Supabase error details:', response.error);
      throw response.error;
    }
    
    return response;
  } catch (error) {
    console.error('Error saving contact submission:', error);
    throw error;
  }
};
