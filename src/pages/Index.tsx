
import React, { useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Hero } from '@/components/Hero';
import { AboutUs } from '@/components/AboutUs';
import { Philosophy } from '@/components/Philosophy';
import { Program } from '@/components/Program';
import { Trainers } from '@/components/Trainers';
import { Testimonials } from '@/components/Testimonials';
import { Leaderboard } from '@/components/Leaderboard';
import { ContactForm } from '@/components/ContactForm';

const Index = () => {
  useEffect(() => {
    // Устанавливаем заголовок на русском языке
    document.title = 'КЭМП - Курс Эффективного Мужского Прогресса';
    
    // Добавляем мета-описание для SEO и социальных сетей
    const metaDescription = document.createElement('meta');
    metaDescription.name = 'description';
    metaDescription.content = 'КЭМП — интенсив для тех, кто готов пройти испытания и стать сильнее. Физически. Ментально. Духовно.';
    document.head.appendChild(metaDescription);
  }, []);

  return (
    <Layout>
      <Hero />
      <AboutUs />
      <Philosophy />
      <Program />
      <Trainers />
      <Testimonials />
      <Leaderboard />
      <ContactForm />
    </Layout>
  );
};

export default Index;
