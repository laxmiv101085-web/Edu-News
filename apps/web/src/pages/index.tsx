import React from 'react';
import Layout from '../components/Layout';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import Highlight from '../components/landing/Highlight';
import CTA from '../components/landing/CTA';

export default function Home() {
  return (
    <Layout title="EduNews - Stay Ahead of Every Opportunity">
      <Hero />
      <Features />
      <Highlight />
      <CTA />
    </Layout>
  );
}
