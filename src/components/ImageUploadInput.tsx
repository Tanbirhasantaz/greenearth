import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface ImageUploadInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  filenamePrefix?: string;
  isBangla?: boolean;
}

export default function ImageUploadInput({
  label,
  value,
  onChange,
  placeholder = 'https://images.unsplash.com/...',
  filenamePrefix = 'upload',
  isBangla = false
}: ImageUploadInputProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    // 15MB Limit
    const maxSizeBytes = 15 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(
        isBangla
          ? 'ছবির সাইজ ১৫ মেগাবাইট (15MB) এর বেশি হতে পারবে না।'
          : 'Image size exceeds the 15MB limit.'
      );
      return;
    }

    setIsUploading(true);
    setError(null);

    // Convert file to base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const base64Data = reader.result as string;

        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: base64Data,
            filename: `${filenamePrefix}_${file.name.split('.')[0]}`
          }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Upload failed');
        }

        const data = await response.json();
        if (data.success && data.url) {
          onChange(data.url);
        } else {
          throw new Error('No URL returned from server');
        }
      } catch (err: any) {
        console.error('Upload error:', err);
        setError(
          isBangla
            ? 'ছবি আপলোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।'
            : `Failed to upload image: ${err.message || 'Server error'}`
        );
      } finally {
        setIsUploading(false);
      }
    };

    reader.onerror = () => {
      setError(isBangla ? 'ফাইল পড়তে সমস্যা হয়েছে।' : 'Error reading file.');
      setIsUploading(false);
    };
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => {
    onChange('');
    setError(null);
  };

  return (
    <div className="flex flex-col gap-2 w-full text-left">
      <div className="flex justify-between items-center">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          {label}
        </label>
        {value && (
          <button
            type="button"
            onClick={removeImage}
            className="text-[11px] text-red-500 hover:text-red-700 font-bold uppercase flex items-center gap-1 cursor-pointer"
          >
            <X size={12} />
            <span>{isBangla ? 'মুছে ফেলুন' : 'Remove'}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch">
        {/* Left Column: Current Image Preview or Placeholder */}
        <div className="md:col-span-1 border border-gray-200 rounded-xl bg-gray-50 overflow-hidden flex items-center justify-center relative aspect-video md:aspect-auto h-full min-h-[110px]">
          {value ? (
            <div className="relative w-full h-full group">
              <img
                src={value}
                alt="Uploaded preview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-[10px] text-white font-mono bg-black/60 px-2 py-1 rounded">
                  {isBangla ? 'বর্তমানে সচল' : 'Active Image'}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 text-gray-400 p-4">
              <ImageIcon size={28} className="stroke-1.5" />
              <span className="text-[11px] font-medium">
                {isBangla ? 'কোনো ছবি নেই' : 'No Image'}
              </span>
            </div>
          )}
        </div>

        {/* Right Column: Drag-and-Drop Area & Fallback text input */}
        <div className="md:col-span-2 flex flex-col gap-2 justify-between">
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={triggerFileSelect}
            className={`border border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all h-full ${
              isUploading
                ? 'border-[#6BBF3A] bg-green-50/20 pointer-events-none'
                : 'border-gray-300 hover:border-[#6BBF3A] hover:bg-gray-50/50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileChange}
              accept="image/*"
              className="hidden"
            />

            {isUploading ? (
              <div className="flex flex-col items-center gap-1.5 text-[#1F5E2E]">
                <Loader2 size={24} className="animate-spin text-[#6BBF3A]" />
                <span className="text-xs font-bold font-mono">
                  {isBangla ? 'আপলোড হচ্ছে...' : 'Uploading image...'}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center">
                <Upload size={20} className="text-gray-400 mb-1" />
                <p className="text-xs font-bold text-gray-700">
                  {isBangla ? 'ছবি আপলোড করতে ক্লিক করুন' : 'Click to upload photo'}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {isBangla ? 'অথবা ড্র্যাগ অ্যান্ড ড্রপ করুন (সর্বোচ্চ ১৫MB)' : 'or drag & drop here (Max 15MB)'}
                </p>
              </div>
            )}
          </div>

          {/* Text Input for direct URL fallback */}
          <div className="relative">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-600 focus:bg-white transition-all font-mono"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-gray-400 font-mono font-bold bg-gray-200/50 px-1.5 py-0.5 rounded pointer-events-none uppercase">
              {isBangla ? 'অথবা ইউআরএল' : 'or URL'}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium mt-1 bg-red-50 p-2 rounded-lg border border-red-100">
          <AlertCircle size={14} className="shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
