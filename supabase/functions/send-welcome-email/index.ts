import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  name: string;
  confirmUrl?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log(`${req.method} request to send-welcome-email`);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }

  try {
    const { email, name, confirmUrl }: WelcomeEmailRequest = await req.json();
    console.log(`Sending welcome email to: ${email}`);

    if (!email || !name) {
      return new Response(
        JSON.stringify({ error: "Email and name are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Добро пожаловать в КЭМП!</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #0a0a0a; color: #ffffff;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="color: #00ff94; font-size: 32px; margin: 0; font-weight: bold;">КЭМП</h1>
              <p style="color: #888; margin: 8px 0 0 0; font-size: 16px;">Клуб Эффективного Мужского Прогресса</p>
            </div>

            <!-- Main Content -->
            <div style="background-color: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 32px; margin-bottom: 24px;">
              <h2 style="color: #00ff94; margin: 0 0 16px 0; font-size: 24px;">Добро пожаловать, ${name}!</h2>
              
              <p style="color: #cccccc; line-height: 1.6; margin: 16px 0;">
                Поздравляем с успешной регистрацией в системе КЭМП! Теперь у вас есть доступ к:
              </p>

              <ul style="color: #cccccc; line-height: 1.8; margin: 16px 0; padding-left: 20px;">
                <li><strong>Личному кабинету</strong> для отслеживания прогресса</li>
                <li><strong>Системе геймификации</strong> с закалами, гранями и шрамами</li>
                <li><strong>Трекеру аскез</strong> для личных вызовов</li>
                <li><strong>Таблице лидеров</strong> и достижениям</li>
              </ul>

              ${confirmUrl ? `
              <div style="text-align: center; margin: 32px 0;">
                <a href="${confirmUrl}" 
                   style="background-color: #00ff94; color: #000000; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  Подтвердить регистрацию
                </a>
              </div>
              ` : ''}

              <p style="color: #cccccc; line-height: 1.6; margin: 24px 0 0 0;">
                Начните свой путь к эффективному прогрессу уже сегодня!
              </p>
            </div>

            <!-- Instructions -->
            <div style="background-color: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 32px; margin-bottom: 24px;">
              <h3 style="color: #00ff94; margin: 0 0 16px 0; font-size: 20px;">Что делать дальше:</h3>
              
              <ol style="color: #cccccc; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li>Войдите в свой личный кабинет</li>
                <li>Изучите инструкцию по системе КЭМП</li>
                <li>Начните добавлять свои активности</li>
                <li>Создайте первую аскезу для получения тотема "Монах"</li>
                <li>Следите за прогрессом к тотемам</li>
              </ol>
            </div>

            <!-- Footer -->
            <div style="text-align: center; color: #666; font-size: 14px; line-height: 1.6;">
              <p>Если у вас есть вопросы, обратитесь к тренерам или кураторам клуба.</p>
              <p style="margin-top: 16px;">
                <strong>КЭМП</strong> - ваш путь к дисциплине и прогрессу
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "КЭМП <kemp.club@yandex.com>",
      to: [email],
      subject: "Добро пожаловать в КЭМП! 🏆",
      html: emailHtml,
      text: `Добро пожаловать в КЭМП, ${name}!

Поздравляем с успешной регистрацией в системе КЭМП!

Теперь у вас есть доступ к:
- Личному кабинету для отслеживания прогресса
- Системе геймификации с закалами, гранями и шрамами
- Трекеру аскез для личных вызовов
- Таблице лидеров и достижениям

${confirmUrl ? `Подтвердите регистрацию: ${confirmUrl}` : ''}

Что делать дальше:
1. Войдите в свой личный кабинет
2. Изучите инструкцию по системе КЭМП
3. Начните добавлять свои активности
4. Создайте первую аскезу для получения тотема "Монах"
5. Следите за прогрессом к тотемам

Если у вас есть вопросы, обратитесь к тренерам или кураторам клуба.

КЭМП - ваш путь к дисциплине и прогрессу`
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Welcome email sent successfully",
      emailId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to send welcome email",
        details: error.toString()
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);