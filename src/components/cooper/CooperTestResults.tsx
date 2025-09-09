import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Activity } from 'lucide-react';
import { useRole } from '@/hooks/useRole';
import { sanitizeInput } from '@/lib/validation';

interface CooperTestResult {
  id: string;
  participant_id: string;
  test_date: string;
  distance_meters: number;
  time_minutes: number;
  fitness_level: string | null;
  notes: string | null;
  created_at: string;
}

interface CooperTestResultsProps {
  participantId: string;
}

export const CooperTestResults: React.FC<CooperTestResultsProps> = ({ participantId }) => {
  const { toast } = useToast();
  const { isSuperAdmin } = useRole();
  const [results, setResults] = useState<CooperTestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingResult, setEditingResult] = useState<CooperTestResult | null>(null);

  // Form state
  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);
  const [distance, setDistance] = useState<number>(2000);
  const [timeMinutes, setTimeMinutes] = useState<number>(12);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadResults();
  }, [participantId]);

  const loadResults = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cooper_test_results')
        .select('*')
        .eq('participant_id', participantId)
        .order('test_date', { ascending: false });

      if (error) {
        console.error('Error loading Cooper test results:', error);
        return;
      }

      setResults(data || []);
    } catch (error) {
      console.error('Error in loadResults:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateFitnessLevel = (distance: number, age: number = 25) => {
    // Упрощенная система оценки по тесту Купера для мужчин 20-29 лет
    if (distance >= 2800) return 'Отлично';
    if (distance >= 2400) return 'Хорошо';
    if (distance >= 2200) return 'Удовлетворительно';
    if (distance >= 1600) return 'Слабо';
    return 'Очень слабо';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fitnessLevel = calculateFitnessLevel(distance);
      const sanitizedNotes = sanitizeInput(notes);

      if (editingResult) {
        const { error } = await supabase
          .from('cooper_test_results')
          .update({
            test_date: testDate,
            distance_meters: distance,
            time_minutes: timeMinutes,
            fitness_level: fitnessLevel,
            notes: sanitizedNotes
          })
          .eq('id', editingResult.id);

        if (error) {
          toast({
            title: "Ошибка обновления",
            description: error.message,
            variant: "destructive"
          });
          return;
        }

        toast({
          title: "Результат обновлен",
          description: "Результат теста Купера успешно обновлен"
        });
      } else {
        const { error } = await supabase
          .from('cooper_test_results')
          .insert([{
            participant_id: participantId,
            test_date: testDate,
            distance_meters: distance,
            time_minutes: timeMinutes,
            fitness_level: fitnessLevel,
            notes: sanitizedNotes
          }]);

        if (error) {
          toast({
            title: "Ошибка добавления",
            description: error.message,
            variant: "destructive"
          });
          return;
        }

        toast({
          title: "Результат добавлен",
          description: "Результат теста Купера успешно добавлен"
        });
      }

      // Reset form
      setShowForm(false);
      setEditingResult(null);
      setTestDate(new Date().toISOString().split('T')[0]);
      setDistance(2000);
      setTimeMinutes(12);
      setNotes('');
      
      loadResults();
    } catch (error) {
      console.error('Error saving Cooper test result:', error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при сохранении результата",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (result: CooperTestResult) => {
    setEditingResult(result);
    setTestDate(result.test_date);
    setDistance(result.distance_meters);
    setTimeMinutes(result.time_minutes);
    setNotes(result.notes || '');
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот результат?')) return;

    try {
      const { error } = await supabase
        .from('cooper_test_results')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: "Ошибка удаления",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Результат удален",
        description: "Результат теста успешно удален"
      });

      loadResults();
    } catch (error) {
      console.error('Error deleting Cooper test result:', error);
    }
  };

  return (
    <Card className="kamp-card">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="flex items-center gap-2 text-kamp-accent">
            <Activity className="w-5 h-5" />
            Тест Купера
          </CardTitle>
          <Button
            onClick={() => setShowForm(!showForm)}
            variant="outline"
            size="sm"
            className="border-kamp-accent text-kamp-accent hover:bg-kamp-accent hover:text-black"
          >
            <Plus className="w-4 h-4 mr-2" />
            Добавить результат
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 border border-gray-700 rounded-lg bg-gray-900/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="test-date">Дата теста</Label>
                <Input
                  id="test-date"
                  type="date"
                  value={testDate}
                  onChange={(e) => setTestDate(e.target.value)}
                  required
                  className="kamp-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="distance">Дистанция (метры)</Label>
                <Input
                  id="distance"
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(parseInt(e.target.value) || 0)}
                  min={0}
                  max={5000}
                  required
                  className="kamp-input"
                />
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <Label htmlFor="notes">Заметки</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Дополнительные заметки о тесте"
                maxLength={500}
                className="kamp-input"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button 
                type="submit" 
                className="kamp-button-primary"
                disabled={loading}
              >
                {loading ? 'Сохранение...' : editingResult ? 'Обновить' : 'Добавить'}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setEditingResult(null);
                }}
                className="border-gray-600 text-gray-300"
              >
                Отмена
              </Button>
            </div>
          </form>
        )}

        {loading && results.length === 0 ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kamp-accent mx-auto"></div>
          </div>
        ) : results.length === 0 ? (
          <p className="text-gray-400 text-center py-4">
            Результатов теста Купера пока нет
          </p>
        ) : (
          <div className="grid gap-4">
            {results.map((result) => (
              <div 
                key={result.id}
                className="p-4 border border-gray-700 rounded-lg bg-gray-900/30 hover:bg-gray-900/50 transition-colors"
              >
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 mb-2 flex-wrap">
                      <span className="text-kamp-accent font-semibold">
                        {new Date(result.test_date).toLocaleDateString('ru-RU')}
                      </span>
                      <span className="text-lg font-bold text-white">
                        {result.distance_meters}м
                      </span>
                      {result.fitness_level && (
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          result.fitness_level === 'Отлично' ? 'bg-green-600 text-white' :
                          result.fitness_level === 'Хорошо' ? 'bg-blue-600 text-white' :
                          result.fitness_level === 'Удовлетворительно' ? 'bg-yellow-600 text-black' :
                          result.fitness_level === 'Слабо' ? 'bg-orange-600 text-white' :
                          'bg-red-600 text-white'
                        }`}>
                          {result.fitness_level}
                        </span>
                      )}
                    </div>
                    {result.notes && (
                      <p className="text-gray-300 text-sm">{result.notes}</p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(result)}
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    {isSuperAdmin && (
                      <Button
                        onClick={() => handleDelete(result.id)}
                        variant="outline"
                        size="sm"
                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};