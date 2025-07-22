import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface WebhookIntegrationProps {
  onWebhookUrlChange: (url: string) => void;
  webhookUrl: string;
}

export const WebhookIntegration: React.FC<WebhookIntegrationProps> = ({
  onWebhookUrlChange,
  webhookUrl,
}) => {
  const [showSettings, setShowSettings] = useState(false);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    onWebhookUrlChange(url);
    localStorage.setItem('clubWebhookUrl', url);
  };

  const testWebhook = async () => {
    if (!webhookUrl) {
      toast({
        title: "Ошибка",
        description: "Введите URL вебхука для тестирования",
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
          description: "Тестовые данные отправлены на вебхук",
        });
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Webhook test failed:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось отправить данные на вебхук",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-white">
          Интеграция с вебхуком
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
              Настройка вебхука
            </h4>
            <p className="text-sm text-white/70 mb-4">
              Укажите URL для отправки данных формы на ваш сервер или CRM систему.
            </p>
          </div>

          <div>
            <label htmlFor="webhook-url" className="block text-sm font-medium text-white mb-2">
              URL вебхука
            </label>
            <input
              id="webhook-url"
              type="url"
              value={webhookUrl}
              onChange={handleUrlChange}
              placeholder="https://your-server.com/webhook"
              className="w-full px-3 py-2 bg-black/40 border border-kamp-accent/30 rounded-md text-white placeholder:text-white/50 focus:border-kamp-accent focus:ring-1 focus:ring-kamp-accent focus:outline-none"
            />
          </div>

          {webhookUrl && (
            <button
              type="button"
              onClick={testWebhook}
              className="px-4 py-2 bg-kamp-accent/20 text-kamp-accent border border-kamp-accent/50 rounded-md hover:bg-kamp-accent/30 transition-colors"
            >
              Тестировать вебхук
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
          </div>
        </div>
      )}
    </div>
  );
};