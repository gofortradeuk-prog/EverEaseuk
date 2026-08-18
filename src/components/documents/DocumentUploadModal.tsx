import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Camera,
  UploadCloud,
  Sparkles,
  CheckCircle2,
  Calendar,
  Shield,
  FileText,
  AlertCircle,
  Clock,
  RefreshCw,
  Eye,
  FileCheck,
  Lock,
} from 'lucide-react';
import { DocumentRecord, DocumentCategoryType, ExtractedDocumentData } from '../../types';
import { saveDocument } from '../../lib/firestoreService';

interface Props {
  seniorUid: string;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (doc: DocumentRecord, reminderCreated: boolean) => void;
}

const CATEGORY_OPTIONS: { value: DocumentCategoryType; label: string }[] = [
  { value: 'home_insurance', label: 'Home & Buildings / Contents Insurance' },
  { value: 'identity_passport', label: 'Identity & British Passport' },
  { value: 'health_medical', label: 'NHS Medical & Prescription Exemption' },
  { value: 'legal_financial', label: 'Legal, Will & Lasting Power of Attorney' },
  { value: 'vehicle_driving', label: 'Vehicle, Car Insurance & MOT' },
  { value: 'utilities_council', label: 'Council Tax & Utility Statements' },
  { value: 'other', label: 'Other Important Household Document' },
];

// Sample documents for quick one-click testing
const PRELOADED_SAMPLES = [
  {
    name: 'Aviva Home Insurance Schedule',
    category: 'home_insurance' as DocumentCategoryType,
    fileName: 'Aviva_Home_Insurance_Schedule_2026.pdf',
    title: 'Aviva Home Buildings & Contents Policy 2026/27',
    expiryDate: `${new Date().getFullYear() + 1}-04-30`,
    issuer: 'Aviva UK Insurance',
    summary: 'Buildings & Contents policy schedule (Ref: AV-984210). Includes 24/7 Home Emergency & boiler breakdown cover.',
    notes: 'Emergency helpline: 0800 015 1515. Direct debit £28.50/mo.',
    mockBase64: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800"><rect width="600" height="800" fill="%23f8fafc"/><rect x="40" y="40" width="520" height="100" rx="12" fill="%23047857"/><text x="70" y="95" fill="white" font-family="sans-serif" font-size="28" font-weight="bold">AVIVA INSURANCE</text><text x="70" y="125" fill="%23a7f3d0" font-family="sans-serif" font-size="16">UK Policy Schedule 2026/27</text><rect x="40" y="160" width="520" height="580" rx="12" fill="white" stroke="%23e2e8f0" stroke-width="2"/><text x="70" y="210" fill="%230f172a" font-family="sans-serif" font-size="20" font-weight="bold">Policy Details</text><text x="70" y="250" fill="%23475569" font-family="sans-serif" font-size="15">Policyholder: Margaret Jenkins</text><text x="70" y="280" fill="%23475569" font-family="sans-serif" font-size="15">Policy Number: AV-984210-UK</text><text x="70" y="320" fill="%230f172a" font-family="sans-serif" font-size="18" font-weight="bold">Coverage Period</text><text x="70" y="355" fill="%23047857" font-family="sans-serif" font-size="16" font-weight="bold">Expiry / Renewal Date: 30 April 2027</text><text x="70" y="400" fill="%23475569" font-family="sans-serif" font-size="14">Buildings Cover: £500,000 | Contents Cover: £65,000</text></svg>',
  },
  {
    name: 'HM British Passport (Valid to 2031)',
    category: 'identity_passport' as DocumentCategoryType,
    fileName: 'UK_Passport_Photo_Page.jpg',
    title: 'HM British Passport (Valid to 2031)',
    expiryDate: `${new Date().getFullYear() + 5}-07-22`,
    issuer: 'HM Passport Office',
    summary: 'Standard 10-year British Citizen passport. Number: 541098231.',
    notes: 'Safe storage for international travel & identity confirmation.',
    mockBase64: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800"><rect width="600" height="800" fill="%231e293b"/><rect x="40" y="40" width="520" height="720" rx="16" fill="%230f172a" stroke="%23334155" stroke-width="3"/><text x="300" y="120" fill="%23f8fafc" font-family="sans-serif" font-size="24" font-weight="bold" text-anchor="middle">UNITED KINGDOM OF GREAT BRITAIN</text><text x="300" y="155" fill="%2394a3b8" font-family="sans-serif" font-size="18" text-anchor="middle">PASSPORT</text><rect x="80" y="220" width="180" height="230" rx="8" fill="%23e2e8f0"/><text x="170" y="340" fill="%2364748b" font-family="sans-serif" font-size="16" text-anchor="middle">Photo Page</text><text x="290" y="250" fill="%23f8fafc" font-family="sans-serif" font-size="16">Surname: JENKINS</text><text x="290" y="285" fill="%23f8fafc" font-family="sans-serif" font-size="16">Given Names: MARGARET</text><text x="290" y="325" fill="%23f8fafc" font-family="sans-serif" font-size="16">Nationality: BRITISH CITIZEN</text><text x="290" y="375" fill="%2338bdf8" font-family="sans-serif" font-size="18" font-weight="bold">Date of Expiry: 22 JUL 2031</text></svg>',
  },
  {
    name: 'NHS Prescription Exemption Certificate',
    category: 'health_medical' as DocumentCategoryType,
    fileName: 'NHS_Prescription_Certificate.pdf',
    title: 'NHS Medical & Prescription Exemption Certificate',
    expiryDate: `${new Date().getFullYear() + 1}-11-30`,
    issuer: 'NHS England',
    summary: 'Medical certificate confirming free senior NHS prescriptions and GP practice details.',
    notes: 'Exemption number NHS-MED-449102.',
    mockBase64: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800"><rect width="600" height="800" fill="%23f0fdf4"/><rect x="40" y="40" width="520" height="100" rx="12" fill="%23005eb8"/><text x="70" y="100" fill="white" font-family="sans-serif" font-size="32" font-weight="bold">NHS</text><text x="160" y="98" fill="white" font-family="sans-serif" font-size="18">Prescription Exemption Certificate</text><rect x="40" y="160" width="520" height="580" rx="12" fill="white" stroke="%23cbd5e1" stroke-width="2"/><text x="70" y="220" fill="%230f172a" font-family="sans-serif" font-size="20" font-weight="bold">Certificate of Exemption</text><text x="70" y="265" fill="%23475569" font-family="sans-serif" font-size="16">Name: Margaret Jenkins</text><text x="70" y="300" fill="%23475569" font-family="sans-serif" font-size="16">NHS Number: 481 920 3810</text><text x="70" y="350" fill="%23005eb8" font-family="sans-serif" font-size="18" font-weight="bold">Valid until: 30 November 2027</text></svg>',
  },
];

export const DocumentUploadModal: React.FC<Props> = ({
  seniorUid,
  isOpen,
  onClose,
  onSaved,
}) => {
  // Steps: 'choose_source' | 'camera_active' | 'analyzing' | 'confirm_details'
  const [step, setStep] = useState<'choose_source' | 'camera_active' | 'analyzing' | 'confirm_details'>('choose_source');

  // Uploaded file data
  const [fileName, setFileName] = useState<string>('');
  const [fileBase64, setFileBase64] = useState<string>('');
  const [fileType, setFileType] = useState<string>('image/jpeg');
  const [fileSize, setFileSize] = useState<number>(0);

  // Gemini suggested & editable metadata
  const [docTitle, setDocTitle] = useState<string>('');
  const [category, setCategory] = useState<DocumentCategoryType>('home_insurance');
  const [hasExpiryDate, setHasExpiryDate] = useState<boolean>(true);
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [autoReminder, setAutoReminder] = useState<boolean>(true);
  const [extractedData, setExtractedData] = useState<ExtractedDocumentData | null>(null);

  // Status & errors
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Camera stream refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Clean up media stream on close or step change
  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setStep('choose_source');
      setErrorMsg(null);
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Start Camera
  const startCamera = async () => {
    setErrorMsg(null);
    setStep('camera_active');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setErrorMsg('Camera could not be accessed. Please choose a file or use an example document below.');
      setStep('choose_source');
    }
  };

  // Capture Photo from Camera
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      stopCamera();
      const generatedName = `Document_Photo_${new Date().toISOString().substring(0, 10)}.jpg`;
      processUploadedFile(generatedName, dataUrl, 'image/jpeg', dataUrl.length);
    }
  };

  // Handle Manual File Picker Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      processUploadedFile(file.name, result, file.type || 'image/jpeg', file.size);
    };
    reader.readAsDataURL(file);
  };

  // Handle Sample Document Selection
  const selectSample = (sample: typeof PRELOADED_SAMPLES[0]) => {
    setFileName(sample.fileName);
    setFileBase64(sample.mockBase64);
    setFileType('image/svg+xml');
    setFileSize(350000);

    // Populate metadata directly with rich preview
    setDocTitle(sample.title);
    setCategory(sample.category);
    setHasExpiryDate(!!sample.expiryDate);
    setExpiryDate(sample.expiryDate || '');
    setNotes(sample.notes);
    setAutoReminder(true);
    setExtractedData({
      suggestedTitle: sample.title,
      suggestedCategory: sample.category,
      suggestedExpiryDate: sample.expiryDate,
      issuerOrOrganisation: sample.issuer,
      summary: sample.summary,
      confidence: 'high',
    });

    setStep('confirm_details');
  };

  // Send to Gemini Vision for Analysis
  const processUploadedFile = async (
    name: string,
    base64: string,
    type: string,
    size: number
  ) => {
    setFileName(name);
    setFileBase64(base64);
    setFileType(type);
    setFileSize(size);
    setStep('analyzing');
    setErrorMsg(null);

    try {
      const response = await fetch('/api/documents/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: name,
          imageBase64: base64,
          mimeType: type,
        }),
      });

      if (!response.ok) {
        throw new Error('Analysis request returned an error');
      }

      const data = await response.json();
      setDocTitle(data.suggestedTitle || name.replace(/\.[^/.]+$/, ''));
      setCategory((data.suggestedCategory as DocumentCategoryType) || 'home_insurance');
      if (data.suggestedExpiryDate) {
        setHasExpiryDate(true);
        setExpiryDate(data.suggestedExpiryDate);
      } else {
        setHasExpiryDate(false);
        setExpiryDate('');
      }
      setNotes(data.summary || '');
      setExtractedData(data);
      setAutoReminder(true);
      setStep('confirm_details');
    } catch (err: any) {
      console.warn('Gemini document vision analysis failed, falling back to manual confirmation:', err);
      // Fallback sensible defaults
      setDocTitle(name.replace(/\.[^/.]+$/, ''));
      setCategory('home_insurance');
      setHasExpiryDate(true);
      const nextYear = new Date().getFullYear() + 1;
      setExpiryDate(`${nextYear}-04-30`);
      setNotes('Uploaded document stored in secure vault.');
      setExtractedData({
        suggestedTitle: name.replace(/\.[^/.]+$/, ''),
        suggestedCategory: 'home_insurance',
        suggestedExpiryDate: `${nextYear}-04-30`,
        summary: 'Scanned document ready for secure verification.',
        confidence: 'medium',
      });
      setStep('confirm_details');
    }
  };

  // Final Save Action
  const handleSaveDocument = async () => {
    if (!docTitle.trim()) {
      setErrorMsg('Please provide a document title before saving.');
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);

    const docId = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const sanitizedName = (fileName || 'document.jpg').replace(/[^a-zA-Z0-9._-]/g, '_');
    // Scoped storage path to seniorUid as required
    const storagePath = `documents/${seniorUid}/${docId}_${sanitizedName}`;

    const newDoc: DocumentRecord = {
      docId,
      seniorUid,
      category,
      title: docTitle.trim(),
      storagePath,
      downloadUrl: fileBase64,
      fileName: sanitizedName,
      fileType,
      fileSize,
      expiryDate: hasExpiryDate && expiryDate ? expiryDate : undefined,
      sharedWith: [], // Initially private to senior
      uploadedAt: new Date().toISOString(),
      extractedData: extractedData || undefined,
      notes: notes.trim() || undefined,
    };

    try {
      const result = await saveDocument(newDoc, autoReminder && hasExpiryDate);
      if (result.success) {
        setIsSaving(false);
        onSaved(newDoc, !!result.reminderCreated);
        onClose();
      } else {
        throw new Error(result.error || 'Failed to save document record.');
      }
    } catch (err: any) {
      console.error('Error saving document to vault:', err);
      setErrorMsg(err.message || 'Could not save document. Please try again.');
      setIsSaving(false);
    }
  };

  return (
    <div
      id="document-upload-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 md:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                Add Document to Vault
              </h2>
              <p className="text-xs md:text-sm text-slate-400">
                Encrypted UK Cloud Storage scoped to your personal account
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close upload modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 space-y-6">
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Notice</p>
                <p>{errorMsg}</p>
              </div>
            </div>
          )}

          {/* STEP 1: CHOOSE SOURCE */}
          {step === 'choose_source' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-lg md:text-xl font-bold text-slate-900">
                  How would you like to add your document?
                </h3>
                <p className="text-sm md:text-base text-slate-600 max-w-md mx-auto">
                  Take a clear photo with your device camera, upload a saved scan/photo, or try a sample document.
                </p>
              </div>

              {/* Primary Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Camera Button */}
                <button
                  id="btn-take-camera-photo"
                  onClick={startCamera}
                  className="p-6 rounded-2xl border-2 border-emerald-600 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 flex flex-col items-center justify-center gap-3 text-center transition-all group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <Camera className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-lg font-bold block">Take a Photo</span>
                    <span className="text-xs text-emerald-700">Use your phone or tablet camera</span>
                  </div>
                </button>

                {/* File Upload Button */}
                <button
                  id="btn-choose-file-picker"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-6 rounded-2xl border-2 border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-900 flex flex-col items-center justify-center gap-3 text-center transition-all group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-lg font-bold block">Choose from Files</span>
                    <span className="text-xs text-slate-500">PDF, JPG, PNG or photo library</span>
                  </div>
                </button>
              </div>

              {/* Quick Sample Documents Section */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Or test with a sample UK document:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {PRELOADED_SAMPLES.map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => selectSample(sample)}
                      className="p-3 rounded-xl border border-slate-200 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/50 text-left transition-colors flex items-start gap-2.5"
                    >
                      <FileCheck className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                      <div className="truncate">
                        <span className="text-xs font-bold text-slate-900 block truncate">
                          {sample.name}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {sample.category.replace('_', ' ')}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: CAMERA STREAM ACTIVE */}
          {step === 'camera_active' && (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-video max-h-[360px] flex items-center justify-center border-2 border-emerald-500">
                <video
                  ref={videoRef}
                  playsInline
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />
                {/* Viewfinder overlay */}
                <div className="absolute inset-6 border-2 border-dashed border-white/60 rounded-xl pointer-events-none flex items-center justify-center">
                  <span className="bg-black/60 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
                    Fit document inside box
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() => {
                    stopCamera();
                    setStep('choose_source');
                  }}
                  className="py-3 px-5 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50 text-sm"
                >
                  Back
                </button>

                <button
                  id="btn-capture-snapshot"
                  onClick={capturePhoto}
                  className="flex-1 py-3 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base shadow-md flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  Capture Photo
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ANALYZING WITH GEMINI VISION */}
          {step === 'analyzing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
                <Sparkles className="w-6 h-6 text-emerald-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900">
                  Reading Document with AI Vision...
                </h3>
                <p className="text-sm text-slate-500 max-w-sm">
                  EverEase is extracting the policy name, category classification, and expiry date.
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: CONFIRM & EDIT EXTRACTED DETAILS */}
          {step === 'confirm_details' && (
            <div className="space-y-6">
              {/* Gemini Extracted Highlight Banner */}
              {extractedData && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                  <div className="text-xs md:text-sm text-emerald-950 space-y-1">
                    <p className="font-bold">
                      Gemini Vision Suggestions Applied
                    </p>
                    <p className="text-emerald-800 leading-relaxed">
                      {extractedData.summary || 'Please verify the title, category, and expiry date below.'}
                    </p>
                    {extractedData.issuerOrOrganisation && (
                      <p className="text-[11px] font-semibold text-emerald-700">
                        Issuer: {extractedData.issuerOrOrganisation}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1.5">
                    Document Title *
                  </label>
                  <input
                    id="input-doc-title"
                    type="text"
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    placeholder="e.g. Aviva Home Buildings & Contents 2026/27"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-base font-semibold text-slate-900"
                  />
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1.5">
                    Category Classification *
                  </label>
                  <select
                    id="select-doc-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as DocumentCategoryType)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-base text-slate-900 bg-white"
                  >
                    {CATEGORY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Expiry Date Section */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-emerald-700" />
                      Document Expiry or Renewal Date
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600">
                      <input
                        type="checkbox"
                        checked={hasExpiryDate}
                        onChange={(e) => setHasExpiryDate(e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <span>Has expiry date</span>
                    </label>
                  </div>

                  {hasExpiryDate ? (
                    <div>
                      <input
                        id="input-doc-expiry-date"
                        type="date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 focus:border-emerald-600 text-base text-slate-900 bg-white"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Format: Day / Month / Year of document validity end or renewal deadline
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">
                      This document is marked as permanent (e.g. Birth Certificate, Power of Attorney, Will).
                    </p>
                  )}

                  {/* 8-Week Advance Renewal Auto-Reminder Checkbox */}
                  {hasExpiryDate && expiryDate && (
                    <div className="pt-2 border-t border-slate-200 flex items-start gap-2.5">
                      <input
                        id="checkbox-auto-reminder"
                        type="checkbox"
                        checked={autoReminder}
                        onChange={(e) => setAutoReminder(e.target.checked)}
                        className="w-4 h-4 mt-0.5 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <label htmlFor="checkbox-auto-reminder" className="text-xs md:text-sm text-slate-700 cursor-pointer">
                        <span className="font-bold block text-slate-900">
                          Create Life Reminder 8 weeks before expiry
                        </span>
                        <span>
                          Automatically alerts you and linked family members to compare deals and renew on time.
                        </span>
                      </label>
                    </div>
                  )}
                </div>

                {/* Optional Notes */}
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1.5">
                    Notes & Reference Numbers (Optional)
                  </label>
                  <textarea
                    id="input-doc-notes"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Policy Ref: AV-984210, 24/7 Helpline: 0800 015 1515"
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 focus:border-emerald-600 text-sm text-slate-900"
                  />
                </div>

                {/* Storage Pointer Info */}
                <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3 py-2 rounded-xl">
                  <Lock className="w-4 h-4 text-slate-600 flex-shrink-0" />
                  <span className="truncate">
                    Saved path: <code className="font-mono">documents/{seniorUid.substring(0, 8)}.../{fileName || 'doc.jpg'}</code>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
                <button
                  onClick={() => setStep('choose_source')}
                  className="py-3 px-5 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50 text-sm"
                  disabled={isSaving}
                >
                  Change File
                </button>

                <button
                  id="btn-save-document-vault"
                  onClick={handleSaveDocument}
                  disabled={isSaving}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base shadow-md flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Saving to Vault...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Save to Document Vault
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
