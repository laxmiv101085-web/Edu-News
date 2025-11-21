import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
    {
        name: 'Priya Verma',
        role: 'NEET Aspirant',
        quote: 'I never miss a scholarship deadline now. This app is a lifesaver for students.',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'
    },
    {
        name: 'Rahul Sharma',
        role: 'Engineering Student',
        quote: 'The exam alerts are faster than official websites. Highly recommended!',
        image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80'
    },
    {
        name: 'Anjali Gupta',
        role: 'UPSC Aspirant',
        quote: 'Finally, an app that filters out the noise and gives me exactly what I need.',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80'
    },
    {
        name: 'Vikram Singh',
        role: 'Class 12 Student',
        quote: 'Got my admission updates instantly. The UI is so clean and easy to use.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'
    },
    {
        name: 'Sneha Patel',
        role: 'Medical Student',
        quote: 'Best platform for scholarship tracking. I applied to 3 schemes I didn\'t know about.',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
    },
    {
        name: 'Arjun Kumar',
        role: 'GATE Aspirant',
        quote: 'The dark mode is perfect for late night study sessions. Love the design!',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80'
    }
];

const Testimonials = () => {
    return (
        <section className="py-24 bg-bg-dark relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-white mb-4">Loved by Students Across India</h2>
                    <p className="text-neutral-400 max-w-2xl mx-auto">
                        Join thousands of students who trust us for their educational journey.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all"
                        >
                            <Quote className="w-8 h-8 text-accent-yellow/20 mb-4" />
                            <p className="text-neutral-300 mb-6 leading-relaxed">"{testimonial.quote}"</p>
                            <div className="flex items-center gap-4">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-10 h-10 rounded-full object-cover ring-2 ring-bg-dark"
                                />
                                <div>
                                    <h4 className="text-white font-bold text-sm">{testimonial.name}</h4>
                                    <p className="text-accent-cyan text-xs">{testimonial.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
