/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Award, CheckCircle, Clock, Heart, ArrowRight } from 'lucide-react';
import { Project, GalleryItem } from '../types';

interface ProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  isBangla: boolean;
  onSupportClick: () => void;
  onImageClick?: (items: GalleryItem[], index: number) => void;
}

export default function ProjectDetailsModal({
  isOpen,
  onClose,
  project,
  isBangla,
  onSupportClick,
  onImageClick
}: ProjectDetailsModalProps) {
  const [activeImage, setActiveImage] = useState<string>('');
  const [prevProjectId, setPrevProjectId] = useState<string>('');

  if (!project) return null;

  // Sync active image when project changes
  if (project.id !== prevProjectId) {
    setPrevProjectId(project.id);
    setActiveImage(project.image || '');
  }

  const handleSupport = () => {
    onClose();
    onSupportClick();
  };

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
            id="proj-modal-backdrop"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-[#FAFAF7] rounded-3xl max-w-4xl w-full max-h-[90vh] shadow-2xl border border-gray-200 overflow-y-auto z-10 flex flex-col"
            id="proj-modal-container"
          >
            {/* Header Sticky */}
            <div className="sticky top-0 bg-[#FAFAF7]/95 backdrop-blur-md px-6 py-4 border-b border-gray-200/50 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="bg-[#6BBF3A]/10 text-[#2E7D32] px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
                  {isBangla ? project.categoryLabelBn : project.categoryLabel}
                </span>
                <span className={`flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${
                  project.status === 'ongoing' 
                    ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                    : 'bg-green-50 text-green-700 border border-green-200'
                }`}>
                  {project.status === 'ongoing' ? <Clock size={12} /> : <CheckCircle size={12} />}
                  {isBangla ? project.statusLabelBn : project.statusLabel}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-200/50 text-gray-500 transition-colors cursor-pointer"
                aria-label="Close modal"
                id="proj-modal-close-btn"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 md:p-8 flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-visible">
              {/* Left Column: Image Gallery */}
              <div className="flex flex-col gap-4">
                <div
                  onClick={() => {
                    if (onImageClick && project) {
                      const galleryList = project.gallery && project.gallery.length > 0 ? project.gallery : [project.image];
                      const activeIdx = galleryList.indexOf(activeImage || project.image);
                      const items: GalleryItem[] = galleryList.map((img, idx) => ({
                        id: `proj-img-${idx}`,
                        title: project.title,
                        titleBn: project.titleBn,
                        category: 'campaign',
                        categoryLabel: project.categoryLabel,
                        categoryLabelBn: project.categoryLabelBn,
                        image: img,
                        date: isBangla ? 'প্রকল্পের ছবি' : 'Project Gallery'
                      }));
                      onImageClick(items, activeIdx !== -1 ? activeIdx : 0);
                    }
                  }}
                  className="relative aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-gray-900 flex items-center justify-center cursor-zoom-in group"
                >
                  {/* Blurred Ambient Cover Background */}
                  <img
                    src={activeImage || project.image}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover filter blur-md scale-110 opacity-30 select-none pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                  <img
                    src={activeImage || project.image}
                    alt={isBangla ? project.titleBn : project.title}
                    className="relative z-10 max-w-full max-h-full object-contain transition-all duration-300 group-hover:scale-[1.02]"
                    referrerPolicy="no-referrer"
                    id="proj-modal-main-img"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors flex items-center justify-center z-20">
                    <span className="bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
                      <span>🔍</span>
                      <span>{isBangla ? 'বড় করে দেখুন' : 'Click to Zoom / View Large'}</span>
                    </span>
                  </div>
                </div>
                {/* Thumbnails */}
                {project.gallery && project.gallery.length > 1 && (
                  <div className="grid grid-cols-3 gap-3" id="proj-modal-thumbnails">
                    {project.gallery.map((imgUrl, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImage(imgUrl)}
                        className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-gray-100 flex items-center justify-center ${
                          activeImage === imgUrl ? 'border-[#6BBF3A] scale-95 shadow' : 'border-transparent opacity-75 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt="Project thumbnail"
                          className="max-w-full max-h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Key Impact stat callout */}
                <div className="bg-[#1F5E2E]/5 border border-[#1F5E2E]/10 rounded-2xl p-5 mt-2 text-center">
                  <span className="text-sm font-mono font-bold text-[#1F5E2E] uppercase tracking-wider block mb-1">
                    {isBangla ? 'মূল প্রভাব' : 'Key Impact'}
                  </span>
                  <div className="text-3xl font-sans font-black text-[#1F5E2E] mb-1">
                    {isBangla ? project.impactMetricBn : project.impactMetric}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {isBangla ? project.impactLabelBn : project.impactLabel}
                  </div>
                </div>
              </div>

              {/* Right Column: Descriptions & Details */}
              <div className="flex flex-col justify-between gap-6">
                <div>
                  <h2 className="font-sans text-2xl md:text-3xl font-extrabold text-[#1F5E2E] leading-tight mb-4" id="proj-modal-title">
                    {isBangla ? project.titleBn : project.title}
                  </h2>

                  {/* Location Meta */}
                  <div className="flex items-center gap-2 text-gray-600 mb-6 font-medium">
                    <MapPin className="text-[#6BBF3A]" size={18} />
                    <span id="proj-modal-location">{isBangla ? project.locationBn : project.location}</span>
                  </div>

                  {/* Descriptions */}
                  <div className="font-sans text-gray-700 leading-relaxed space-y-4 text-sm md:text-base">
                    <p className="font-bold text-[#1F5E2E]/90 bg-[#6BBF3A]/5 border-l-4 border-[#6BBF3A] p-3 rounded-r-xl">
                      {isBangla ? project.shortDescriptionBn : project.shortDescription}
                    </p>
                    <p className="text-gray-600">
                      {isBangla ? project.fullDescriptionBn : project.fullDescription}
                    </p>
                  </div>
                </div>

                {/* Support action block */}
                <div className="border-t border-gray-200/60 pt-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                  <button
                    onClick={handleSupport}
                    className="flex-1 bg-[#1F5E2E] hover:bg-[#2E7D32] text-white font-sans font-bold py-4 px-6 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                    id="proj-modal-support-btn"
                  >
                    <Heart size={18} fill="currentColor" />
                    {isBangla ? 'এই প্রকল্পে অবদান রাখুন' : 'Support this Project'}
                  </button>
                  <button
                    onClick={onClose}
                    className="py-4 px-6 rounded-full border border-gray-300 font-sans font-semibold text-gray-700 hover:bg-gray-100 transition-colors text-center cursor-pointer"
                    id="proj-modal-close-secondary-btn"
                  >
                    {isBangla ? 'বন্ধ করুন' : 'Close'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
