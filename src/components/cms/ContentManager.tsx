import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Save } from 'lucide-react';

// Типы для контента
interface PageContent {
  id: string;
  page_name: string;
  section_name: string;
  content_value: string;
  sort_order: number;
}

interface Trainer {
  id: string;
  name: string;
  role: string;
  image_url?: string;
  quote?: string;
  experience?: string;
  bio?: string;
  sort_order: number;
}

interface TrainingProgram {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  benefits?: string[];
  features?: string[];
  price_info?: string;
  sort_order: number;
}

interface GalleryImage {
  id: string;
  title?: string;
  image_url: string;
  description?: string;
  category: string;
  sort_order: number;
}

export const ContentManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('page-content');
  const queryClient = useQueryClient();

  // Загрузка данных
  const { data: pageContent = [] } = useQuery({
    queryKey: ['pageContent'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .order('sort_order');
      if (error) throw error;
      return data as PageContent[];
    },
  });

  const { data: trainers = [] } = useQuery({
    queryKey: ['trainers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trainers')
        .select('*')
        .order('sort_order');
      if (error) throw error;
      return data as Trainer[];
    },
  });

  const { data: programs = [] } = useQuery({
    queryKey: ['trainingPrograms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('training_programs')
        .select('*')
        .order('sort_order');
      if (error) throw error;
      return data as TrainingProgram[];
    },
  });

  const { data: gallery = [] } = useQuery({
    queryKey: ['galleryImages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('sort_order');
      if (error) throw error;
      return data as GalleryImage[];
    },
  });

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Управление контентом</h1>
        <p className="text-gray-400">Редактируйте весь контент сайта прямо здесь</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="page-content">Контент страниц</TabsTrigger>
          <TabsTrigger value="trainers">Тренеры</TabsTrigger>
          <TabsTrigger value="programs">Программы</TabsTrigger>
          <TabsTrigger value="gallery">Галерея</TabsTrigger>
        </TabsList>

        <TabsContent value="page-content">
          <PageContentManager content={pageContent} />
        </TabsContent>

        <TabsContent value="trainers">
          <TrainersManager trainers={trainers} />
        </TabsContent>

        <TabsContent value="programs">
          <ProgramsManager programs={programs} />
        </TabsContent>

        <TabsContent value="gallery">
          <GalleryManager images={gallery} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Компонент для управления контентом страниц
const PageContentManager: React.FC<{ content: PageContent[] }> = ({ content }) => {
  const [editingItem, setEditingItem] = useState<PageContent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (item: PageContent) => {
      const { data, error } = await supabase
        .from('page_content')
        .upsert(item)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pageContent'] });
      setIsDialogOpen(false);
      setEditingItem(null);
      toast.success('Контент обновлен');
    },
    onError: (error) => {
      toast.error('Ошибка обновления: ' + error.message);
    },
  });

  const handleEdit = (item: PageContent) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleSave = (formData: FormData) => {
    const updatedItem = {
      ...editingItem,
      content_value: formData.get('content_value') as string,
    };
    updateMutation.mutate(updatedItem);
  };

  const groupedContent = content.reduce((acc, item) => {
    if (!acc[item.page_name]) acc[item.page_name] = [];
    acc[item.page_name].push(item);
    return acc;
  }, {} as Record<string, PageContent[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedContent).map(([pageName, items]) => (
        <Card key={pageName} className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white capitalize">{pageName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-white">{item.section_name}</h4>
                  <p className="text-gray-300 text-sm truncate max-w-md">{item.content_value}</p>
                </div>
                <Button
                  onClick={() => handleEdit(item)}
                  variant="outline"
                  size="sm"
                  className="text-white border-gray-600"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Редактировать контент</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSave(new FormData(e.currentTarget));
            }} className="space-y-4">
              <div>
                <Label>Содержимое</Label>
                <Textarea
                  name="content_value"
                  defaultValue={editingItem.content_value}
                  className="bg-white text-black"
                  rows={6}
                />
              </div>
              <Button type="submit" className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Сохранить
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Компонент для управления тренерами
const TrainersManager: React.FC<{ trainers: Trainer[] }> = ({ trainers }) => {
  const [editingItem, setEditingItem] = useState<Trainer | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (item: Partial<Trainer> & { name: string; role: string }) => {
      const { data, error } = await supabase
        .from('trainers')
        .upsert(item)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
      setIsDialogOpen(false);
      setEditingItem(null);
      setIsCreating(false);
      toast.success('Тренер обновлен');
    },
    onError: (error) => {
      toast.error('Ошибка обновления: ' + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('trainers')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
      toast.success('Тренер удален');
    },
    onError: (error) => {
      toast.error('Ошибка удаления: ' + error.message);
    },
  });

  const handleCreate = () => {
    setEditingItem({
      id: '',
      name: '',
      role: '',
      image_url: '',
      quote: '',
      experience: '',
      bio: '',
      sort_order: trainers.length + 1,
    });
    setIsCreating(true);
    setIsDialogOpen(true);
  };

  const handleEdit = (item: Trainer) => {
    setEditingItem(item);
    setIsCreating(false);
    setIsDialogOpen(true);
  };

  const handleSave = (formData: FormData) => {
    const name = formData.get('name') as string;
    const role = formData.get('role') as string;
    
    if (!name || !role) {
      toast.error('Имя и роль обязательны');
      return;
    }
    
    const updatedItem = {
      ...editingItem,
      name,
      role,
      image_url: formData.get('image_url') as string,
      quote: formData.get('quote') as string,
      experience: formData.get('experience') as string,
      bio: formData.get('bio') as string,
    };
    
    if (isCreating) {
      delete updatedItem.id;
    }
    
    updateMutation.mutate(updatedItem);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Управление тренерами</h2>
        <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Добавить тренера
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainers.map((trainer) => (
          <Card key={trainer.id} className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              {trainer.image_url && (
                <img
                  src={trainer.image_url}
                  alt={trainer.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="text-lg font-bold text-white mb-2">{trainer.name}</h3>
              <p className="text-blue-400 text-sm mb-2">{trainer.role}</p>
              <p className="text-gray-300 text-sm mb-4 line-clamp-3">{trainer.bio}</p>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleEdit(trainer)}
                  variant="outline"
                  size="sm"
                  className="flex-1 text-white border-gray-600"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Изменить
                </Button>
                <Button
                  onClick={() => deleteMutation.mutate(trainer.id)}
                  variant="destructive"
                  size="sm"
                  className="px-3"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isCreating ? 'Добавить тренера' : 'Редактировать тренера'}</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSave(new FormData(e.currentTarget));
            }} className="space-y-4">
              <div>
                <Label>Имя</Label>
                <Input
                  name="name"
                  defaultValue={editingItem.name}
                  className="bg-white text-black"
                  required
                />
              </div>
              <div>
                <Label>Роль</Label>
                <Input
                  name="role"
                  defaultValue={editingItem.role}
                  className="bg-white text-black"
                  required
                />
              </div>
              <div>
                <Label>URL изображения</Label>
                <Input
                  name="image_url"
                  defaultValue={editingItem.image_url}
                  className="bg-white text-black"
                />
              </div>
              <div>
                <Label>Цитата</Label>
                <Input
                  name="quote"
                  defaultValue={editingItem.quote}
                  className="bg-white text-black"
                />
              </div>
              <div>
                <Label>Опыт</Label>
                <Textarea
                  name="experience"
                  defaultValue={editingItem.experience}
                  className="bg-white text-black"
                  rows={3}
                />
              </div>
              <div>
                <Label>Биография</Label>
                <Textarea
                  name="bio"
                  defaultValue={editingItem.bio}
                  className="bg-white text-black"
                  rows={4}
                />
              </div>
              <Button type="submit" className="w-full">
                <Save className="w-4 h-4 mr-2" />
                {isCreating ? 'Создать' : 'Сохранить'}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Компонент для управления программами (упрощенная версия)
const ProgramsManager: React.FC<{ programs: TrainingProgram[] }> = ({ programs }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Управление программами тренировок</h2>
      <p className="text-gray-400">Функционал в разработке...</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program) => (
          <Card key={program.id} className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-white mb-2">{program.title}</h3>
              <p className="text-gray-300 text-sm">{program.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Компонент для управления галереей (упрощенная версия)
const GalleryManager: React.FC<{ images: GalleryImage[] }> = ({ images }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Управление галереей</h2>
      <p className="text-gray-400">Функционал в разработке...</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <Card key={image.id} className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <img
                src={image.image_url}
                alt={image.title}
                className="w-full h-32 object-cover rounded-lg mb-2"
              />
              <p className="text-white text-sm">{image.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};