import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useRole } from '@/hooks/useRole';
import { useAuth } from '@/hooks/useAuth';
import { Activity, Clock, User, Plus, Edit2, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';

interface CooperTestResult {
  id: string;
  participant_id: string;
  test_date: string;
  distance_meters: number;
  time_minutes: number;
  completion_time_seconds: number | null;
  fitness_level: string | null;
  notes: string | null;
  test_number: number;
  participant?: {
    name: string;
    last_name: string | null;
  };
}

interface Participant {
  id: string;
  name: string;
  last_name: string | null;
}

export const CooperTestManagement: React.FC = () => {
  const { user } = useAuth();
  const { isSuperAdmin } = useRole();
  const queryClient = useQueryClient();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingResult, setEditingResult] = useState<CooperTestResult | null>(null);
  const [selectedParticipantId, setSelectedParticipantId] = useState<string>('');
  const [testNumber, setTestNumber] = useState<number>(1);
  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);
  const [completionTimeSeconds, setCompletionTimeSeconds] = useState<number>(180); // 3 minutes in seconds
  const [notes, setNotes] = useState('');

  // Get current user's participant data
  const { data: currentParticipant } = useQuery({
    queryKey: ['current-participant-cooper'],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('участники')
        .select('id, name, last_name')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user && !isSuperAdmin
  });

  // Get all participants (admin only)
  const { data: allParticipants } = useQuery({
    queryKey: ['all-participants-cooper'],
    queryFn: async () => {
      // Get current stream
      const { data: currentStream } = await supabase
        .from('intensive_streams')
        .select('id')
        .eq('is_current', true)
        .maybeSingle();

      if (!currentStream) return [];

      const { data, error } = await supabase
        .from('участники')
        .select('id, name, last_name')
        .eq('stream_id', currentStream.id)
        .order('name');

      if (error) throw error;
      return data;
    },
    enabled: isSuperAdmin
  });

  // Get test results
  const { data: testResults, isLoading } = useQuery({
    queryKey: ['cooper-test-results', isSuperAdmin],
    queryFn: async () => {
      // Get test results
      let query = supabase
        .from('cooper_test_results')
        .select('*')
        .order('test_date', { ascending: false });

      if (!isSuperAdmin && currentParticipant) {
        query = query.eq('participant_id', currentParticipant.id);
      }

      const { data: results, error } = await query;
      if (error) throw error;

      // If admin, also get participant info
      if (isSuperAdmin && results?.length) {
        const participantIds = [...new Set(results.map(r => r.participant_id))];
        const { data: participants, error: participantsError } = await supabase
          .from('участники')
          .select('id, name, last_name')
          .in('id', participantIds);

        if (participantsError) throw participantsError;

        const participantMap = new Map(participants?.map(p => [p.id, p]) || []);
        
        return results.map(result => ({
          ...result,
          participant: participantMap.get(result.participant_id) || null
        }));
      }

      return results.map(result => ({ ...result, participant: null }));
    },
    enabled: isSuperAdmin || !!currentParticipant
  });

  const calculateFitnessLevel = (timeSeconds: number) => {
    // Основано на времени прохождения 4 кругов в зале (чем меньше время, тем лучше)
    if (timeSeconds <= 180) return 'Отлично'; // 3 минуты или меньше
    if (timeSeconds <= 240) return 'Хорошо';  // до 4 минут
    if (timeSeconds <= 300) return 'Нормально'; // до 5 минут
    if (timeSeconds <= 360) return 'Удовлетворительно'; // до 6 минут
    if (timeSeconds <= 420) return 'Слабо'; // до 7 минут
    if (timeSeconds <= 480) return 'Очень слабо'; // до 8 минут
    return 'Критично'; // больше 8 минут
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const addTestMutation = useMutation({
    mutationFn: async (testData: any) => {
      const { error } = await supabase
        .from('cooper_test_results')
        .insert([testData]);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Результат теста добавлен');
      queryClient.invalidateQueries({ queryKey: ['cooper-test-results'] });
      resetForm();
    },
    onError: (error: any) => {
      toast.error('Ошибка: ' + error.message);
    }
  });

  const updateTestMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase
        .from('cooper_test_results')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Результат теста обновлен');
      queryClient.invalidateQueries({ queryKey: ['cooper-test-results'] });
      resetForm();
    },
    onError: (error: any) => {
      toast.error('Ошибка: ' + error.message);
    }
  });

  const deleteTestMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('cooper_test_results')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Результат теста удален');
      queryClient.invalidateQueries({ queryKey: ['cooper-test-results'] });
    },
    onError: (error: any) => {
      toast.error('Ошибка: ' + error.message);
    }
  });

  const resetForm = () => {
    setShowAddForm(false);
    setEditingResult(null);
    setSelectedParticipantId('');
    setTestNumber(1);
    setTestDate(new Date().toISOString().split('T')[0]);
    setCompletionTimeSeconds(180);
    setNotes('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const participantId = isSuperAdmin ? selectedParticipantId : currentParticipant?.id;
    
    if (!participantId) {
      toast.error('Выберите участника');
      return;
    }

    const testData = {
      participant_id: participantId,
      test_number: testNumber,
      test_date: testDate,
      completion_time_seconds: completionTimeSeconds,
      fitness_level: calculateFitnessLevel(completionTimeSeconds),
      notes: notes || null
    };

    if (editingResult) {
      updateTestMutation.mutate({ id: editingResult.id, updates: testData });
    } else {
      addTestMutation.mutate(testData);
    }
  };

  const handleEdit = (result: CooperTestResult) => {
    setEditingResult(result);
    setSelectedParticipantId(result.participant_id);
    setTestNumber(result.test_number);
    setTestDate(result.test_date);
    setCompletionTimeSeconds(result.completion_time_seconds || 180);
    setNotes(result.notes || '');
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот результат?')) {
      deleteTestMutation.mutate(id);
    }
  };

  // Group results by test number and participant for comparison
  const test1Results = testResults?.filter(r => r.test_number === 1) || [];
  const test2Results = testResults?.filter(r => r.test_number === 2) || [];

  // Create comparison data
  const comparisonData = () => {
    if (!isSuperAdmin && currentParticipant) {
      const test1 = test1Results.find(r => r.participant_id === currentParticipant.id);
      const test2 = test2Results.find(r => r.participant_id === currentParticipant.id);
      
      if (test1 && test2) {
        return [{
          participant: { name: currentParticipant.name, last_name: currentParticipant.last_name },
          test1: test1,
          test2: test2,
          improvement: test1.completion_time_seconds && test2.completion_time_seconds 
            ? test1.completion_time_seconds - test2.completion_time_seconds 
            : null
        }];
      }
      return [];
    }

    // For admin - group by participant
    const participantMap = new Map();
    
    test1Results.forEach(result => {
      if (!participantMap.has(result.participant_id)) {
        participantMap.set(result.participant_id, { 
          participant: result.participant,
          test1: result,
          test2: null,
          improvement: null
        });
      }
    });

    test2Results.forEach(result => {
      const existing = participantMap.get(result.participant_id);
      if (existing) {
        existing.test2 = result;
        if (existing.test1?.completion_time_seconds && result.completion_time_seconds) {
          existing.improvement = existing.test1.completion_time_seconds - result.completion_time_seconds;
        }
      } else {
        participantMap.set(result.participant_id, {
          participant: result.participant,
          test1: null,
          test2: result,
          improvement: null
        });
      }
    });

    return Array.from(participantMap.values()).filter(item => item.test1 && item.test2);
  };

  if (isLoading) {
    return (
      <Card className="bg-white border-gray-300">
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kamp-accent mx-auto"></div>
          <p className="text-gray-600 mt-2">Загрузка результатов...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="w-6 h-6 text-kamp-accent" />
            Тест Купера
          </h2>
          <p className="text-gray-600">
            {isSuperAdmin ? 'Управление результатами всех участников (4 круга в зале)' : 'Ваши результаты тестов (4 круга в зале)'}
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-kamp-accent hover:bg-kamp-accent/90 text-black"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить результат
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card className="bg-white border-gray-300">
          <CardHeader>
            <CardTitle className="text-gray-900">
              {editingResult ? 'Редактировать результат' : 'Добавить новый результат'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Participant Selection (Admin only) */}
              {isSuperAdmin && (
                <div>
                  <Label className="text-gray-700">Участник *</Label>
                  <Select value={selectedParticipantId} onValueChange={setSelectedParticipantId}>
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue placeholder="Выберите участника" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-300 z-50">
                      {allParticipants?.map((participant) => (
                        <SelectItem key={participant.id} value={participant.id}>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {participant.name} {participant.last_name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {/* Test Number */}
                <div>
                  <Label className="text-gray-700">Номер теста *</Label>
                  <Select value={testNumber.toString()} onValueChange={(value) => setTestNumber(parseInt(value))}>
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-300 z-50">
                      <SelectItem value="1">Тест 1</SelectItem>
                      <SelectItem value="2">Тест 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Test Date */}
                <div>
                  <Label className="text-gray-700">Дата теста *</Label>
                  <Input
                    type="date"
                    value={testDate}
                    onChange={(e) => setTestDate(e.target.value)}
                    className="bg-white border-gray-300"
                  />
                </div>
              </div>

              {/* Completion Time */}
              <div>
                <Label className="text-gray-700">Время выполнения (секунды) *</Label>
                <div>
                  <Input
                    type="number"
                    value={completionTimeSeconds}
                    onChange={(e) => setCompletionTimeSeconds(parseInt(e.target.value) || 0)}
                    min="0"
                    className="bg-white border-gray-300"
                    placeholder="180"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Текущее значение: {formatTime(completionTimeSeconds)}
                  </p>
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label className="text-gray-700">Заметки</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Дополнительные заметки о тесте"
                  className="bg-white border-gray-300"
                />
              </div>

              {/* Fitness Level Preview */}
              <div className="p-3 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-700">
                  Уровень подготовки: 
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
                    calculateFitnessLevel(completionTimeSeconds) === 'Отлично' ? 'bg-green-600 text-white' :
                    calculateFitnessLevel(completionTimeSeconds) === 'Хорошо' ? 'bg-blue-600 text-white' :
                    calculateFitnessLevel(completionTimeSeconds) === 'Нормально' ? 'bg-yellow-600 text-black' :
                    calculateFitnessLevel(completionTimeSeconds) === 'Удовлетворительно' ? 'bg-orange-600 text-white' :
                    calculateFitnessLevel(completionTimeSeconds) === 'Слабо' ? 'bg-red-600 text-white' :
                    calculateFitnessLevel(completionTimeSeconds) === 'Очень слабо' ? 'bg-red-700 text-white' :
                    'bg-red-900 text-white'
                  }`}>
                    {calculateFitnessLevel(completionTimeSeconds)}
                  </span>
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={addTestMutation.isPending || updateTestMutation.isPending}
                  className="bg-kamp-accent hover:bg-kamp-accent/90 text-black"
                >
                  {editingResult ? 'Обновить' : 'Добавить'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} className="border-gray-300">
                  Отмена
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      <Tabs defaultValue="test1" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100">
          <TabsTrigger value="test1" className="flex items-center gap-2 data-[state=active]:bg-white">
            <Activity className="w-4 h-4" />
            Тест 1 ({test1Results.length})
          </TabsTrigger>
          <TabsTrigger value="test2" className="flex items-center gap-2 data-[state=active]:bg-white">
            <Activity className="w-4 h-4" />
            Тест 2 ({test2Results.length})
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-2 data-[state=active]:bg-white">
            <TrendingUp className="w-4 h-4" />
            Сравнение ({comparisonData().length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="test1" className="space-y-4">
          {test1Results.length === 0 ? (
            <Card className="bg-gray-50 border-gray-300">
              <CardContent className="p-6 text-center">
                <p className="text-gray-600">Нет результатов для теста 1</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {test1Results.map(result => (
                <Card key={result.id} className="bg-gray-50 border-gray-300">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2 flex-wrap">
                          {isSuperAdmin && result.participant && (
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-600" />
                              <span className="font-semibold text-gray-900">
                                {result.participant.name} {result.participant.last_name}
                              </span>
                            </div>
                          )}
                          <span className="text-kamp-accent font-semibold">
                            {new Date(result.test_date).toLocaleDateString('ru-RU')}
                          </span>
                          <Badge variant="secondary" className="bg-blue-600 text-white">
                            Тест 1
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 mb-2 flex-wrap">
                          {result.completion_time_seconds && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-gray-600" />
                              <span className="text-lg font-bold text-gray-900">{formatTime(result.completion_time_seconds)}</span>
                            </div>
                          )}
                          {result.fitness_level && (
                            <Badge className={
                              result.fitness_level === 'Отлично' ? 'bg-green-600' :
                              result.fitness_level === 'Хорошо' ? 'bg-blue-600' :
                              result.fitness_level === 'Нормально' ? 'bg-yellow-600' :
                              result.fitness_level === 'Удовлетворительно' ? 'bg-orange-600' :
                              result.fitness_level === 'Слабо' ? 'bg-red-600' :
                              result.fitness_level === 'Очень слабо' ? 'bg-red-700' :
                              'bg-red-900'
                            }>
                              {result.fitness_level}
                            </Badge>
                          )}
                        </div>
                        
                        {result.notes && (
                          <p className="text-gray-600 text-sm">{result.notes}</p>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline" 
                          onClick={() => handleEdit(result)}
                          className="border-gray-400"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        {isSuperAdmin && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(result.id)}
                            className="border-red-400 text-red-600 hover:bg-red-600 hover:text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="test2" className="space-y-4">
          {test2Results.length === 0 ? (
            <Card className="bg-gray-50 border-gray-300">
              <CardContent className="p-6 text-center">
                <p className="text-gray-600">Нет результатов для теста 2</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {test2Results.map(result => (
                <Card key={result.id} className="bg-gray-50 border-gray-300">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2 flex-wrap">
                          {isSuperAdmin && result.participant && (
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-600" />
                              <span className="font-semibold text-gray-900">
                                {result.participant.name} {result.participant.last_name}
                              </span>
                            </div>
                          )}
                          <span className="text-kamp-accent font-semibold">
                            {new Date(result.test_date).toLocaleDateString('ru-RU')}
                          </span>
                          <Badge variant="secondary" className="bg-purple-600 text-white">
                            Тест 2
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 mb-2 flex-wrap">
                          {result.completion_time_seconds && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-gray-600" />
                              <span className="text-lg font-bold text-gray-900">{formatTime(result.completion_time_seconds)}</span>
                            </div>
                          )}
                          {result.fitness_level && (
                            <Badge className={
                              result.fitness_level === 'Отлично' ? 'bg-green-600' :
                              result.fitness_level === 'Хорошо' ? 'bg-blue-600' :
                              result.fitness_level === 'Нормально' ? 'bg-yellow-600' :
                              result.fitness_level === 'Удовлетворительно' ? 'bg-orange-600' :
                              result.fitness_level === 'Слабо' ? 'bg-red-600' :
                              result.fitness_level === 'Очень слабо' ? 'bg-red-700' :
                              'bg-red-900'
                            }>
                              {result.fitness_level}
                            </Badge>
                          )}
                        </div>
                        
                        {result.notes && (
                          <p className="text-gray-600 text-sm">{result.notes}</p>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(result)}
                          className="border-gray-400"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        {isSuperAdmin && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(result.id)}
                            className="border-red-400 text-red-600 hover:bg-red-600 hover:text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          {comparisonData().length === 0 ? (
            <Card className="bg-gray-50 border-gray-300">
              <CardContent className="p-6 text-center">
                <p className="text-gray-600">Нет данных для сравнения (нужны результаты обоих тестов)</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {comparisonData().map((comparison, index) => (
                <Card key={index} className="bg-gray-50 border-gray-300">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {/* Participant Info */}
                      {comparison.participant && (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-600" />
                          <span className="font-semibold text-gray-900">
                            {comparison.participant.name} {comparison.participant.last_name}
                          </span>
                        </div>
                      )}

                      {/* Test Results Comparison */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Test 1 */}
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-blue-600 text-white">Тест 1</Badge>
                            <span className="text-sm text-gray-600">
                              {new Date(comparison.test1.test_date).toLocaleDateString('ru-RU')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-600" />
                            <span className="font-bold text-gray-900">
                              {formatTime(comparison.test1.completion_time_seconds || 0)}
                            </span>
                            <Badge className={
                              comparison.test1.fitness_level === 'Отлично' ? 'bg-green-600' :
                              comparison.test1.fitness_level === 'Хорошо' ? 'bg-blue-600' :
                              comparison.test1.fitness_level === 'Нормально' ? 'bg-yellow-600' :
                              comparison.test1.fitness_level === 'Удовлетворительно' ? 'bg-orange-600' :
                              'bg-red-600'
                            }>
                              {comparison.test1.fitness_level}
                            </Badge>
                          </div>
                        </div>

                        {/* Test 2 */}
                        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-purple-600 text-white">Тест 2</Badge>
                            <span className="text-sm text-gray-600">
                              {new Date(comparison.test2.test_date).toLocaleDateString('ru-RU')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-600" />
                            <span className="font-bold text-gray-900">
                              {formatTime(comparison.test2.completion_time_seconds || 0)}
                            </span>
                            <Badge className={
                              comparison.test2.fitness_level === 'Отлично' ? 'bg-green-600' :
                              comparison.test2.fitness_level === 'Хорошо' ? 'bg-blue-600' :
                              comparison.test2.fitness_level === 'Нормально' ? 'bg-yellow-600' :
                              comparison.test2.fitness_level === 'Удовлетворительно' ? 'bg-orange-600' :
                              'bg-red-600'
                            }>
                              {comparison.test2.fitness_level}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Improvement Analysis */}
                      {comparison.improvement !== null && (
                        <div className={`p-3 rounded-lg border ${
                          comparison.improvement > 0 
                            ? 'bg-green-50 border-green-200' 
                            : comparison.improvement < 0 
                            ? 'bg-red-50 border-red-200'
                            : 'bg-gray-50 border-gray-200'
                        }`}>
                          <div className="flex items-center gap-2">
                            {comparison.improvement > 0 ? (
                              <TrendingUp className="w-4 h-4 text-green-600" />
                            ) : comparison.improvement < 0 ? (
                              <TrendingDown className="w-4 h-4 text-red-600" />
                            ) : (
                              <Clock className="w-4 h-4 text-gray-600" />
                            )}
                            <span className="font-semibold">
                              {comparison.improvement > 0 
                                ? 'Улучшение: ' 
                                : comparison.improvement < 0 
                                ? 'Ухудшение: ' 
                                : 'Без изменений'}
                            </span>
                            {comparison.improvement !== 0 && (
                              <span className={`font-bold ${
                                comparison.improvement > 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {formatTime(Math.abs(comparison.improvement))}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};