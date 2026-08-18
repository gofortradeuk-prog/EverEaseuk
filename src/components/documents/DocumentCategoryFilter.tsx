import React from 'react';
import {
  FileText,
  Shield,
  Heart,
  Scale,
  Car,
  Home,
  Layers,
  Sparkles,
} from 'lucide-react';
import { DocumentCategoryType } from '../../types';

interface Props {
  selectedCategory: string; // 'all' or DocumentCategoryType
  onSelectCategory: (cat: string) => void;
  counts: Record<string, number>;
}

const CATEGORIES: { id: string; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'all', label: 'All Documents', icon: Layers },
  { id: 'home_insurance', label: 'Home & Insurance', icon: Home },
  { id: 'identity_passport', label: 'Identity & Passport', icon: Shield },
  { id: 'health_medical', label: 'Health & Medical', icon: Heart },
  { id: 'legal_financial', label: 'Legal & Financial', icon: Scale },
  { id: 'vehicle_driving', label: 'Vehicle & Driving', icon: Car },
  { id: 'utilities_council', label: 'Utilities & Council', icon: FileText },
];

export const DocumentCategoryFilter: React.FC<Props> = ({
  selectedCategory,
  onSelectCategory,
  counts,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        const Icon = cat.icon;
        const count = counts[cat.id] || 0;

        return (
          <button
            key={cat.id}
            id={`filter-cat-${cat.id}`}
            onClick={() => onSelectCategory(cat.id)}
            className={`inline-flex items-center gap-2 py-2 px-4 rounded-xl font-bold text-xs md:text-sm whitespace-nowrap transition-all flex-shrink-0 ${
              isSelected
                ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-700/30'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
            <span>{cat.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                isSelected ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
