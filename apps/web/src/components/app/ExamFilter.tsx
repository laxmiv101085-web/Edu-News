import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface ExamFilterProps {
    onFilterChange: (exam: string) => void;
    currentFilter: string;
}

const ExamFilter = ({ onFilterChange, currentFilter }: ExamFilterProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const examTypes = [
        { id: 'all', label: 'All Exams' },
        { id: 'jee', label: 'JEE' },
        { id: 'neet', label: 'NEET' },
        { id: 'upsc', label: 'UPSC' },
        { id: 'ssc', label: 'SSC' },
        { id: 'ibps', label: 'IBPS/Banking' },
        { id: 'railway', label: 'Railway' },
        { id: 'gate', label: 'GATE' },
        { id: 'cat', label: 'CAT' },
    ];

    const currentLabel = examTypes.find(e => e.id === currentFilter)?.label || 'All Exams';

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors"
            >
                <span className="text-sm font-medium">{currentLabel}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full mt-2 right-0 w-48 bg-bg-dark border border-white/10 rounded-xl overflow-hidden z-50 shadow-glass">
                        {examTypes.map((exam) => (
                            <button
                                key={exam.id}
                                onClick={() => {
                                    onFilterChange(exam.id);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-4 py-3 text-left text-sm transition-colors ${currentFilter === exam.id
                                    ? 'bg-accent-yellow/20 text-accent-yellow font-medium'
                                    : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                {exam.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ExamFilter;
