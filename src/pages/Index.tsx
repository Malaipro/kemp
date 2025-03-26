
import React, { useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Hero } from '@/components/Hero';
import { AboutUs } from '@/components/AboutUs';
import { Philosophy } from '@/components/Philosophy';
import { Program } from '@/components/Program';
import { Trainers } from '@/components/Trainers';
import { Leaderboard } from '@/components/Leaderboard';
import { ContactForm } from '@/components/ContactForm';

const Index = () => {
  useEffect(() => {
    // Set the document title
    document.title = 'КЭМП - Курс Эффективного Мужского Прогресса';
  }, []);

  return (
    <Layout>
      <Hero />
      <AboutUs />
      <Philosophy />
      <Program />
      <Trainers />
      <Leaderboard />
      <ContactForm />
    </Layout>
  );
};

export default Index;
