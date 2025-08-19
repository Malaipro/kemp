
import React, { useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Hero } from '@/components/Hero';
import { AboutUs } from '@/components/AboutUs';
import { Program } from '@/components/Program';
import { Trainers } from '@/components/Trainers';
import { Leaderboard } from '@/components/Leaderboard';
import { RegisteredParticipants } from '@/components/participants';
import { Achievements } from '@/components/achievements';
import { Testimonials } from '@/components/Testimonials';
import { PhotoGallery } from '@/components/PhotoGallery';
import { ContactForm } from '@/components/ContactForm';

const Index = () => {
  useEffect(() => {
    // Set title in Russian
    document.title = 'КЭМП - Клуб Эффективного Мужского Прогресса';
    
    // Add meta description for SEO and social networks
    const metaDescription = document.createElement('meta');
    metaDescription.name = 'description';
    metaDescription.content = 'Вступай в клуб выносливости, дисциплины и лидерства. Тренировки по кикбоксингу, джиу-джитсу, выездные испытания, закаливание и реальные вызовы.';
    document.head.appendChild(metaDescription);
    
    // Add viewport meta tag for improved mobile experience
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
      <RegisteredParticipants />
      <Achievements />
      <Testimonials />
      <ContactForm />
    </Layout>
  );
};

export default Index;
