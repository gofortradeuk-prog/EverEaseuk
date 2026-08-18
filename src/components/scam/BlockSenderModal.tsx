import React, { useState } from 'react';
import { 
  X, 
  Ban, 
  Smartphone, 
  PhoneCall, 
  Mail, 
  CheckCircle2, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface BlockSenderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BlockSenderModal: React.FC<BlockSenderModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [deviceTab, setDeviceTab] = useState<'iphone' | 'android' | 'landline' | 'email'>('iphone');
  const [blockedConfirmed, setBlockedConfirmed] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border-2 border-slate-300 shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center">
              <Ban className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold">How to Block This Sender</h3>
              <p className="text-xs text-slate-300">Simple instructions for your phone or email</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Device Selectors */}
        <div className="p-4 bg-slate-100 border-b border-slate-200 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setDeviceTab('iphone')}
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              deviceTab === 'iphone'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Apple iPhone / iPad</span>
          </button>

          <button
            type="button"
            onClick={() => setDeviceTab('android')}
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              deviceTab === 'android'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Samsung / Android</span>
          </button>

          <button
            type="button"
            onClick={() => setDeviceTab('landline')}
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              deviceTab === 'landline'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <PhoneCall className="w-4 h-4" />
            <span>UK Landline (BT/Virgin)</span>
          </button>

          <button
            type="button"
            onClick={() => setDeviceTab('email')}
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              deviceTab === 'email'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Email Apps</span>
          </button>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {deviceTab === 'iphone' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-lg">On your iPhone:</h4>
              <ol className="space-y-3 text-slate-700 font-medium text-base list-decimal list-inside">
                <li className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  Open the <strong>Messages</strong> app and tap the conversation with the scammer.
                </li>
                <li className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  Tap the sender's phone number or contact circle at the top of the screen.
                </li>
                <li className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  Tap the <strong>"info"</strong> icon (the small 'i' in a circle).
                </li>
                <li className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  Scroll down and tap <strong className="text-rose-600">"Block this Caller"</strong>.
                </li>
              </ol>
            </div>
          )}

          {deviceTab === 'android' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-lg">On your Samsung or Android phone:</h4>
              <ol className="space-y-3 text-slate-700 font-medium text-base list-decimal list-inside">
                <li className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  Open your <strong>Messages</strong> app and tap the suspicious message.
                </li>
                <li className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  Tap the <strong>three dots (⋮)</strong> in the top right corner.
                </li>
                <li className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  Select <strong>"Details"</strong> or <strong>"Block & Report Spam"</strong>.
                </li>
                <li className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  Tick "Report Spam" and tap <strong className="text-rose-600">"OK"</strong>.
                </li>
              </ol>
            </div>
          )}

          {deviceTab === 'landline' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-lg">On your Home Landline:</h4>
              <div className="space-y-3 text-slate-700 font-medium text-base">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <strong>BT Call Protect:</strong> Dial <strong>1572</strong> from your home phone immediately after receiving a scam call to add that number to your personal blacklist.
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <strong>Telephone Preference Service (TPS):</strong> Register your landline free with the UK TPS on <strong>0345 070 0707</strong> to cut nuisance sales calls.
                </div>
              </div>
            </div>
          )}

          {deviceTab === 'email' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-lg">In your Email (Apple Mail / Outlook / Gmail):</h4>
              <ol className="space-y-3 text-slate-700 font-medium text-base list-decimal list-inside">
                <li className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  Open the email and look at the sender's address at the top.
                </li>
                <li className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  Click the <strong>three dots (⋮)</strong> or <strong>"Message"</strong> menu.
                </li>
                <li className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  Click <strong className="text-rose-600">"Block Sender"</strong> or <strong>"Move to Junk"</strong>.
                </li>
              </ol>
            </div>
          )}

          {/* Action Confirmation */}
          <div className="pt-2">
            {blockedConfirmed ? (
              <div className="p-4 bg-emerald-100 border-2 border-emerald-400 rounded-2xl flex items-center gap-3 text-emerald-950 font-bold">
                <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0" />
                <span>Marked as blocked in your safety history!</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setBlockedConfirmed(true)}
                className="w-full py-3.5 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold text-base rounded-2xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>I Have Blocked This Number / Sender</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-base cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
