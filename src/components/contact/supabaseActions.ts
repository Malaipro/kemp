
import { supabase } from '@/integrations/supabase/client';

export interface FormData {
  name: string;
  phone: string;
  course: string;
}

export const saveContactSubmission = async (formData: FormData) => {
  return await supabase
    .from('contact_submissions')
    .insert([
      { 
        name: formData.name,
        phone: formData.phone,
        course: formData.course
      }
    ]);
};
