/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, X, Leaf, Facebook } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  isBangla?: boolean;
  facebookLink?: string;
}

export default function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
  isBangla = false,
  facebookLink
}: SuccessModalProps) {
  // Autoclose after 6 seconds only if facebookLink is NOT provided
  useEffect(() => {
    if (isOpen && !facebookLink) {
      const timer = setTimeout(() => {
        onClose();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, facebookLink]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black"
            onClick={onClose}
            id="success-modal-backdrop"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative bg-[#FAFAF7] rounded-3xl p-8 max-w-md w-full shadow-2xl border-2 border-[#6BBF3A]/20 overflow-hidden text-center z-10"
            id="success-modal-container"
          >
            {/* Corner Leaf decorations */}
            <div className="absolute -top-12 -left-12 text-[#6BBF3A]/10 transform rotate-45">
              <Leaf size={100} />
            </div>
            <div className="absolute -bottom-12 -right-12 text-[#1F5E2E]/10 transform -rotate-12">
              <Leaf size={120} />
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200/50 text-gray-500 transition-colors"
              aria-label="Close modal"
              id="success-modal-close-btn"
            >
              <X size={20} />
            </button>

            {/* Icon animation */}
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                className="bg-[#6BBF3A]/10 p-4 rounded-full text-[#6BBF3A]"
              >
                <CheckCircle size={48} className="stroke-2" />
              </motion.div>
            </div>

            {/* Title */}
            <h3 className="font-sans text-2xl font-extrabold text-[#1F5E2E] mb-2" id="success-modal-title">
              {title}
            </h3>

            {/* Message */}
            <p className="font-sans text-gray-600 mb-6 leading-relaxed" id="success-modal-message">
              {message}
            </p>

            {/* Dynamic decorative leaf particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    x: 0,
                    y: 0,
                    opacity: 1,
                    scale: 0.5,
                    rotate: 0
                  }}
                  animate={{
                    x: (Math.random() - 0.5) * 300,
                    y: (Math.random() - 0.5) * 200 - 100,
                    opacity: 0,
                    scale: [0.5, 1, 0.2],
                    rotate: Math.random() * 360
                  }}
                  transition={{
                    delay: 0.2,
                    duration: 1.5,
                    ease: 'easeOut',
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                  className="absolute left-1/2 top-1/3 text-[#6BBF3A]"
                >
                  <Leaf size={16} fill="currentColor" />
                </motion.div>
              ))}
            </div>

            {/* Facebook Link if provided */}
            {facebookLink && (
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                href={facebookLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white font-sans font-bold py-3.5 px-6 rounded-2xl shadow-md transition-all cursor-pointer mb-4"
                id="success-modal-fb-btn"
              >
                <Facebook size={18} fill="currentColor" />
                <span>{isBangla ? 'ফেসবুকে আমাদের সাথে যুক্ত হোন' : 'Connect on Facebook'}</span>
              </motion.a>
            )}

            {/* Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="bg-[#1F5E2E] hover:bg-[#2E7D32] text-white font-sans font-bold py-3 px-8 rounded-full shadow-lg transition-colors cursor-pointer w-full"
              id="success-modal-action-btn"
            >
              {isBangla ? 'ঠিক আছে' : 'Awesome!'}
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
