import React, { useState } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Users, 
  Bookmark, 
  Share2, 
  Sparkles,
  Printer
} from 'lucide-react';
import { Guide } from '../../types';
import { useAccessibility } from '../../contexts/AccessibilityContext';

interface GuideReaderModalProps {
  guide: Guide;
  onClose: () => void;
  onAskFamily: (question: string) => void;
}

export const GuideReaderModal: React.FC<GuideReaderModalProps> = ({
  guide,
  onClose,
  onAskFamily,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [viewAllSteps, setViewAllSteps] = useState(false);
  const { speakText, stopSpeaking, isSpeaking } = useAccessibility();

  const totalSteps = guide.steps.length;
  const currentStep = guide.steps[currentStepIndex];
  const isLastStep = currentStepIndex === totalSteps - 1;

  const handleReadCurrentStep = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      const textToRead = `${currentStep.title}. ${currentStep.description}`;
      speakText(textToRead);
    }
  };

  const handleNext = () => {
    stopSpeaking();
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    stopSpeaking();
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  return (
    <div 
      id="guide-reader-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-modal-title"
    >
      <div 
        id="guide-reader-container"
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 to-emerald-800 text-white p-6 sm:p-7 flex items-start justify-between relative">
          <div className="space-y-2 pr-8">
            <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs sm:text-sm font-semibold rounded-full uppercase tracking-wider">
              {guide.category}
            </span>
            <h2 id="guide-modal-title" className="text-xl sm:text-2xl lg:text-3xl font-bold leading-snug">
              {guide.title}
            </h2>
            {guide.summary && (
              <p className="text-teal-100 text-sm sm:text-base leading-relaxed">
                {guide.summary}
              </p>
            )}
          </div>
          <button
            id="guide-reader-close-btn"
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close guide"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Mode Switch Bar */}
        <div className="bg-slate-100 px-6 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-sm font-medium text-slate-700">
          <div className="flex items-center gap-2">
            <button
              id="guide-mode-step-by-step"
              onClick={() => setViewAllSteps(false)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                !viewAllSteps
                  ? 'bg-white shadow-sm text-teal-800 font-bold border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Step-by-Step View
            </button>
            <button
              id="guide-mode-all-steps"
              onClick={() => setViewAllSteps(true)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                viewAllSteps
                  ? 'bg-white shadow-sm text-teal-800 font-bold border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Show All {totalSteps} Steps
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="guide-reader-tts-top-btn"
              onClick={handleReadCurrentStep}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                isSpeaking
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4 text-amber-700" />
                  <span>Stop Voice</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-teal-700" />
                  <span>Read Out Loud</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-slate-50/50 space-y-6">
          {!viewAllSteps ? (
            /* Single Step Focus View */
            <div className="space-y-6 animate-fadeIn">
              {/* Progress Indicator */}
              <div className="flex items-center justify-between text-slate-600 font-medium">
                <span className="text-base font-semibold text-teal-900">
                  Step {currentStepIndex + 1} of {totalSteps}
                </span>
                <div className="flex gap-1.5">
                  {guide.steps.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        stopSpeaking();
                        setCurrentStepIndex(idx);
                      }}
                      className={`h-2.5 rounded-full transition-all ${
                        idx === currentStepIndex
                          ? 'w-8 bg-teal-600'
                          : idx < currentStepIndex
                          ? 'w-3 bg-emerald-400'
                          : 'w-3 bg-slate-300'
                      }`}
                      aria-label={`Jump to step ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Main Step Card */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-teal-100 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-lg shrink-0">
                    {currentStepIndex + 1}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                    {currentStep.title}
                  </h3>
                </div>
                <div className="pl-0 sm:pl-13 text-slate-700 text-lg sm:text-xl leading-relaxed">
                  {currentStep.description}
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <button
                  id="guide-step-prev-btn"
                  onClick={handlePrevious}
                  disabled={currentStepIndex === 0}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-base transition-all ${
                    currentStepIndex === 0
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300 shadow-sm'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Previous Step</span>
                </button>

                {isLastStep ? (
                  <button
                    id="guide-step-finish-btn"
                    onClick={() => {
                      stopSpeaking();
                      onClose();
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-md transition-all"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Finished Guide</span>
                  </button>
                ) : (
                  <button
                    id="guide-step-next-btn"
                    onClick={handleNext}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-base shadow-md transition-all"
                  >
                    <span>Next Step</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* All Steps List View */
            <div className="space-y-4 animate-fadeIn">
              {guide.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs flex items-start gap-4 hover:border-teal-200 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <h4 className="text-lg font-bold text-slate-900">{step.title}</h4>
                    <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 p-4 sm:p-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            id="guide-ask-family-footer-btn"
            onClick={() => {
              stopSpeaking();
              onAskFamily(`Help needed with guide: "${guide.title}"`);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm sm:text-base shadow-sm transition-all focus:ring-2 focus:ring-amber-400"
          >
            <Users className="w-5 h-5 text-slate-950" />
            <span>Ask a family member about this</span>
          </button>

          <button
            id="guide-close-bottom-btn"
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 font-semibold text-sm transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
