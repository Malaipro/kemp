
import React, { useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Hero } from '@/components/Hero';
import { AboutUs } from '@/components/AboutUs';
import { Philosophy } from '@/components/Philosophy';
import { Program } from '@/components/Program';
import { Trainers } from '@/components/Trainers';
import { Leaderboard } from '@/components/Leaderboard';
import { Testimonials } from '@/components/Testimonials';
import { PhotoGallery } from '@/components/PhotoGallery';
import { ContactForm } from '@/components/ContactForm';

const Index = () => {
  useEffect(() => {
    // Set title in Russian
    document.title = 'КЭМП - Курс Эффективного Мужского Прогресса';
    
    // Add meta description for SEO and social networks
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
      <PhotoGallery />
      <Leaderboard />
      <Testimonials />
      <ContactForm />
    </Layout>
  );
};

export default Index;
