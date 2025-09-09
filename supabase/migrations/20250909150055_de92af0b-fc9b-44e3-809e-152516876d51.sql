-- Add test number and completion time to cooper_test_results
ALTER TABLE public.cooper_test_results 
ADD COLUMN test_number INTEGER NOT NULL DEFAULT 1,
ADD COLUMN completion_time_seconds INTEGER;

-- Add constraint to ensure test_number is 1 or 2
ALTER TABLE public.cooper_test_results 
ADD CONSTRAINT cooper_test_number_check CHECK (test_number IN (1, 2));

-- Create index for better performance
CREATE INDEX idx_cooper_test_participant_number ON public.cooper_test_results(participant_id, test_number);