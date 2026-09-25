import React, { useState, useEffect, useRef } from 'react';
import API from '../services/api';
import {
  X,
  Save,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  Trash2,
  CheckCircle2,
  MapPin,
  Clock3,
  Sparkles,
  Eye,
  EyeOff,
} from 'lucide-react';

const CATEGORIES = [
  'Religious',
  'Heritage',
  'Nature',
  'Cultural',
  'Museum',
  'Recreational',
  'Restaurant',
  'Public Place',
];

const PlaceFormModal = ({ isOpen, onClose, onSave, placeToEdit }) => {
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Religious',
    address: '',
    lat: '',
    lng: '',
    openingTime: '06:00',
    closingTime: '18:30',
    visitDuration: 60,
    entryFee: 'Free',
    contactNumber: '',
    imageUrl: '',
    travelTips: '',
    dressCode: 'Modest clothing covering shoulders and knees.',
    facilities: '',
    bestVisitTime: 'Morning or late afternoon',
    isActive: true,
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Populate form if editing
  useEffect(() => {
    if (placeToEdit) {
      setFormData({
        name: placeToEdit.name || '',
        description: placeToEdit.description || '',
        category: placeToEdit.category || 'Religious',
        address: placeToEdit.address || '',
        lat: placeToEdit.coordinates?.lat || '',
        lng: placeToEdit.coordinates?.lng || '',
        openingTime: placeToEdit.openingTime || '06:00',
        closingTime: placeToEdit.closingTime || '18:30',
        visitDuration: placeToEdit.visitDuration || 60,
        entryFee: placeToEdit.entryFee || 'Free',
        contactNumber: placeToEdit.contactNumber || '',
        imageUrl: placeToEdit.images?.[0] || '',
        travelTips: placeToEdit.travelTips || '',
        dressCode: placeToEdit.dressCode || 'Modest clothing covering shoulders and knees.',
        facilities: placeToEdit.facilities?.join(', ') || '',
        bestVisitTime: placeToEdit.bestVisitTime || 'Morning or late afternoon',
        isActive: placeToEdit.isActive !== undefined ? placeToEdit.isActive : true,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        category: 'Religious',
        address: '',
        lat: '',
        lng: '',
        openingTime: '06:00',
        closingTime: '18:30',
        visitDuration: 60,
        entryFee: 'Free',
        contactNumber: '',
        imageUrl: '',
        travelTips: '',
        dressCode: 'Modest clothing covering shoulders and knees.',
        facilities: '',
        bestVisitTime: 'Morning or late afternoon',
        isActive: true,
      });
    }
    setError('');
    setUploadSuccess(false);
  }, [placeToEdit, isOpen]);

  if (!isOpen) return null;

  // Handle Image File Upload
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return setError('Image file is too large! Please choose an image under 5MB.');
    }

    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    try {
      setUploadingImage(true);
      setError('');
      setUploadSuccess(false);

      const res = await API.post('/upload', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setFormData((prev) => ({ ...prev, imageUrl: res.data.imageUrl }));
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.description.trim() || !formData.address.trim()) {
      return setError('Please provide place name, description, and address.');
    }

    const latNum = parseFloat(formData.lat);
    const lngNum = parseFloat(formData.lng);
    if (isNaN(latNum) || isNaN(lngNum)) {
      return setError('Please provide valid decimal coordinates for Latitude and Longitude.');
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        address: formData.address.trim(),
        coordinates: { lat: latNum, lng: lngNum },
        openingTime: formData.openingTime,
        closingTime: formData.closingTime,
        visitDuration: Number(formData.visitDuration) || 60,
        entryFee: formData.entryFee.trim(),
        contactNumber: formData.contactNumber.trim(),
        images: formData.imageUrl.trim() ? [formData.imageUrl.trim(), ...(placeToEdit?.images?.slice(1) || [])] : [],
        travelTips: formData.travelTips.trim(),
        dressCode: formData.dressCode.trim(),
        facilities: formData.facilities
          .split(',')
          .map((f) => f.trim())
          .filter(Boolean),
        bestVisitTime: formData.bestVisitTime.trim(),
        isActive: formData.isActive,
      };

      await onSave(payload, placeToEdit?._id);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save place record.');
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass = `
    w-full rounded-xl border border-stone-200
    bg-white px-3.5 py-2.5
    text-[13px] font-medium text-stone-800
    outline-none transition-all duration-200
    placeholder:text-stone-400
    hover:border-stone-300
    focus:border-amber-400
    focus:ring-4 focus:ring-amber-500/10
    dark:border-stone-700
    dark:bg-stone-900
    dark:text-stone-100
    dark:placeholder:text-stone-500
    dark:hover:border-stone-600
  `;

  const labelClass = `
    mb-1.5 block text-[11px] font-black
    uppercase tracking-[0.06em]
    text-stone-600
    dark:text-stone-300
  `;

  const sectionClass = `
    rounded-[22px]
    border border-stone-200/80
    bg-stone-50/70
    p-4 sm:p-5
    shadow-[0_6px_24px_rgba(28,25,23,0.035)]
    dark:border-stone-800
    dark:bg-stone-900/45
  `;

  return (
    <div
      className="
        fixed inset-0 z-[80]
        flex items-center justify-center
        overflow-y-auto
        bg-stone-950/70
        p-2 sm:p-4
        backdrop-blur-md
        animate-in fade-in duration-200
      "
    >
      <div
        className="
          flex max-h-[94vh] w-full max-w-4xl flex-col
          overflow-hidden
          rounded-[28px]
          border border-white/70
          bg-white
          shadow-[0_35px_100px_rgba(0,0,0,0.32)]
          dark:border-stone-800
          dark:bg-stone-950
          animate-in zoom-in-95 duration-200
        "
      >
        {/* =====================================================
            PREMIUM MODAL HEADER
        ===================================================== */}

        <div
          className="
            relative shrink-0 overflow-hidden
            border-b border-stone-200/80
            bg-gradient-to-r
            from-[#fffaf1]
            via-white
            to-[#fff8ed]
            px-5 py-4
            sm:px-6
            dark:border-stone-800
            dark:from-stone-900
            dark:via-stone-950
            dark:to-stone-900
          "
        >
          <div className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-amber-300/20 blur-3xl dark:bg-amber-500/5" />

          <div className="relative flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div
                className="
                  flex h-11 w-11 shrink-0 items-center justify-center
                  rounded-2xl
                  bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500
                  text-stone-950
                  shadow-[0_10px_24px_rgba(245,158,11,0.25)]
                "
              >
                {placeToEdit ? (
                  <Save className="h-5 w-5" />
                ) : (
                  <Sparkles className="h-5 w-5" />
                )}
              </div>

              <div className="min-w-0">
                <div className="mb-1 flex items-center gap-2">
                  <span
                    className="
                      rounded-full
                      border border-amber-200
                      bg-amber-50
                      px-2.5 py-1
                      text-[8px] font-black uppercase tracking-[0.14em]
                      text-amber-700
                      dark:border-amber-900/50
                      dark:bg-amber-950/30
                      dark:text-amber-300
                    "
                  >
                    Place Manager
                  </span>
                </div>

                <h3
                  className="
                    truncate text-[18px] font-black
                    tracking-[-0.025em]
                    text-stone-950
                    sm:text-xl
                    dark:text-white
                  "
                >
                  {placeToEdit
                    ? 'Edit Place Information'
                    : 'Add New Place of Interest'}
                </h3>

                <p className="mt-0.5 hidden text-[10px] font-medium text-stone-400 sm:block">
                  {placeToEdit
                    ? 'Update visitor information without changing existing place logic.'
                    : 'Create a complete visitor-ready place record for RajaRata DayTrail.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              title="Close"
              className="
                flex h-10 w-10 shrink-0 items-center justify-center
                rounded-xl
                border border-stone-200
                bg-white
                text-stone-400
                shadow-sm
                transition-all duration-200
                hover:border-red-200
                hover:bg-red-50
                hover:text-red-600
                dark:border-stone-700
                dark:bg-stone-900
                dark:hover:border-red-900/50
                dark:hover:bg-red-950/30
                dark:hover:text-red-400
              "
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* =====================================================
            FORM
        ===================================================== */}

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          {/* Scrollable form body */}
          <div
            className="
              min-h-0 flex-1 overflow-y-auto
              bg-white
              px-4 py-5
              sm:px-6 sm:py-6
              dark:bg-stone-950
              [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-thumb]:bg-stone-300
              dark:[&::-webkit-scrollbar-thumb]:bg-stone-700
            "
          >
            <div className="space-y-5">
              {/* Error */}
              {error && (
                <div
                  className="
                    flex items-start gap-3
                    rounded-2xl
                    border border-red-200
                    bg-red-50
                    px-4 py-3.5
                    text-[12px] font-semibold
                    text-red-700
                    shadow-sm
                    dark:border-red-900/50
                    dark:bg-red-950/30
                    dark:text-red-300
                  "
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300">
                    <AlertCircle className="h-4 w-4" />
                  </div>

                  <div>
                    <div className="font-black">Please check this form</div>
                    <div className="mt-0.5 font-medium">{error}</div>
                  </div>
                </div>
              )}

              {/* =================================================
                  BASIC DETAILS
              ================================================= */}

              <section className={sectionClass}>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-950 text-white shadow-sm dark:bg-white dark:text-stone-950">
                    <Sparkles className="h-4 w-4" />
                  </div>

                  <div>
                    <h4 className="text-[13px] font-black text-stone-950 dark:text-white">
                      Basic Information
                    </h4>
                    <p className="mt-0.5 text-[10px] text-stone-400">
                      Main identity and category of the attraction
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Place Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g. Mirisavetiya Stupa"
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value,
                        })
                      }
                      className={fieldClass}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              {/* =================================================
                  PHOTO
              ================================================= */}

              <section className={sectionClass}>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700 ring-1 ring-amber-100 dark:bg-amber-950/30 dark:text-amber-300 dark:ring-amber-900/40">
                    <ImageIcon className="h-4 w-4" />
                  </div>

                  <div>
                    <h4 className="text-[13px] font-black text-stone-950 dark:text-white">
                      Attraction Photo
                    </h4>
                    <p className="mt-0.5 text-[10px] text-stone-400">
                      Upload a file or use an existing online image URL
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-[170px_minmax(0,1fr)]">
                  {/* Preview */}
                  <div
                    className="
                      group relative
                      h-[170px] overflow-hidden
                      rounded-[20px]
                      border border-stone-200
                      bg-gradient-to-br from-stone-100 to-stone-50
                      shadow-[0_10px_28px_rgba(28,25,23,0.08)]
                      dark:border-stone-700
                      dark:from-stone-800
                      dark:to-stone-900
                    "
                  >
                    {formData.imageUrl ? (
                      <>
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/65 to-transparent" />

                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          title="Remove image"
                          className="
                            absolute bottom-3 right-3
                            flex h-9 w-9 items-center justify-center
                            rounded-xl
                            border border-white/20
                            bg-black/55
                            text-white
                            shadow-lg
                            backdrop-blur-md
                            transition-all
                            hover:bg-red-600
                          "
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>

                        <span
                          className="
                            absolute bottom-3 left-3
                            rounded-full
                            bg-black/50
                            px-2.5 py-1
                            text-[9px] font-bold
                            text-white/90
                            backdrop-blur-md
                          "
                        >
                          Current preview
                        </span>
                      </>
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-stone-400 shadow-sm dark:bg-stone-800">
                          <ImageIcon className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] font-bold text-stone-400">
                          No image selected
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Upload controls */}
                  <div
                    className="
                      flex min-w-0 flex-col justify-center
                      rounded-[20px]
                      border border-dashed border-stone-300
                      bg-white
                      p-4
                      dark:border-stone-700
                      dark:bg-stone-900/60
                    "
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      className="hidden"
                    />

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        disabled={uploadingImage}
                        onClick={() => fileInputRef.current?.click()}
                        className="
                          inline-flex items-center gap-2
                          rounded-xl
                          bg-stone-950
                          px-4 py-2.5
                          text-[11px] font-black
                          text-white
                          shadow-md
                          transition-all duration-200
                          hover:-translate-y-0.5
                          hover:bg-stone-800
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                          dark:bg-white
                          dark:text-stone-950
                          dark:hover:bg-stone-200
                        "
                      >
                        <Upload className="h-3.5 w-3.5" />
                        {uploadingImage
                          ? 'Uploading Image...'
                          : 'Choose Image File'}
                      </button>

                      {uploadSuccess && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1.5 text-[10px] font-black text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Image uploaded
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-[10px] leading-5 text-stone-400">
                      JPEG, PNG or WebP. Maximum file size: 5 MB.
                    </p>

                    <div className="my-3 flex items-center gap-3">
                      <div className="h-px flex-1 bg-stone-200 dark:bg-stone-700" />
                      <span className="text-[9px] font-black uppercase tracking-[0.12em] text-stone-400">
                        or use URL
                      </span>
                      <div className="h-px flex-1 bg-stone-200 dark:bg-stone-700" />
                    </div>

                    <input
                      type="text"
                      value={formData.imageUrl}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          imageUrl: e.target.value,
                        })
                      }
                      placeholder="https://images.unsplash.com/... or /uploads/..."
                      className={fieldClass}
                    />
                  </div>
                </div>
              </section>

              {/* =================================================
                  VISITOR CONTENT
              ================================================= */}

              <section className={sectionClass}>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600 ring-1 ring-orange-100 dark:bg-orange-950/30 dark:text-orange-300 dark:ring-orange-900/40">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>

                  <div>
                    <h4 className="text-[13px] font-black text-stone-950 dark:text-white">
                      Visitor Information
                    </h4>
                    <p className="mt-0.5 text-[10px] text-stone-400">
                      Description, practical guidance and cultural etiquette
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Description *</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Detailed historical and practical overview..."
                      className={`${fieldClass} resize-y leading-6`}
                    />
                  </div>

                  <div>
                    <label htmlFor="travelTips" className={labelClass}>
                      Travel Tips and Visitor Guidance
                    </label>

                    <textarea
                      id="travelTips"
                      value={formData.travelTips}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          travelTips: e.target.value,
                        })
                      }
                      rows={3}
                      className={`${fieldClass} resize-y leading-6`}
                      placeholder="Record verified travel, footwear, photography or safety guidance for this place."
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Cultural Dress Code & Etiquette *
                    </label>

                    <input
                      type="text"
                      required
                      value={formData.dressCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dressCode: e.target.value,
                        })
                      }
                      placeholder="e.g. Modest white attire covering shoulders and knees."
                      className={fieldClass}
                    />
                  </div>
                </div>
              </section>

              {/* =================================================
                  LOCATION
              ================================================= */}

              <section className={sectionClass}>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 ring-1 ring-rose-100 dark:bg-rose-950/30 dark:text-rose-300 dark:ring-rose-900/40">
                    <MapPin className="h-4 w-4" />
                  </div>

                  <div>
                    <h4 className="text-[13px] font-black text-stone-950 dark:text-white">
                      Location Details
                    </h4>
                    <p className="mt-0.5 text-[10px] text-stone-400">
                      Public address and exact map coordinates
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className={labelClass}>Address *</label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: e.target.value,
                        })
                      }
                      placeholder="Sacred City, Anuradhapura"
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Latitude (Lat) *</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={formData.lat}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lat: e.target.value,
                        })
                      }
                      placeholder="8.3448"
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Longitude (Lng) *</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={formData.lng}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lng: e.target.value,
                        })
                      }
                      placeholder="80.3965"
                      className={fieldClass}
                    />
                  </div>
                </div>
              </section>

              {/* =================================================
                  VISIT DETAILS
              ================================================= */}

              <section className={sectionClass}>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-sky-100 dark:bg-sky-950/30 dark:text-sky-300 dark:ring-sky-900/40">
                    <Clock3 className="h-4 w-4" />
                  </div>

                  <div>
                    <h4 className="text-[13px] font-black text-stone-950 dark:text-white">
                      Visit Details
                    </h4>
                    <p className="mt-0.5 text-[10px] text-stone-400">
                      Opening hours, fees, facilities and best visit window
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <label className={labelClass}>Opening Time *</label>
                    <input
                      type="time"
                      required
                      value={formData.openingTime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          openingTime: e.target.value,
                        })
                      }
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Closing Time *</label>
                    <input
                      type="time"
                      required
                      value={formData.closingTime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          closingTime: e.target.value,
                        })
                      }
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Duration (mins) *</label>
                    <input
                      type="number"
                      min="10"
                      step="5"
                      required
                      value={formData.visitDuration}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          visitDuration: e.target.value,
                        })
                      }
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Entry Fee</label>
                    <input
                      type="text"
                      value={formData.entryFee}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          entryFee: e.target.value,
                        })
                      }
                      placeholder="Free / LKR 200"
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Contact Phone</label>
                    <input
                      type="text"
                      value={formData.contactNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactNumber: e.target.value,
                        })
                      }
                      placeholder="+94 25 222 1234"
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Best Visit Time</label>
                    <input
                      type="text"
                      value={formData.bestVisitTime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bestVisitTime: e.target.value,
                        })
                      }
                      placeholder="Early morning or sunset"
                      className={fieldClass}
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className={labelClass}>
                      Facilities (comma-separated)
                    </label>

                    <input
                      type="text"
                      value={formData.facilities}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          facilities: e.target.value,
                        })
                      }
                      placeholder="Parking, Restrooms, Shoe Stand"
                      className={fieldClass}
                    />
                  </div>
                </div>
              </section>

              {/* =================================================
                  PUBLIC STATUS
              ================================================= */}

              <section
                className="
                  rounded-[22px]
                  border border-emerald-200/80
                  bg-gradient-to-r
                  from-emerald-50
                  to-white
                  p-4 sm:p-5
                  dark:border-emerald-900/40
                  dark:from-emerald-950/20
                  dark:to-stone-900
                "
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`
                        flex h-10 w-10 shrink-0 items-center justify-center
                        rounded-xl
                        ${
                          formData.isActive
                            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300'
                            : 'bg-stone-200 text-stone-500 dark:bg-stone-800 dark:text-stone-400'
                        }
                      `}
                    >
                      {formData.isActive ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <label
                        htmlFor="isActive"
                        className="block cursor-pointer text-[12px] font-black text-stone-900 dark:text-white"
                      >
                        Public Visibility
                      </label>

                      <p className="mt-0.5 text-[10px] leading-5 text-stone-500 dark:text-stone-400">
                        {formData.isActive
                          ? 'This place is visible to public visitors.'
                          : 'This place is hidden from public visitors.'}
                      </p>
                    </div>
                  </div>

                  <label
                    htmlFor="isActive"
                    className="relative inline-flex shrink-0 cursor-pointer items-center"
                  >
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isActive: e.target.checked,
                        })
                      }
                      className="peer sr-only"
                    />

                    <span
                      className="
                        h-7 w-12 rounded-full
                        bg-stone-300
                        transition-colors duration-200
                        peer-checked:bg-emerald-500
                        peer-focus-visible:ring-4
                        peer-focus-visible:ring-emerald-500/20
                        dark:bg-stone-700
                      "
                    />

                    <span
                      className="
                        pointer-events-none
                        absolute left-1 top-1
                        h-5 w-5 rounded-full
                        bg-white
                        shadow-md
                        transition-transform duration-200
                        peer-checked:translate-x-5
                      "
                    />
                  </label>
                </div>
              </section>
            </div>
          </div>

          {/* =====================================================
              STICKY ACTION BAR
          ===================================================== */}

          <div
            className="
              shrink-0
              border-t border-stone-200/80
              bg-white/95
              px-4 py-4
              backdrop-blur-xl
              sm:px-6
              dark:border-stone-800
              dark:bg-stone-950/95
            "
          >
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="hidden max-w-sm text-[9px] leading-4 text-stone-400 sm:block">
                Fields marked with * are required. Changes become available
                after the place record is saved successfully.
              </p>

              <div className="flex w-full items-center gap-2 sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="
                    flex-1 rounded-xl
                    border border-stone-200
                    bg-white
                    px-4 py-2.5
                    text-[11px] font-black
                    text-stone-600
                    shadow-sm
                    transition-all duration-200
                    hover:bg-stone-50
                    hover:text-stone-950
                    sm:flex-none
                    dark:border-stone-700
                    dark:bg-stone-900
                    dark:text-stone-300
                    dark:hover:bg-stone-800
                    dark:hover:text-white
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting || uploadingImage}
                  className="
                    group flex flex-1 items-center justify-center gap-2
                    rounded-xl
                    bg-gradient-to-r from-amber-500 to-orange-500
                    px-5 py-2.5
                    text-[11px] font-black
                    text-stone-950
                    shadow-[0_10px_24px_rgba(245,158,11,0.25)]
                    transition-all duration-200
                    hover:-translate-y-0.5
                    hover:shadow-[0_14px_30px_rgba(245,158,11,0.34)]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    disabled:hover:translate-y-0
                    sm:flex-none
                  "
                >
                  <Save className="h-3.5 w-3.5" />
                  {submitting
                    ? 'Saving...'
                    : placeToEdit
                      ? 'Update Place'
                      : 'Create Place'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlaceFormModal;
