import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
    {
        id: 1,
        name: "Sarah Chen",
        role: "Senior Engineer at Vercel",
        quote: "Intelsense has completely transformed our development workflow. The real-time collaboration features are a game changer.",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=128&h=128",
    },
    {
        id: 2,
        name: "Alex Rivera",
        role: "CTO at StartupX",
        quote: "The debugging tools are intuitive and powerful. I can't imagine building software without it anymore.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=128&h=128",
    },
    {
        id: 3,
        name: "Emily Zhang",
        role: "Frontend Lead",
        quote: "Finally, a tool that understands modern web development. The integration with Next.js is seamless.",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=128&h=128",
    },
    {
        id: 4,
        name: "David Kim",
        role: "Full Stack Developer",
        quote: "The performance metrics are incredibly detailed. It helped us optimize our app in record time.",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=128&h=128",
    },
    {
        id: 5,
        name: "Lisa Wang",
        role: "Product Manager",
        quote: "It bridges the gap between design and development perfectly. Our team velocity has doubled.",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128&h=128",
    },
    {
        id: 6,
        name: "James Wilson",
        role: "DevOps Engineer",
        quote: "Deployment has never been easier. One click and it's live. Absolutely love the automation features.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=128&h=128",
    },
];

const Testimonials = () => {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Love from developers</h2>
                    <p className="text-neutral-400 max-w-2xl mx-auto">
                        Join thousands of developers who are building the future with Intelsense.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card p-6 rounded-2xl hover:bg-white/5 transition-colors"
                        >
                            <p className="text-neutral-300 mb-6 leading-relaxed">"{testimonial.quote}"</p>
                            <div className="flex items-center gap-4">
                                <img
                                    src={testimonial.avatar}
                                    alt={testimonial.name}
                                    className="w-10 h-10 rounded-full object-cover border border-white/10"
                                />
                                <div>
                                    <h4 className="text-white font-medium text-sm">{testimonial.name}</h4>
                                    <p className="text-neutral-500 text-xs">{testimonial.role}</p>
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
