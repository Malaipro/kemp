import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Calendar, Users, Plus, Edit2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

interface Stream {
  id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string;
  is_active: boolean;
  is_current: boolean;
  participant_count?: number;
}

export const StreamManagement: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingStream, setEditingStream] = useState<Stream | null>(null);
  const [newStream, setNewStream] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: ''
  });

  const queryClient = useQueryClient();

  const { data: streams, isLoading } = useQuery({
    queryKey: ['intensive-streams'],
    queryFn: async (): Promise<Stream[]> => {
      // Get streams
      const { data: streamsData, error: streamsError } = await supabase
        .from('intensive_streams')
        .select('*')
        .order('start_date', { ascending: false });

      if (streamsError) throw streamsError;

      // Get participant counts for each stream
      const streamsWithCounts = await Promise.all(
        (streamsData || []).map(async (stream) => {
          const { count, error } = await supabase
            .from('участники')
            .select('*', { count: 'exact', head: true })
            .eq('stream_id', stream.id);

          if (error) console.error('Error counting participants:', error);

          return {
            ...stream,
            participant_count: count || 0
          };
        })
      );

      return streamsWithCounts;
    }
  });

  const createStreamMutation = useMutation({
    mutationFn: async (streamData: typeof newStream) => {
      const { data, error } = await supabase
        .from('intensive_streams')
        .insert([streamData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intensive-streams'] });
      setShowCreateForm(false);
      setNewStream({ name: '', description: '', start_date: '', end_date: '' });
      toast.success('Поток создан успешно');
    },
    onError: (error) => {
      toast.error('Ошибка создания потока: ' + error.message);
    }
  });

  const updateStreamMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Stream> }) => {
      const { data, error } = await supabase
        .from('intensive_streams')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intensive-streams'] });
      setEditingStream(null);
      toast.success('Поток обновлен успешно');
    },
    onError: (error) => {
      toast.error('Ошибка обновления потока: ' + error.message);
    }
  });

  const handleCreateStream = () => {
    if (!newStream.name || !newStream.start_date || !newStream.end_date) {
      toast.error('Заполните все обязательные поля');
      return;
    }
    createStreamMutation.mutate(newStream);
  };

  const handleToggleActive = (stream: Stream) => {
    updateStreamMutation.mutate({
      id: stream.id,
      updates: { is_active: !stream.is_active }
    });
  };

  const handleSetCurrent = (stream: Stream) => {
    // First set all streams as not current, then set selected as current
    const updates = streams?.map(s => ({ id: s.id, is_current: s.id === stream.id })) || [];
    
    Promise.all(
      updates.map(update => 
        supabase
          .from('intensive_streams')
          .update({ is_current: update.is_current })
          .eq('id', update.id)
      )
    ).then(() => {
      queryClient.invalidateQueries({ queryKey: ['intensive-streams'] });
      toast.success(`${stream.name} установлен как текущий поток`);
    }).catch(() => {
      toast.error('Ошибка установки текущего потока');
    });
  };

  const handleEditStream = (stream: Stream) => {
    setEditingStream({
      ...stream,
      start_date: stream.start_date.split('T')[0], // Convert to YYYY-MM-DD format
      end_date: stream.end_date.split('T')[0]
    });
  };

  const handleUpdateStream = () => {
    if (!editingStream || !editingStream.name || !editingStream.start_date || !editingStream.end_date) {
      toast.error('Заполните все обязательные поля');
      return;
    }
    
    updateStreamMutation.mutate({
      id: editingStream.id,
      updates: {
        name: editingStream.name,
        description: editingStream.description,
        start_date: editingStream.start_date,
        end_date: editingStream.end_date
      }
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kamp-accent mx-auto"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Управление потоками</h3>
          <p className="text-gray-400">Создавайте и управляйте интенсивными потоками</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-kamp-accent hover:bg-kamp-accent/90 text-black"
        >
          <Plus className="w-4 h-4 mr-2" />
          Создать поток
        </Button>
      </div>

      {/* Edit Form */}
      {editingStream && (
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Редактировать поток</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="edit-name" className="text-gray-300">Название потока</Label>
              <Input
                id="edit-name"
                value={editingStream.name}
                onChange={(e) => setEditingStream(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                placeholder="3-й поток"
                className="bg-white border-gray-300"
              />
            </div>
            <div>
              <Label htmlFor="edit-description" className="text-gray-300">Описание</Label>
              <Textarea
                id="edit-description"
                value={editingStream.description || ''}
                onChange={(e) => setEditingStream(prev => prev ? ({ ...prev, description: e.target.value }) : null)}
                placeholder="Описание интенсива"
                className="bg-white border-gray-300"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-start_date" className="text-gray-300">Дата начала</Label>
                <Input
                  id="edit-start_date"
                  type="date"
                  value={editingStream.start_date}
                  onChange={(e) => setEditingStream(prev => prev ? ({ ...prev, start_date: e.target.value }) : null)}
                  className="bg-white border-gray-300"
                />
              </div>
              <div>
                <Label htmlFor="edit-end_date" className="text-gray-300">Дата окончания</Label>
                <Input
                  id="edit-end_date"
                  type="date"
                  value={editingStream.end_date}
                  onChange={(e) => setEditingStream(prev => prev ? ({ ...prev, end_date: e.target.value }) : null)}
                  className="bg-white border-gray-300"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleUpdateStream}
                disabled={updateStreamMutation.isPending}
                className="bg-kamp-accent hover:bg-kamp-accent/90 text-black"
              >
                Сохранить
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setEditingStream(null)}
                className="border-gray-700"
              >
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Form */}
      {showCreateForm && (
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Создать новый поток</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-gray-300">Название потока</Label>
              <Input
                id="name"
                value={newStream.name}
                onChange={(e) => setNewStream(prev => ({ ...prev, name: e.target.value }))}
                placeholder="3-й поток"
                className="bg-white border-gray-300"
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-gray-300">Описание</Label>
              <Textarea
                id="description"
                value={newStream.description}
                onChange={(e) => setNewStream(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Описание интенсива"
                className="bg-white border-gray-300"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date" className="text-gray-300">Дата начала</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={newStream.start_date}
                  onChange={(e) => setNewStream(prev => ({ ...prev, start_date: e.target.value }))}
                  className="bg-white border-gray-300"
                />
              </div>
              <div>
                <Label htmlFor="end_date" className="text-gray-300">Дата окончания</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={newStream.end_date}
                  onChange={(e) => setNewStream(prev => ({ ...prev, end_date: e.target.value }))}
                  className="bg-white border-gray-300"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleCreateStream}
                disabled={createStreamMutation.isPending}
                className="bg-kamp-accent hover:bg-kamp-accent/90 text-black"
              >
                Создать
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowCreateForm(false)}
                className="border-gray-700"
              >
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Streams List */}
      <div className="grid gap-4">
        {streams?.map(stream => (
          <Card key={stream.id} className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold text-white">{stream.name}</h4>
                    {stream.is_current && (
                      <Badge className="bg-green-600 text-white">Текущий</Badge>
                    )}
                    {!stream.is_active && (
                      <Badge variant="secondary" className="bg-gray-600 text-gray-300">Скрыт</Badge>
                    )}
                  </div>
                  <p className="text-gray-400 mb-3">{stream.description}</p>
                  <div className="flex items-center gap-6 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(stream.start_date).toLocaleDateString('ru-RU')} - {new Date(stream.end_date).toLocaleDateString('ru-RU')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {stream.participant_count} участников
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditStream(stream)}
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`active-${stream.id}`} className="text-gray-300 text-sm">
                      {stream.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </Label>
                    <Switch
                      id={`active-${stream.id}`}
                      checked={stream.is_active}
                      onCheckedChange={() => handleToggleActive(stream)}
                    />
                  </div>
                  {!stream.is_current && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSetCurrent(stream)}
                      className="border-kamp-accent text-kamp-accent hover:bg-kamp-accent hover:text-black"
                    >
                      Сделать текущим
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};