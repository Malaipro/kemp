
import React, { useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Hero } from '@/components/Hero';
import { AboutUs } from '@/components/AboutUs';
import { Program } from '@/components/Program';
import { Trainers } from '@/components/Trainers';
import { Leaderboard } from '@/components/Leaderboard';
import { Testimonials } from '@/components/Testimonials';
import { PhotoGallery } from '@/components/PhotoGallery';
import { ContactForm } from '@/components/ContactForm';

const Index = () => {
  useEffect(() => {
    document.title = 'КЭМП - Клуб Эффективного Мужского Прогресса';
    
    const metaDescription = document.createElement('meta');
    metaDescription.name = 'description';
    metaDescription.content = 'КЭМП — интенсив для тех, кто готов пройти испытания и стать сильнее. Физически. Ментально. Духовно.';
    document.head.appendChild(metaDescription);
    
    const viewportMeta = document.createElement('meta');
    viewportMeta.name = 'viewport';
    viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    document.head.appendChild(viewportMeta);
  }, []);

  return (
    <Layout>
      <Hero />
      <AboutUs />
      <Program />
      <Trainers />
      <PhotoGallery />
      <Leaderboard />
      <Testimonials />
      <ContactForm />
    </Layout>
  );
};

export default Index;
