import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Search, 
  CheckCircle2, 
  X, 
  MoveUp, 
  MoveDown, 
  Sparkles,
  MessageCircle,
  Video,
  Shield,
  CreditCard,
  Tv,
  CalendarCheck,
  Activity,
  Bell,
  Smartphone,
  Info
} from 'lucide-react';
import { Guide, GuideStep } from '../../types';

interface ContentManagementSectionProps {
  guides: Guide[];
  loading: boolean;
  onRefresh: () => void;
  onSaveGuide: (guide: Guide, isNew: boolean) => Promise<{ success: boolean; error?: string }>;
  onDeleteGuide: (guideId: string, guideTitle: string) => Promise<{ success: boolean; error?: string }>;
}

const CATEGORIES = [
  'Communication & Family',
  'Healthcare',
  'Home & Entertainment',
  'Organiser & Memory',
  'Online Safety & Scams',
  'Banking & Payments',
  'Device Settings & Accessibility',
];

const AVAILABLE_ICONS = [
  { name: 'MessageCircle', label: 'Messaging / WhatsApp', icon: MessageCircle },
  { name: 'Video', label: 'Video Call / FaceTime', icon: Video },
  { name: 'Shield', label: 'Safety & Security', icon: Shield },
  { name: 'CreditCard', label: 'Banking & Cards', icon: CreditCard },
  { name: 'Tv', label: 'Smart TV & Remote', icon: Tv },
  { name: 'Activity', label: 'NHS & Health', icon: Activity },
  { name: 'CalendarCheck', label: 'Appointments', icon: CalendarCheck },
  { name: 'Bell', label: 'Reminders & Alarms', icon: Bell },
  { name: 'Smartphone', label: 'Device & Phone', icon: Smartphone },
];

export const ContentManagementSection: React.FC<ContentManagementSectionProps> = ({
  guides,
  loading,
  onRefresh,
  onSaveGuide,
  onDeleteGuide,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Modals state
  const [editingGuide, setEditingGuide] = useState<Guide | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [previewGuide, setPreviewGuide] = useState<Guide | null>(null);
  const [deletingGuide, setDeletingGuide] = useState<Guide | null>(null);
  
  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState(CATEGORIES[0]);
  const [formIconName, setFormIconName] = useState('MessageCircle');
  const [formSummary, setFormSummary] = useState('');
  const [formSteps, setFormSteps] = useState<GuideStep[]>([
    { title: 'Step 1: Open the application', description: 'Tap the application icon on your main screen.' },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const filteredGuides = guides.filter((g) => {
    const matchesSearch = 
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.summary || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (selectedCategory !== 'All' && g.category !== selectedCategory) return false;
    return true;
  });

  const handleOpenCreate = () => {
    setIsCreating(true);
    setEditingGuide(null);
    setFormTitle('');
    setFormCategory(CATEGORIES[0]);
    setFormIconName('MessageCircle');
    setFormSummary('');
    setFormSteps([
      { title: 'Step 1: Get started', description: 'Plain English instruction for the senior.' },
      { title: 'Step 2: Next step', description: 'Clear next action with helpful advice.' },
    ]);
    setFormError(null);
  };

  const handleOpenEdit = (guide: Guide) => {
    setEditingGuide(guide);
    setIsCreating(false);
    setFormTitle(guide.title);
    setFormCategory(guide.category || CATEGORIES[0]);
    setFormIconName(guide.iconName || 'MessageCircle');
    setFormSummary(guide.summary || '');
    setFormSteps(guide.steps && guide.steps.length > 0 ? [...guide.steps] : [
      { title: 'Step 1: Get started', description: 'Instruction' }
    ]);
    setFormError(null);
  };

  const handleAddStep = () => {
    setFormSteps((prev) => [
      ...prev,
      {
        title: `Step ${prev.length + 1}: Description`,
        description: '',
      },
    ]);
  };

  const handleRemoveStep = (index: number) => {
    if (formSteps.length <= 1) return;
    setFormSteps((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= formSteps.length) return;
    const updated = [...formSteps];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setFormSteps(updated);
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormError('Please enter a clear title for this guide.');
      return;
    }
    if (formSteps.length === 0 || formSteps.some((s) => !s.title.trim() || !s.description.trim())) {
      setFormError('All steps must have a title and step-by-step description.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    const guideId = isCreating 
      ? `guide_${formTitle.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 30)}_${Date.now().toString().substring(8)}`
      : editingGuide!.guideId;

    const payload: Guide = {
      guideId,
      title: formTitle.trim(),
      category: formCategory,
      iconName: formIconName,
      summary: formSummary.trim(),
      steps: formSteps,
      createdBy: editingGuide?.createdBy || 'support_admin',
      updatedAt: new Date().toISOString(),
    };

    const res = await onSaveGuide(payload, isCreating);
    setIsSubmitting(false);

    if (res.success) {
      setIsCreating(false);
      setEditingGuide(null);
    } else {
      setFormError(res.error || 'Failed to save guide to Firestore.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingGuide) return;
    setIsSubmitting(true);
    const res = await onDeleteGuide(deletingGuide.guideId, deletingGuide.title);
    setIsSubmitting(false);
    if (res.success) {
      setDeletingGuide(null);
    } else {
      alert('Could not delete guide: ' + res.error);
    }
  };

  return (
    <div className="space-y-6" id="admin-content-management-section">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-700" />
              <span>Digital Help Content Management System (CMS)</span>
            </h2>
            <p className="text-sm text-slate-500">
              Create and manage step-by-step guidance library published live to UK seniors without requiring code deployments.
            </p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-xs transition-colors self-start sm:self-auto"
            id="admin-create-guide-btn"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Guide</span>
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col md:flex-row items-center gap-3 pt-2">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search guides by title, category, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-purple-400 transition-all"
              id="admin-guides-search-input"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-2 rounded-xl text-xs font-black uppercase transition-all shrink-0 cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({guides.length})
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="admin-guides-grid">
        {filteredGuides.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-400 font-bold">
            No guides found in library matching your criteria.
          </div>
        ) : (
          filteredGuides.map((guide) => (
            <div
              key={guide.guideId}
              className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-purple-300 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-purple-50 text-purple-900 border border-purple-200 rounded-lg text-xs font-bold">
                    {guide.category}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {guide.steps ? guide.steps.length : 0} steps
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  {guide.title}
                </h3>

                {guide.summary && (
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {guide.summary}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Updated: {new Date(guide.updatedAt || Date.now()).toLocaleDateString('en-GB')}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPreviewGuide(guide)}
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors"
                    title="Preview Senior View"
                    id={`preview-guide-${guide.guideId}`}
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleOpenEdit(guide)}
                    className="p-2 text-purple-700 hover:text-purple-900 hover:bg-purple-50 rounded-xl cursor-pointer transition-colors"
                    title="Edit Guide"
                    id={`edit-guide-${guide.guideId}`}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setDeletingGuide(guide)}
                    className="p-2 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-xl cursor-pointer transition-colors"
                    title="Delete Guide"
                    id={`delete-guide-${guide.guideId}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create / Edit Guide Modal */}
      {(isCreating || editingGuide) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-600 rounded-2xl text-white">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">
                    {isCreating ? 'Create New Step-by-Step Guide' : 'Edit Library Guide'}
                  </h3>
                  <p className="text-xs text-purple-300 font-bold uppercase tracking-wider mt-0.5">
                    Live Firestore guides Collection
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingGuide(null);
                }}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveForm} className="p-6 space-y-6 overflow-y-auto flex-1 text-sm">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 text-xs font-bold">
                  {formError}
                </div>
              )}

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                    Guide Title (Plain English) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. How to send a voice note on WhatsApp"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-bold focus:ring-2 focus:ring-purple-400"
                    id="guide-title-input"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-purple-400"
                    id="guide-category-select"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                    Display Icon
                  </label>
                  <select
                    value={formIconName}
                    onChange={(e) => setFormIconName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-purple-400"
                    id="guide-icon-select"
                  >
                    {AVAILABLE_ICONS.map((i) => (
                      <option key={i.name} value={i.name}>
                        {i.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                    Short Summary / Purpose
                  </label>
                  <input
                    type="text"
                    placeholder="Brief 1-sentence description of what the senior will achieve."
                    value={formSummary}
                    onChange={(e) => setFormSummary(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-purple-400"
                    id="guide-summary-input"
                  />
                </div>
              </div>

              {/* Step Builder */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                      Step-by-Step Instructions ({formSteps.length} steps)
                    </h4>
                    <p className="text-xs text-slate-500">Keep instructions brief, reassuring, and numbered.</p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddStep}
                    className="px-3 py-1.5 bg-purple-50 text-purple-900 border border-purple-200 hover:bg-purple-100 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                    id="add-step-btn"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Step</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {formSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-black text-purple-900 uppercase">
                          Step #{idx + 1}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveStep(idx, 'up')}
                            className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                            title="Move Step Up"
                          >
                            <MoveUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === formSteps.length - 1}
                            onClick={() => handleMoveStep(idx, 'down')}
                            className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                            title="Move Step Down"
                          >
                            <MoveDown className="w-3.5 h-3.5" />
                          </button>
                          {formSteps.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveStep(idx)}
                              className="p-1 text-rose-500 hover:text-rose-700 cursor-pointer ml-1"
                              title="Delete Step"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <input
                        type="text"
                        placeholder={`Step ${idx + 1} Title (e.g. Tap the Camera button)`}
                        value={step.title}
                        onChange={(e) => {
                          const updated = [...formSteps];
                          updated[idx].title = e.target.value;
                          setFormSteps(updated);
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                        required
                      />

                      <textarea
                        rows={2}
                        placeholder="Detailed advice for this step in simple non-technical wording..."
                        value={step.description}
                        onChange={(e) => {
                          const updated = [...formSteps];
                          updated[idx].description = e.target.value;
                          setFormSteps(updated);
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 -mx-6 -mb-6 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingGuide(null);
                  }}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  id="save-guide-submit-btn"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSubmitting ? 'Saving to Firestore...' : 'Publish Guide Live'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Guide Preview Modal */}
      {previewGuide && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800">
              <div>
                <span className="text-xs text-purple-300 font-bold uppercase tracking-wider">
                  Live Senior View Simulator
                </span>
                <h3 className="text-xl font-black text-white">{previewGuide.title}</h3>
              </div>
              <button
                onClick={() => setPreviewGuide(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1 text-base">
              {previewGuide.summary && (
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl text-purple-950 font-medium">
                  {previewGuide.summary}
                </div>
              )}

              <div className="space-y-3">
                {previewGuide.steps.map((step, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                    <h4 className="font-bold text-slate-900">{step.title}</h4>
                    <p className="text-slate-700 leading-relaxed text-sm">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
              <button
                onClick={() => setPreviewGuide(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingGuide && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-lg font-black text-slate-900">Delete Guide from Library?</h3>
            <p className="text-sm text-slate-600">
              Are you sure you want to remove <strong>"{deletingGuide.title}"</strong>? This will remove the guide from the live Digital Help library for all seniors.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingGuide(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isSubmitting}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                {isSubmitting ? 'Deleting...' : 'Delete Guide'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
