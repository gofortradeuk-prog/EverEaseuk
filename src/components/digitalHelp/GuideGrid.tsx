import React, { useState } from 'react';
import { 
  Video, 
  Building2, 
  Activity, 
  CalendarCheck, 
  Tv, 
  Bell, 
  BookOpen, 
  Search, 
  ChevronRight, 
  Volume2, 
  Clock, 
  CheckCircle,
  HelpCircle,
  Smartphone
} from 'lucide-react';
import { Guide } from '../../types';
import { useAccessibility } from '../../contexts/AccessibilityContext';

interface GuideGridProps {
  guides: Guide[];
  onSelectGuide: (guide: Guide) => void;
  onAskFamily: (question: string) => void;
}

const CATEGORIES = [
  'All Guides',
  'Staying in Touch',
  'Healthcare',
  'Everyday Banking',
  'Home & Entertainment',
  'Organiser & Memory',
];

export const GuideGrid: React.FC<GuideGridProps> = ({
  guides,
  onSelectGuide,
  onAskFamily,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All Guides');
  const [searchQuery, setSearchQuery] = useState('');
  const { speakText } = useAccessibility();

  const getIconForGuide = (guide: Guide) => {
    switch (guide.iconName) {
      case 'Video':
        return <Video className="w-7 h-7 text-emerald-700" />;
      case 'Building2':
        return <Building2 className="w-7 h-7 text-sky-700" />;
      case 'Activity':
        return <Activity className="w-7 h-7 text-teal-700" />;
      case 'CalendarCheck':
        return <CalendarCheck className="w-7 h-7 text-indigo-700" />;
      case 'Tv':
        return <Tv className="w-7 h-7 text-purple-700" />;
      case 'Bell':
        return <Bell className="w-7 h-7 text-amber-700" />;
      default:
        return <Smartphone className="w-7 h-7 text-teal-700" />;
    }
  };

  const filteredGuides = guides.filter((g) => {
    const matchesCategory =
      selectedCategory === 'All Guides' || g.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.steps.some(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="guide-library-section" className="space-y-6">
      {/* Section Heading & Search */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-teal-700" />
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              Pre-Written Step-by-Step Guides
            </h3>
          </div>
          <p className="text-slate-600 text-sm sm:text-base mt-1">
            Tap any topic below for clear instructions with large text and voice reading.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            id="guide-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides (e.g. video call, NHS)..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border-2 border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-sm sm:text-base focus:border-teal-600 focus:ring-2 focus:ring-teal-100 outline-none transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            id={`guide-category-${category.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              selectedCategory === category
                ? 'bg-teal-700 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Guides Grid */}
      {filteredGuides.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGuides.map((guide) => (
            <div
              key={guide.guideId}
              id={`guide-card-${guide.guideId}`}
              className="bg-white rounded-3xl border-2 border-slate-200 hover:border-teal-500 hover:shadow-lg transition-all p-6 flex flex-col justify-between group cursor-pointer"
              onClick={() => onSelectGuide(guide)}
            >
              <div className="space-y-4">
                {/* Top Badge & Icon */}
                <div className="flex items-start justify-between gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    {getIconForGuide(guide)}
                  </div>
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full uppercase tracking-wider">
                    {guide.category}
                  </span>
                </div>

                {/* Title & Summary */}
                <div className="space-y-2">
                  <h4 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug group-hover:text-teal-900 transition-colors">
                    {guide.title}
                  </h4>
                  {guide.summary && (
                    <p className="text-slate-600 text-sm sm:text-base line-clamp-2 leading-relaxed">
                      {guide.summary}
                    </p>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs sm:text-sm font-semibold text-slate-500 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  {guide.steps.length} Simple Steps
                </span>

                <span className="inline-flex items-center gap-1 text-teal-700 font-bold text-sm group-hover:translate-x-1 transition-transform">
                  <span>Open Guide</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-slate-300 space-y-4">
          <HelpCircle className="w-12 h-12 text-slate-400 mx-auto" />
          <h4 className="text-xl font-bold text-slate-800">No guides matching "{searchQuery}"</h4>
          <p className="text-slate-600 max-w-md mx-auto">
            Try asking your question directly in the chat box above, or ask a family member to explain it to you.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onAskFamily(searchQuery || 'General digital help question')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-xs"
            >
              Ask Family Member Instead
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
