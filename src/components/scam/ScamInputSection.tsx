import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Image as ImageIcon, 
  Mail, 
  Upload, 
  Sparkles, 
  AlertCircle, 
  Clipboard, 
  Check, 
  Trash2,
  Copy,
  Info
} from 'lucide-react';
import { ScamInputType } from '../../types';

interface ScamInputSectionProps {
  onAnalyze: (data: {
    inputType: ScamInputType;
    text?: string;
    imageBase64?: string;
    mimeType?: string;
  }) => Promise<void>;
  isLoading: boolean;
}

const SAMPLE_SCAMS = [
  {
    title: '📦 Royal Mail Delivery Fee',
    text: 'Royal Mail: Your parcel has a £2.49 unpaid shipping fee. If not paid within 24 hours, your item will be returned to sender. Pay now at: https://royalmail-fee-redelivery.top/pay',
  },
  {
    title: '🏛️ HMRC Tax Refund',
    text: 'GOV.UK / HMRC: You have an outstanding tax refund of £482.50 for year 2025/26. Please claim your rebate immediately by verifying your bank details: https://hmrc-uk-rebate.vip/claim',
  },
  {
    title: '💬 WhatsApp "Hi Mum / Dad"',
    text: 'Hi Mum, I dropped my phone down the loo so this is my temporary number! I have an urgent bill due today and my bank app is locked on this new phone. Can you transfer £850 to this account? Sort Code: 20-45-11, Acc: 83920194. Love you xx',
  },
  {
    title: '🏥 Genuine NHS Appointment (Safe Example)',
    text: 'NHS Reminder: Margaret, you have an appointment with Dr. Henderson at Highfield Health Centre on Tuesday 18th August at 10:30 AM. Reply CANCEL to cancel. Do not reply with medical questions.',
  },
];

export const ScamInputSection: React.FC<ScamInputSectionProps> = ({
  onAnalyze,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState<ScamInputType>('text');
  const [textInput, setTextInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string>('image/jpeg');
  const [imageName, setImageName] = useState<string>('');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setValidationError('Please select a valid image file (photo or screenshot).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setValidationError('Image size must be less than 10MB.');
      return;
    }

    setValidationError(null);
    setImageName(file.name);
    setImageMime(file.type);

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setTextInput(text);
        setValidationError(null);
      }
    } catch {
      // Fallback
      setValidationError('Please click inside the box and press Paste on your keyboard.');
    }
  };

  const handleCopyForwardAddress = () => {
    navigator.clipboard.writeText('check@safe.everease.co.uk');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (activeTab === 'text') {
      if (!textInput.trim()) {
        setValidationError('Please paste or type the message you would like to check.');
        return;
      }
      await onAnalyze({
        inputType: 'text',
        text: textInput.trim(),
      });
    } else if (activeTab === 'image') {
      if (!selectedImage) {
        setValidationError('Please select or drag a screenshot photo first.');
        return;
      }
      await onAnalyze({
        inputType: 'image',
        imageBase64: selectedImage,
        mimeType: imageMime,
      });
    } else if (activeTab === 'email') {
      // UI hook for forwarded email
      if (!textInput.trim()) {
        setValidationError('Please enter any subject or note from the forwarded email to check.');
        return;
      }
      await onAnalyze({
        inputType: 'email',
        text: textInput.trim(),
      });
    }
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm overflow-hidden" id="scam-checker-card">
      {/* Top Banner / Heading */}
      <div className="bg-gradient-to-r from-emerald-800 to-slate-900 p-6 md:p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-amber-400 text-slate-900 font-extrabold text-xs md:text-sm uppercase tracking-wider px-3 py-1 rounded-full">
            Safeguarding Check
          </span>
          <span className="text-emerald-300 text-sm font-medium">Free & Confidential</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          Is this message or email safe?
        </h2>
        <p className="text-slate-200 text-base md:text-lg mt-2 max-w-3xl leading-relaxed">
          Not sure about a text message, email, WhatsApp, or phone call? Submit it below. Our safety engine will check for UK scams in seconds.
        </p>
      </div>

      {/* 3 Submission Tabs */}
      <div className="border-b-2 border-slate-200 bg-slate-50 px-4 md:px-8 pt-4">
        <div className="flex flex-wrap gap-2 md:gap-4" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'text'}
            onClick={() => {
              setActiveTab('text');
              setValidationError(null);
            }}
            id="tab-paste-text"
            className={`flex items-center gap-2.5 px-5 py-3.5 rounded-t-2xl font-bold text-base md:text-lg transition-all border-t-2 border-x-2 ${
              activeTab === 'text'
                ? 'bg-white text-emerald-800 border-slate-300 -mb-[2px] shadow-xs'
                : 'bg-slate-100 text-slate-600 border-transparent hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <FileText className="w-5 h-5 text-emerald-600" />
            <span>1. Paste Text Message</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'image'}
            onClick={() => {
              setActiveTab('image');
              setValidationError(null);
            }}
            id="tab-upload-screenshot"
            className={`flex items-center gap-2.5 px-5 py-3.5 rounded-t-2xl font-bold text-base md:text-lg transition-all border-t-2 border-x-2 ${
              activeTab === 'image'
                ? 'bg-white text-emerald-800 border-slate-300 -mb-[2px] shadow-xs'
                : 'bg-slate-100 text-slate-600 border-transparent hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-5 h-5 text-indigo-600" />
            <span>2. Upload Screenshot</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'email'}
            onClick={() => {
              setActiveTab('email');
              setValidationError(null);
            }}
            id="tab-forward-email"
            className={`flex items-center gap-2.5 px-5 py-3.5 rounded-t-2xl font-bold text-base md:text-lg transition-all border-t-2 border-x-2 ${
              activeTab === 'email'
                ? 'bg-white text-emerald-800 border-slate-300 -mb-[2px] shadow-xs'
                : 'bg-slate-100 text-slate-600 border-transparent hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <Mail className="w-5 h-5 text-amber-600" />
            <span>3. Forward by Email</span>
          </button>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
        {validationError && (
          <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl flex items-start gap-3 text-rose-900">
            <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div className="font-semibold text-base">{validationError}</div>
          </div>
        )}

        {/* TAB 1: PASTE TEXT */}
        {activeTab === 'text' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="scam-text-input" className="font-bold text-slate-800 text-lg">
                Paste or type the suspicious message text here:
              </label>
              <button
                type="button"
                onClick={handlePasteClipboard}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-colors cursor-pointer"
                title="Paste from clipboard"
              >
                <Clipboard className="w-4 h-4 text-emerald-700" />
                Paste from Clipboard
              </button>
            </div>

            <textarea
              id="scam-text-input"
              rows={5}
              value={textInput}
              onChange={(e) => {
                setTextInput(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder="e.g. 'Royal Mail: Your parcel has an unpaid fee of £1.99. Click here to pay: ...'"
              className="w-full p-4 md:p-5 rounded-2xl border-2 border-slate-300 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 outline-none text-base md:text-lg font-medium text-slate-900 bg-slate-50 transition-all placeholder:text-slate-400"
            />

            {/* Quick Sample Prompts */}
            <div className="pt-2">
              <span className="text-sm font-bold text-slate-600 block mb-2">
                Or try checking one of these common UK examples:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SAMPLE_SCAMS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTextInput(sample.text);
                      setValidationError(null);
                    }}
                    className="text-left p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 transition-colors text-sm font-semibold text-slate-800 cursor-pointer"
                  >
                    <span className="font-bold text-slate-900 block">{sample.title}</span>
                    <span className="text-xs text-slate-500 line-clamp-1 mt-0.5">{sample.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: UPLOAD SCREENSHOT */}
        {activeTab === 'image' && (
          <div className="space-y-4">
            <label className="font-bold text-slate-800 text-lg block">
              Upload a photo or screenshot of the message:
            </label>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
              id="scam-screenshot-file-input"
            />

            {!selectedImage ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-3 border-dashed border-slate-300 hover:border-emerald-500 rounded-3xl p-8 md:p-12 text-center bg-slate-50 hover:bg-emerald-50/50 transition-all cursor-pointer flex flex-col items-center justify-center space-y-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs">
                  <Upload className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <span className="text-lg md:text-xl font-bold text-slate-900 block">
                    Click here to choose a photo or screenshot
                  </span>
                  <p className="text-sm md:text-base text-slate-500 font-medium">
                    You can take a screenshot on your iPad/iPhone/Android or take a photo of another screen
                  </p>
                </div>
                <button
                  type="button"
                  className="px-6 py-3 bg-white border-2 border-slate-300 hover:border-emerald-600 text-slate-800 rounded-xl font-bold text-base shadow-xs"
                >
                  Select Photo
                </button>
              </div>
            ) : (
              <div className="p-4 bg-slate-100 rounded-2xl border-2 border-slate-300 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-emerald-700" />
                    <span className="font-bold text-slate-800 text-sm md:text-base truncate max-w-xs">
                      {imageName || 'Selected Screenshot'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null);
                      setImageName('');
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="p-2 text-rose-600 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer"
                    title="Remove selected image"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="max-h-72 overflow-hidden rounded-xl border border-slate-300 bg-black/5 flex items-center justify-center">
                  <img
                    src={selectedImage}
                    alt="Screenshot preview for scam analysis"
                    className="max-h-72 object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: FORWARD BY EMAIL */}
        {activeTab === 'email' && (
          <div className="space-y-5">
            <div className="p-5 bg-amber-50 border-2 border-amber-200 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-lg">
                <Mail className="w-6 h-6 text-amber-700" />
                <span>Dedicated UK Safe Inbox Address</span>
              </div>
              <p className="text-amber-900 text-base leading-relaxed">
                You can forward any suspicious email directly from your Apple Mail, Outlook, or Gmail app to our automated UK check address:
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                <div className="w-full sm:w-auto flex-1 bg-white border-2 border-amber-300 rounded-xl px-4 py-3 font-mono font-bold text-base md:text-lg text-slate-900 select-all">
                  check@safe.everease.co.uk
                </div>
                <button
                  type="button"
                  onClick={handleCopyForwardAddress}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      <span>Copy Email</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="forwarded-subject-input" className="font-bold text-slate-800 text-base">
                Or paste email subject and text snippet below to check immediately:
              </label>
              <textarea
                id="forwarded-subject-input"
                rows={4}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Paste the email subject or sender email address (e.g., from: 'service@hmrc-rebates.com', subject: 'Tax refund notice')..."
                className="w-full p-4 rounded-2xl border-2 border-slate-300 focus:border-emerald-600 outline-none text-base font-medium text-slate-900 bg-slate-50"
              />
            </div>
          </div>
        )}

        {/* UK GDPR Data Minimisation Notice */}
        <div className="flex items-start gap-2.5 p-3.5 bg-slate-100 rounded-xl text-xs md:text-sm text-slate-600 font-medium">
          <Info className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
          <span>
            <strong>UK GDPR Data-Minimisation:</strong> We do not store your original message text or uploaded screenshot permanently. Content is analysed in memory to generate the verdict, and the raw text/photo is immediately discarded.
          </span>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            id="btn-run-scam-check"
            className="w-full py-5 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-xl md:text-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-7 h-7 border-4 border-white border-t-transparent rounded-full animate-spin" />
                <span>Checking Message Safety with EverEase AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-7 h-7 text-amber-300" />
                <span>Check Message Safety Now</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
