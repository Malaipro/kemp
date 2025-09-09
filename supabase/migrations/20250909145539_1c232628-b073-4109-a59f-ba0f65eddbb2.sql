-- Create intensive streams table
CREATE TABLE public.intensive_streams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_current BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.intensive_streams ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active streams
CREATE POLICY "Allow public read access for active streams" 
ON public.intensive_streams 
FOR SELECT 
USING (is_active = true);

-- Super admin can manage all streams
CREATE POLICY "Super admin can manage all streams" 
ON public.intensive_streams 
FOR ALL 
USING (is_super_admin(auth.uid()))
WITH CHECK (is_super_admin(auth.uid()));

-- Add stream_id to participants table
ALTER TABLE public.участники 
ADD COLUMN stream_id UUID REFERENCES public.intensive_streams(id);

-- Create index for better performance
CREATE INDEX idx_participants_stream_id ON public.участники(stream_id);

-- Insert default streams
INSERT INTO public.intensive_streams (name, description, start_date, end_date, is_current) VALUES
('1-й поток', 'Первый интенсив КЭМП', '2024-01-01', '2024-02-29', false),
('2-й поток', 'Второй интенсив КЭМП', '2024-03-01', '2024-04-30', true);

-- Update existing participants to belong to 2nd stream
UPDATE public.участники 
SET stream_id = (SELECT id FROM public.intensive_streams WHERE name = '2-й поток')
WHERE stream_id IS NULL;

-- Create trigger for updating timestamps
CREATE TRIGGER update_intensive_streams_updated_at
BEFORE UPDATE ON public.intensive_streams
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();