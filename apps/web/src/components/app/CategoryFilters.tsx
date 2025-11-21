import React from 'react';
import clsx from 'clsx';

interface CategoryFiltersProps {
    activeCategory: string;
    onSelectCategory: (category: string) => void;
}

const categories = [
    { id: 'all', label: 'All Updates' },
    { id: 'scholarships', label: 'Scholarships' },
    { id: 'exams', label: 'Exams' },
    { id: 'results', label: 'Results' },
    { id: 'admissions', label: 'Admissions' },
    { id: 'policy', label: 'Policy' },
];

const CategoryFilters = ({ activeCategory, onSelectCategory }: CategoryFiltersProps) => {
    return (
        <div className="flex overflow-x-auto pb-4 gap-3 scrollbar-hide">
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => onSelectCategory(category.id)}
                    className={clsx(
                        'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 border',
                        activeCategory === category.id
                            ? 'bg-accent-yellow text-bg-dark border-accent-yellow shadow-[0_0_15px_rgba(214,255,42,0.3)]'
                            : 'bg-white/5 text-neutral-400 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20'
                    )}
                >
                    {category.label}
                </button>
            ))}
        </div>
    );
};

export default CategoryFilters;
