import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, Bell } from 'lucide-react';

interface AnnouncementPopupProps {
  settings: any;
  isBangla: boolean;
}

export default function AnnouncementPopup({ settings, isBangla }: AnnouncementPopupProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (settings && settings.popupEnabled === true) {
      // Check if this specific announcement has already been dismissed by the user in this session/browser
      const popupKey = `green-earth-popup-dismissed-${settings.popupTitle || 'default'}`;
      const dismissed = localStorage.getItem(popupKey);
      if (!dismissed) {
        // Show after a slight delay for better transition flow
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [settings]);

  const handleClose = () => {
    setIsOpen(false);
    if (settings) {
      const popupKey = `green-earth-popup-dismissed-${settings.popupTitle || 'default'}`;
      localStorage.setItem(popupKey, 'true');
    }
  };

  if (!isOpen || !settings || !settings.popupEnabled) return null;

  const title = isBangla ? (settings.popupTitleBn || settings.popupTitle) : (settings.popupTitle || settings.popupTitleBn);
  const message = isBangla ? (settings.popupMessageBn || settings.popupMessage) : (settings.popupMessage || settings.popupMessageBn);
  const linkText = isBangla ? (settings.popupLinkTextBn || 'বিস্তারিত দেখুন') : (settings.popupLinkText || 'Learn More');
  const linkUrl = settings.popupLinkUrl || '';
  const imageUrl = settings.popupImageUrl || '';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="announcement-popup-overlay">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
        />

        {/* Popup Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl border border-gray-100 flex flex-col z-10 text-left font-sans"
          id="announcement-popup-card"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-20 p-2.5 bg-black/10 hover:bg-black/25 text-white md:text-gray-500 md:bg-gray-100 md:hover:bg-gray-200 rounded-full transition-all cursor-pointer"
            aria-label="Close Announcement"
          >
            <X size={16} className="stroke-[2.5]" />
          </button>

          {/* Visual Banner (if available) */}
          {imageUrl ? (
            <div className="w-full h-48 sm:h-56 relative overflow-hidden bg-emerald-950/10 flex items-center justify-center">
              <img
                src={imageUrl}
                alt={title}
                className="max-w-full max-h-full object-contain"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                <span className="bg-[#6BBF3A] text-white text-[10px] font-mono font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <Bell size={10} className="animate-bounce" />
                  <span>{isBangla ? 'বিশেষ ঘোষণা' : 'Special Notice'}</span>
                </span>
              </div>
            </div>
          ) : (
            <div className="p-6 pb-0 flex items-center gap-3">
              <div className="p-3 bg-[#6BBF3A]/10 text-[#1F5E2E] rounded-2xl">
                <Bell size={24} className="animate-bounce" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-black uppercase tracking-wider text-[#6BBF3A] bg-[#6BBF3A]/10 px-2.5 py-0.5 rounded-full">
                  {isBangla ? 'বিশেষ ঘোষণা' : 'Special Notice'}
                </span>
              </div>
            </div>
          )}

          {/* Body Content */}
          <div className="p-6 sm:p-8 space-y-4">
            <h3 className="text-xl sm:text-2xl font-black text-[#1F5E2E] leading-tight tracking-tight">
              {title || (isBangla ? 'নতুন নোটিশ' : 'Announcement')}
            </h3>

            <p className="text-sm text-gray-600 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap pr-1 font-medium">
              {message}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {linkUrl && (
                <a
                  href={linkUrl}
                  onClick={handleClose}
                  className="flex-1 bg-[#1F5E2E] hover:bg-[#2E7D32] text-white font-sans font-black py-3.5 px-6 rounded-full shadow-md hover:shadow-lg transition-all text-center flex items-center justify-center gap-2 text-sm cursor-pointer"
                  id="popup-action-btn"
                >
                  <span>{linkText}</span>
                  <ArrowRight size={16} />
                </a>
              )}
              <button
                onClick={handleClose}
                className={`flex-1 py-3.5 px-6 rounded-full border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 font-sans font-bold text-center text-sm transition-all cursor-pointer ${!linkUrl ? 'w-full' : ''}`}
                id="popup-close-btn"
              >
                {isBangla ? 'বন্ধ করুন' : 'Dismiss'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
