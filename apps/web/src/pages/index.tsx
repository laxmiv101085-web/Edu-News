import React from 'react';
import Layout from '../components/Layout';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import Highlight from '../components/landing/Highlight';


export default function Home() {
  return (
    <Layout
      title="EduNews - Stay Ahead of Every Opportunity"
      description="Your one-stop platform for real-time education news, exam results, scholarships, and admission updates in India."
      keywords="education news, india education, scholarships, exam results, cbse, neet, jee, admissions, university news"
    >
      <Hero />
      <Features />
      <Highlight />

    </Layout>
  );
}
