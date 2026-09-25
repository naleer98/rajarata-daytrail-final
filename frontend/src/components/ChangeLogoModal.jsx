import React, { useState, useRef } from 'react';
import API from '../services/api';
import { X, Upload, RotateCcw, CheckCircle2, Image as ImageIcon, Sparkles } from 'lucide-react';

const ChangeLogoModal = ({ isOpen, onClose }) => {
  const fileInputRef = useRef(null);
  const [logoPreview, setLogoPreview] = useState(
    localStorage.getItem('rajarata_custom_logo') || ''
  );
  const [logoUrl, setLogoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  // Handle direct file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert file to base64 for instant local preview and offline persistence
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64Data = uploadEvent.target.result;
      setLogoPreview(base64Data);
    };
    reader.readAsDataURL(file);

    // Also upload to server backend
    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      const res = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.imageUrl) {
        setLogoPreview(res.data.imageUrl);
      }
    } catch (err) {
      console.error('File upload failed, keeping base64 fallback:', err);
    } finally {
      setUploading(false);
    }
  };

  // Save Logo
  const handleSaveLogo = () => {
    const finalLogo = logoUrl.trim() || logoPreview;
    if (finalLogo) {
      localStorage.setItem('rajarata_custom_logo', finalLogo);
    } else {
      localStorage.removeItem('rajarata_custom_logo');
    }

    // Trigger update across all components (Navbar, Footer, etc.)
    window.dispatchEvent(new Event('rajarata_logo_changed'));

    setSuccessMsg('Logo updated successfully!');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  // Reset to original default animated compass logo
  const handleResetDefault = () => {
    localStorage.removeItem('rajarata_custom_logo');
    setLogoPreview('');
    setLogoUrl('');
    window.dispatchEvent(new Event('rajarata_logo_changed'));
    setSuccessMsg('Restored to default brand icon!');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 w-full max-w-md rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <h3 className="font-extrabold text-base text-stone-900 dark:text-white">
              Change Application Logo
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-2xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Current Preview */}
        <div className="flex flex-col items-center justify-center p-6 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800">
          <span className="text-[10px] uppercase font-bold text-stone-400 mb-3 block">
            Logo Live Preview
          </span>
          <div className="w-20 h-20 rounded-2xl bg-white dark:bg-stone-800 p-2 shadow-md border border-stone-200 dark:border-stone-700 flex items-center justify-center overflow-hidden">
            {logoPreview ? (
              <img src={logoPreview} alt="Preview" className="w-full h-full object-contain" />
            ) : (
              <ImageIcon className="w-8 h-8 text-stone-400" />
            )}
          </div>
          <span className="text-xs text-stone-500 mt-2">
            {logoPreview ? 'Custom logo selected' : 'Default animated icon in use'}
          </span>
        </div>

        {/* Upload Buttons */}
        <div className="space-y-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />

          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2.5 bg-stone-900 dark:bg-stone-800 hover:bg-stone-800 dark:hover:bg-stone-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Upload className="w-4 h-4 text-amber-400" />
            {uploading ? 'Uploading...' : 'Upload Logo from Computer (PNG/JPG)'}
          </button>

          <div className="text-[11px] text-stone-400 text-center font-medium">
            — OR PASTE IMAGE URL —
          </div>

          <input
            type="url"
            value={logoUrl}
            onChange={(e) => {
              setLogoUrl(e.target.value);
              if (e.target.value) setLogoPreview(e.target.value);
            }}
            placeholder="https://example.com/my-logo.png"
            className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 rounded-xl text-xs text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetDefault}
            className="px-3 py-2 text-stone-500 hover:text-red-600 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Default
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveLogo}
              className="px-5 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-black shadow-md transition-all hover:scale-102"
            >
              Apply Logo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeLogoModal;