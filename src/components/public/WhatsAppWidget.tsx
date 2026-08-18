import React, { useState } from 'react';
import { MessageCircle, X, Send, PhoneCall } from 'lucide-react';
import { useAccessibility } from '../../contexts/AccessibilityContext';

export const WhatsAppWidget: React.FC = () => {
  const { speakText } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const textToSend = message.trim() || 'Hello EverEase support, I would like some help with my device.';
    const encoded = encodeURIComponent(textToSend);
    window.open(`https://wa.me/448008882026?text=${encoded}`, '_blank', 'noopener,noreferrer');
    setMessage('');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" id="whatsapp-support-widget">
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 bg-white rounded-3xl shadow-2xl border-2 border-emerald-500 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-[#075E54] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white font-bold shadow-xs">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-sm text-white">EverEase WhatsApp</h4>
                <p className="text-[11px] text-emerald-100 font-medium">UK Tech Support • Online</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-emerald-100 hover:text-white hover:bg-emerald-700/50"
              aria-label="Close WhatsApp chat popup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-[#ECE5DD] space-y-3">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-xs text-xs sm:text-sm text-slate-800 space-y-1 border border-slate-200">
              <p className="font-bold text-teal-900">Hello! 👋</p>
              <p>Need patient help with a device, video call, or app? Send our friendly UK team a message here.</p>
              <span className="text-[10px] text-slate-400 block text-right">EverEase Care Team</span>
            </div>

            <form onSubmit={handleSendWhatsApp} className="space-y-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your question here..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Start WhatsApp Chat</span>
              </button>
            </form>

            <div className="text-center pt-1">
              <a
                href="tel:08008882026"
                className="text-[11px] text-slate-600 hover:text-slate-900 font-bold inline-flex items-center gap-1"
              >
                <PhoneCall className="w-3 h-3 text-emerald-700" />
                <span>Or Freephone: 0800 888 2026</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Floating Circular Green WhatsApp Button */}
      <button
        type="button"
        id="btn-floating-whatsapp"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] hover:bg-[#20bd5a] active:scale-95 text-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all cursor-pointer border-2 border-white focus:outline-none focus:ring-4 focus:ring-emerald-300"
        title="Chat with EverEase on WhatsApp"
        aria-label="Chat with EverEase on WhatsApp"
      >
        <MessageCircle className="w-8 h-8 sm:w-9 sm:h-9 text-white fill-white" />
      </button>
    </div>
  );
};
