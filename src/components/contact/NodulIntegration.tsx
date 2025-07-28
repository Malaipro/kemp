import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface NodulIntegrationProps {
  onWebhookUrlChange: (url: string) => void;
  webhookUrl: string;
}

export const NodulIntegration: React.FC<NodulIntegrationProps> = ({
  onWebhookUrlChange,
  webhookUrl,
}) => {
  const [showSettings, setShowSettings] = useState(false);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    onWebhookUrlChange(url);
    localStorage.setItem('clubNodulWebhookUrl', url);
  };

  const testWebhook = async () => {
    if (!webhookUrl) {
      toast({
        title: "Ошибка",
        description: "Введите URL сценария Nodul для тестирования",
        variant: "destructive",
      });
      return;
    }

    try {
      const testData = {
        name: "Тест Тестович",
        phone: "+7 (999) 123-45-67",
        social: "@test_user",
        course: "male",
        source: "КЭМП - Клуб Эффективного Мужского Прогресса",
        timestamp: new Date().toISOString(),
        test: true
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      if (response.ok) {
        toast({
          title: "Успешно!",
          description: "Тестовые данные отправлены в Nodul",
        });
      } else {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error('Nodul webhook test failed:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось отправить данные в Nodul. Проверьте URL и статус сценария.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-white">
          Интеграция с Nodul
        </label>
        <button
          type="button"
          onClick={() => setShowSettings(!showSettings)}
          className="text-kamp-accent hover:text-kamp-accent/80 text-sm"
        >
          {showSettings ? 'Скрыть' : 'Настроить'}
        </button>
      </div>

      {showSettings && (
        <div className="space-y-4 p-4 bg-black/20 rounded-lg border border-kamp-accent/20">
          <div>
            <h4 className="text-lg font-semibold text-white mb-2">
              Настройка интеграции с Nodul
            </h4>
            <p className="text-sm text-white/70 mb-4">
              Укажите URL сценария из вашего аккаунта Nodul для автоматической обработки заявок.
            </p>
          </div>

          <div>
            <label htmlFor="nodul-webhook-url" className="block text-sm font-medium text-white mb-2">
              URL сценария Nodul
            </label>
            <input
              id="nodul-webhook-url"
              type="url"
              value={webhookUrl}
              onChange={handleUrlChange}
              placeholder="https://webhook.nodul.ru/xxxx/prod/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              className="w-full px-3 py-2 bg-black/40 border border-kamp-accent/30 rounded-md text-white placeholder:text-white/50 focus:border-kamp-accent focus:ring-1 focus:ring-kamp-accent focus:outline-none"
            />
          </div>

          {webhookUrl && (
            <button
              type="button"
              onClick={testWebhook}
              className="px-4 py-2 bg-kamp-accent/20 text-kamp-accent border border-kamp-accent/50 rounded-md hover:bg-kamp-accent/30 transition-colors"
            >
              Тестировать интеграцию
            </button>
          )}

          <div className="text-xs text-white/60">
            <p><strong>Формат данных:</strong></p>
            <pre className="mt-2 p-2 bg-black/60 rounded text-xs overflow-x-auto">
{`{
  "name": "Имя участника",
  "phone": "+7 (999) 123-45-67", 
  "social": "@username",
  "course": "male",
  "source": "КЭМП - Клуб...",
  "timestamp": "2024-01-01T12:00:00Z"
}`}
            </pre>
            <p className="mt-2">
              <strong>Инструкция:</strong> В Nodul создайте новый сценарий с триггером "Webhook" и скопируйте URL.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};