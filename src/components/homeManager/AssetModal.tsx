import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Flame,
  Sparkles,
  Bell,
  Wrench,
  Camera,
  UploadCloud,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Eye,
  Info,
} from 'lucide-react';
import { HomeAssetRecord, HomeAssetType } from '../../types';
import { calculateNextServiceDate, saveHomeAsset } from '../../lib/firestoreService';

interface Props {
  seniorUid: string;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (asset: HomeAssetRecord, serviceReminderCreated: boolean, warrantyReminderCreated: boolean) => void;
  editingAsset?: HomeAssetRecord | null;
}

// Preloaded UK household templates for quick 1-click testing
const PRELOADED_TEMPLATES = [
  {
    label: 'Worcester Bosch Gas Boiler',
    type: 'boiler' as HomeAssetType,
    name: 'Worcester Bosch Greenstar 4000 30kW System Boiler',
    serviceIntervalMonths: 12,
    warrantyExpiry: `${new Date().getFullYear() + 7}-10-01`,
    lastServiceDate: `${new Date().getFullYear()}-01-15`,
    notes: 'Annual Gas Safe inspection required. Keep water pressure gauge at 1.2 bar. Engineer: Andy Miller (Gas Safe #512984).',
    photoUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%230f172a"/><rect x="40" y="30" width="520" height="340" rx="16" fill="%231e293b" stroke="%23334155" stroke-width="2"/><circle cx="300" cy="180" r="70" fill="%230284c7" fill-opacity="0.2" stroke="%2338bdf8" stroke-width="4"/><text x="300" y="175" fill="%2338bdf8" font-family="sans-serif" font-size="28" font-weight="bold" text-anchor="middle">1.2 BAR</text><text x="300" y="205" fill="%2394a3b8" font-family="sans-serif" font-size="14" text-anchor="middle">Optimal Pressure</text><text x="300" y="75" fill="white" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">WORCESTER BOSCH GREENSTAR 4000</text><text x="300" y="100" fill="%23cbd5e1" font-family="sans-serif" font-size="13" text-anchor="middle">Serial: 7738112904 • Gas Safe Ref: 512984</text><rect x="80" y="290" width="440" height="50" rx="8" fill="%23047857"/><text x="300" y="322" fill="white" font-family="sans-serif" font-size="15" font-weight="bold" text-anchor="middle">Annual Service Status: Active</text></svg>',
  },
  {
    label: 'Bosch Washing Machine',
    type: 'appliance' as HomeAssetType,
    name: 'Bosch Serie 4 8kg Washing Machine',
    serviceIntervalMonths: 6,
    warrantyExpiry: `${new Date().getFullYear() + 2}-06-15`,
    lastServiceDate: `${new Date().getFullYear()}-03-01`,
    notes: 'Bought from Currys. Clear lint filter in bottom flap every 6 months. Model WAN28209GB.',
    photoUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23f8fafc"/><rect x="40" y="30" width="520" height="340" rx="16" fill="white" stroke="%23e2e8f0" stroke-width="3"/><circle cx="300" cy="180" r="75" fill="%23f1f5f9" stroke="%2394a3b8" stroke-width="8"/><circle cx="300" cy="180" r="50" fill="%2338bdf8" fill-opacity="0.3"/><text x="300" y="75" fill="%230f172a" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">BOSCH SERIE 4 WASHING MACHINE</text><text x="300" y="100" fill="%2364748b" font-family="sans-serif" font-size="13" text-anchor="middle">Model: WAN28209GB/01 • 8kg Load Capacity</text><rect x="80" y="295" width="440" height="45" rx="8" fill="%230284c7"/><text x="300" y="324" fill="white" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">Filter Maintenance: 6-Month Cycle</text></svg>',
  },
  {
    label: 'Aico Interlinked Smoke & Heat Alarms',
    type: 'alarm' as HomeAssetType,
    name: 'Aico Ei3024 Multi-Sensor Optical Smoke Alarm System',
    serviceIntervalMonths: 6,
    warrantyExpiry: `${new Date().getFullYear() + 8}-09-01`,
    lastServiceDate: `${new Date().getFullYear()}-02-15`,
    notes: 'Grade D1 mains interlinked with 10-year rechargeable lithium backup. Test buttons every 6 months. Electrician: Clive Davies NICEIC.',
    photoUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%231e293b"/><rect x="40" y="30" width="520" height="340" rx="16" fill="%230f172a" stroke="%23334155" stroke-width="2"/><circle cx="300" cy="180" r="65" fill="%2310b981" fill-opacity="0.2" stroke="%2310b981" stroke-width="4"/><text x="300" y="185" fill="%2310b981" font-family="sans-serif" font-size="16" font-weight="bold" text-anchor="middle">GREEN LED OK</text><text x="300" y="75" fill="white" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">AICO EI3024 DUAL SENSOR ALARMS</text><text x="300" y="100" fill="%2394a3b8" font-family="sans-serif" font-size="13" text-anchor="middle">BS 5839-6 Grade D1 Standard</text><rect x="80" y="295" width="440" height="45" rx="8" fill="%23047857"/><text x="300" y="324" fill="white" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">Battery & Sensor Health: Fully Verified</text></svg>',
  },
];

export const AssetModal: React.FC<Props> = ({
  seniorUid,
  isOpen,
  onClose,
  onSaved,
  editingAsset,
}) => {
  // Form State
  const [assetType, setAssetType] = useState<HomeAssetType>('boiler');
  const [name, setName] = useState<string>('');
  const [lastServiceDate, setLastServiceDate] = useState<string>('');
  const [serviceIntervalMonths, setServiceIntervalMonths] = useState<number>(12);
  const [hasWarranty, setHasWarranty] = useState<boolean>(true);
  const [warrantyExpiry, setWarrantyExpiry] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [autoSyncReminders, setAutoSyncReminders] = useState<boolean>(true);

  // Photo & Camera State
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [photoStoragePath, setPhotoStoragePath] = useState<string>('');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Camera video / stream ref
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Saving state
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Initialize or reset form when modal opens / editingAsset changes
  useEffect(() => {
    if (isOpen) {
      if (editingAsset) {
        setAssetType(editingAsset.type);
        setName(editingAsset.name);
        setLastServiceDate(editingAsset.lastServiceDate || '');
        setServiceIntervalMonths(editingAsset.serviceIntervalMonths || 12);
        setHasWarranty(Boolean(editingAsset.warrantyExpiry));
        setWarrantyExpiry(editingAsset.warrantyExpiry || '');
        setNotes(editingAsset.notes || '');
        setPhotoUrl(editingAsset.photoUrl || '');
        setPhotoStoragePath(editingAsset.photoStoragePath || '');
      } else {
        // Defaults for new asset
        setAssetType('boiler');
        setName('');
        setLastServiceDate(new Date().toISOString().split('T')[0]);
        setServiceIntervalMonths(12);
        setHasWarranty(true);
        const nextYear = new Date();
        nextYear.setFullYear(nextYear.getFullYear() + 5);
        setWarrantyExpiry(nextYear.toISOString().split('T')[0]);
        setNotes('');
        setPhotoUrl('');
        setPhotoStoragePath('');
      }
      setIsCameraActive(false);
      setCameraError(null);
      setFormError(null);
    }
  }, [isOpen, editingAsset]);

  // Derived next service date
  const nextServiceDate = calculateNextServiceDate(lastServiceDate, serviceIntervalMonths);

  // Quick prefill helper
  const handleApplyTemplate = (tmpl: typeof PRELOADED_TEMPLATES[0]) => {
    setAssetType(tmpl.type);
    setName(tmpl.name);
    setServiceIntervalMonths(tmpl.serviceIntervalMonths);
    setWarrantyExpiry(tmpl.warrantyExpiry);
    setLastServiceDate(tmpl.lastServiceDate);
    setNotes(tmpl.notes);
    setPhotoUrl(tmpl.photoUrl);
    setPhotoStoragePath(`homeAssets/${seniorUid}/asset_${tmpl.type}_${Date.now()}.jpg`);
  };

  // Start Camera
  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn('Camera error:', err);
      setCameraError('Unable to access camera. Please check browser permissions or upload a photo from your computer/device.');
      setIsCameraActive(false);
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Capture Frame from Camera
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setPhotoUrl(dataUrl);
      const safeName = name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() || 'asset';
      setPhotoStoragePath(`homeAssets/${seniorUid}/asset_${safeName}_${Date.now()}.jpg`);
    }
    stopCamera();
  };

  // Handle local file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const base64 = event.target.result as string;
        setPhotoUrl(base64);
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        setPhotoStoragePath(`homeAssets/${seniorUid}/asset_${Date.now()}_${safeName}`);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Please enter a name or description for this boiler or appliance.');
      return;
    }

    setIsSaving(true);
    setFormError(null);

    const assetId = editingAsset?.assetId || `asset_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newAsset: HomeAssetRecord = {
      assetId,
      seniorUid,
      type: assetType,
      name: name.trim(),
      warrantyExpiry: hasWarranty && warrantyExpiry ? warrantyExpiry : undefined,
      lastServiceDate: lastServiceDate || undefined,
      serviceIntervalMonths: serviceIntervalMonths > 0 ? Number(serviceIntervalMonths) : undefined,
      nextServiceDate,
      notes: notes.trim() || undefined,
      photoStoragePath: photoStoragePath || (photoUrl ? `homeAssets/${seniorUid}/${assetId}_photo.jpg` : undefined),
      photoUrl: photoUrl || undefined,
      createdAt: editingAsset?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const res = await saveHomeAsset(newAsset, autoSyncReminders);

    setIsSaving(false);
    if (res.success) {
      stopCamera();
      onSaved(newAsset, Boolean(res.serviceReminderCreated), Boolean(res.warrantyReminderCreated));
      onClose();
    } else {
      setFormError(res.error || 'Failed to save home asset. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div
        id="home-asset-modal"
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/20 text-amber-300 rounded-lg border border-amber-500/30">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">
                {editingAsset ? 'Edit Home Appliance / Boiler' : 'Add Boiler, Appliance or Safety Device'}
              </h2>
              <p className="text-xs text-slate-300">
                Tracks service cycles, warranties, and syncs reminders to your calendar.
              </p>
            </div>
          </div>
          <button
            id="btn-close-asset-modal"
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="overflow-y-auto p-6 space-y-5 flex-1">
          {formError && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          {/* Quick Preload Templates for easy testing */}
          {!editingAsset && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Quick Templates (One-Click Pre-fill for UK Homes)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {PRELOADED_TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    id={`btn-prefill-${tmpl.type}`}
                    type="button"
                    onClick={() => handleApplyTemplate(tmpl)}
                    className="px-2.5 py-1 text-xs font-semibold bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg shadow-xs transition-colors"
                  >
                    + {tmpl.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 1. Asset Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Category / Device Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { type: 'boiler' as HomeAssetType, label: 'Gas Boiler & Heating', icon: Flame, color: 'border-amber-400 bg-amber-50 text-amber-900' },
                { type: 'appliance' as HomeAssetType, label: 'Kitchen Appliance', icon: Sparkles, color: 'border-sky-400 bg-sky-50 text-sky-900' },
                { type: 'alarm' as HomeAssetType, label: 'Smoke & CO Alarms', icon: Bell, color: 'border-emerald-400 bg-emerald-50 text-emerald-900' },
                { type: 'other' as HomeAssetType, label: 'Plumbing & Other', icon: Wrench, color: 'border-indigo-400 bg-indigo-50 text-indigo-900' },
              ].map((item) => {
                const isSelected = assetType === item.type;
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.type}
                    id={`select-type-${item.type}`}
                    type="button"
                    onClick={() => setAssetType(item.type)}
                    className={`p-3 rounded-xl border text-left flex flex-col items-start gap-1.5 transition-all ${
                      isSelected
                        ? `${item.color} font-bold ring-2 ring-amber-500 shadow-xs`
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 shrink-0" />
                    <span className="text-xs">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Asset Name */}
          <div>
            <label htmlFor="asset-name-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Appliance / Boiler Name & Model <span className="text-red-500">*</span>
            </label>
            <input
              id="asset-name-input"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Worcester Bosch Greenstar 8000 Life Boiler"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* 3. Service Schedule & Interval */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-600" />
                Service & Maintenance Schedule
              </span>
              <span className="text-xs text-slate-500">Auto-schedules Reminders</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="asset-last-service" className="block text-xs font-medium text-slate-600 mb-1">
                  Last Service / Check Date
                </label>
                <input
                  id="asset-last-service"
                  type="date"
                  value={lastServiceDate}
                  onChange={(e) => setLastServiceDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label htmlFor="asset-service-interval" className="block text-xs font-medium text-slate-600 mb-1">
                  Recurring Service Interval
                </label>
                <select
                  id="asset-service-interval"
                  value={serviceIntervalMonths}
                  onChange={(e) => setServiceIntervalMonths(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value={12}>Every 12 Months (Standard UK Annual Boiler Service)</option>
                  <option value={6}>Every 6 Months (Filter Clean / Alarm Battery Test)</option>
                  <option value={24}>Every 24 Months (2-Year Deep Check)</option>
                  <option value={0}>No recurring interval (One-off check)</option>
                </select>
              </div>
            </div>

            {/* Live Next Service Banner */}
            {nextServiceDate && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-900">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    <strong>Next Service Due:</strong> {nextServiceDate}
                  </span>
                </div>
                <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                  Reminder Auto-Scheduled
                </span>
              </div>
            )}
          </div>

          {/* 4. Warranty Tracker */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  id="toggle-warranty"
                  type="checkbox"
                  checked={hasWarranty}
                  onChange={(e) => setHasWarranty(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  Track Manufacturer / Policy Warranty
                </span>
              </label>
            </div>

            {hasWarranty && (
              <div>
                <label htmlFor="asset-warranty-date" className="block text-xs font-medium text-slate-600 mb-1">
                  Warranty Expiration Date
                </label>
                <input
                  id="asset-warranty-date"
                  type="date"
                  value={warrantyExpiry}
                  onChange={(e) => setWarrantyExpiry(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  We will automatically schedule a notification 4 weeks prior to expiry to let you review extended warranty or breakdown cover.
                </p>
              </div>
            )}
          </div>

          {/* 5. Notes & Engineer Details */}
          <div>
            <label htmlFor="asset-notes-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Notes, Serial Numbers & Engineer Info
            </label>
            <textarea
              id="asset-notes-input"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Gas Safe Registration Ref: 512984. Installed October 2024. Worcester Bosch 10-year warranty guarantee registered."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
            />
          </div>

          {/* 6. Photo & Visual Plate Upload / Camera Capture */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-slate-600" />
                Photo or Rating Plate (Cloud Storage)
              </span>
              {photoUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setPhotoUrl('');
                    setPhotoStoragePath('');
                  }}
                  className="text-xs text-red-600 hover:underline"
                >
                  Remove Photo
                </button>
              )}
            </div>

            {/* Active Camera View */}
            {isCameraActive ? (
              <div className="space-y-3">
                <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 px-2 py-1 bg-red-600 text-white text-[11px] font-bold rounded-md animate-pulse">
                    LIVE CAMERA
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <button
                    id="btn-capture-photo"
                    type="button"
                    onClick={capturePhoto}
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Take Photo Now</span>
                  </button>
                  <button
                    id="btn-cancel-camera"
                    type="button"
                    onClick={stopCamera}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : photoUrl ? (
              <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200">
                <img
                  src={photoUrl}
                  alt="Asset Preview"
                  referrerPolicy="no-referrer"
                  className="w-24 h-20 object-cover rounded-lg border border-slate-200"
                />
                <div className="flex-1 text-xs">
                  <span className="font-semibold text-slate-800 block">Photo Attached</span>
                  <span className="text-slate-500 block truncate">{photoStoragePath || 'Scoped to Senior Cloud Storage'}</span>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={startCamera}
                      className="text-amber-700 font-semibold hover:underline flex items-center gap-1"
                    >
                      <Camera className="w-3.5 h-3.5" /> Retake
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-slate-700 hover:underline flex items-center gap-1"
                    >
                      <UploadCloud className="w-3.5 h-3.5" /> Replace File
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  id="btn-open-camera"
                  type="button"
                  onClick={startCamera}
                  className="p-3 border border-dashed border-slate-300 hover:border-amber-400 bg-white hover:bg-amber-50/50 rounded-xl flex items-center justify-center gap-2 text-slate-700 text-xs font-semibold transition-colors"
                >
                  <Camera className="w-4 h-4 text-amber-600" />
                  <span>Use Device Camera</span>
                </button>

                <button
                  id="btn-browse-photo"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 border border-dashed border-slate-300 hover:border-sky-400 bg-white hover:bg-sky-50/50 rounded-xl flex items-center justify-center gap-2 text-slate-700 text-xs font-semibold transition-colors"
                >
                  <UploadCloud className="w-4 h-4 text-sky-600" />
                  <span>Upload from Computer / Device</span>
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />

            {cameraError && (
              <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                {cameraError}
              </p>
            )}
          </div>

          {/* 7. Automatic Reminder Sync Toggle */}
          <div className="bg-slate-100 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                id="toggle-reminders-sync"
                type="checkbox"
                checked={autoSyncReminders}
                onChange={(e) => setAutoSyncReminders(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
              />
              <label htmlFor="toggle-reminders-sync" className="text-xs font-bold text-slate-800 cursor-pointer">
                Automatically create calendar reminders in the Life Reminders module
              </label>
            </div>
            <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">Recommended</span>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              id="btn-cancel-asset"
              type="button"
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              id="btn-submit-asset"
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 disabled:opacity-50 rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving to Vault...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingAsset ? 'Save Changes' : 'Register Appliance / Boiler'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
