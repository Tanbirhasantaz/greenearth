/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, User, Clock, Share2, Facebook, Twitter, MessageSquare, ArrowLeft } from 'lucide-react';
import { BlogPost } from '../types';

interface BlogDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: BlogPost | null;
  isBangla: boolean;
}

export default function BlogDetailsModal({
  isOpen,
  onClose,
  post,
  isBangla
}: BlogDetailsModalProps) {
  if (!post) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
            id="blog-modal-backdrop"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-[#FAFAF7] rounded-3xl max-w-3xl w-full max-h-[90vh] shadow-2xl border border-gray-200 overflow-y-auto z-10 flex flex-col"
            id="blog-modal-container"
          >
            {/* Header Sticky */}
            <div className="sticky top-0 bg-[#FAFAF7]/95 backdrop-blur-md px-6 py-4 border-b border-gray-200/50 flex items-center justify-between z-10">
              <span className="bg-[#6BBF3A]/10 text-[#2E7D32] px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
                {isBangla ? post.categoryBn : post.category}
              </span>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-200/50 text-gray-500 transition-colors cursor-pointer"
                aria-label="Close modal"
                id="blog-modal-close-btn"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 md:p-8 flex-1">
              {/* Meta Data */}
              <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-500 mb-4 items-center">
                <span className="flex items-center gap-1">
                  <Calendar size={14} className="text-[#6BBF3A]" />
                  {isBangla ? post.dateBn : post.date}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                <span className="flex items-center gap-1">
                  <User size={14} className="text-[#6BBF3A]" />
                  {isBangla ? post.authorBn : post.author}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                <span className="flex items-center gap-1">
                  <Clock size={14} className="text-[#6BBF3A]" />
                  {isBangla ? post.readTimeBn : post.readTime}
                </span>
              </div>

              {/* Title */}
              <h2 className="font-sans text-2xl md:text-4xl font-extrabold text-[#1F5E2E] leading-tight mb-6" id="blog-modal-title">
                {isBangla ? post.titleBn : post.title}
              </h2>

              {/* Featured Image */}
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-md border border-gray-200 mb-6">
                <img
                  src={post.image}
                  alt={isBangla ? post.titleBn : post.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  id="blog-modal-main-img"
                />
              </div>

              {/* Content text */}
              <div className="font-sans text-gray-700 leading-relaxed space-y-6 text-sm md:text-base border-b border-gray-200/60 pb-8 mb-6">
                {/* Break paragraphs and render */}
                {(isBangla ? post.contentBn : post.content).split('\n\n').map((paragraph, index) => (
                  <p key={index} className="first-letter:text-xl first-letter:font-extrabold first-letter:text-[#1F5E2E] first-letter:mr-1">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Share & Footer inside Modal */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {isBangla ? 'শেয়ার করুন:' : 'Share Article:'}
                  </span>
                  <div className="flex gap-2">
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                      title="Facebook"
                    >
                      <Facebook size={16} fill="currentColor" />
                    </a>
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-sky-50 text-sky-500 hover:bg-sky-100 transition-colors"
                      title="Twitter"
                    >
                      <Twitter size={16} fill="currentColor" />
                    </a>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert(isBangla ? 'লিঙ্ক কপি করা হয়েছে!' : 'Link copied to clipboard!');
                      }}
                      className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                      title="Copy Link"
                    >
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="bg-[#1F5E2E] hover:bg-[#2E7D32] text-white font-sans font-bold py-3 px-6 rounded-full shadow transition-all text-sm flex items-center justify-center gap-1 cursor-pointer"
                  id="blog-modal-back-btn"
                >
                  <ArrowLeft size={16} />
                  {isBangla ? 'তালিকায় ফিরে যান' : 'Back to News'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
