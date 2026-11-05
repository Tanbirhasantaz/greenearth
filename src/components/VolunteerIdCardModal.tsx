import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { 
  X, Printer, Download, Mail, MessageCircle, ShieldCheck, 
  MapPin, Phone, Award, QrCode, Calendar, Droplet, CheckCircle, ExternalLink
} from 'lucide-react';

interface VolunteerIdCardModalProps {
  volunteer: any | null;
  onClose: () => void;
  isBangla: boolean;
  settings?: any;
}

export default function VolunteerIdCardModal({
  volunteer,
  onClose,
  isBangla,
  settings
}: VolunteerIdCardModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  if (!volunteer) return null;

  const orgName = settings?.orgName || 'Green Earth';
  const orgPhone = settings?.phone || '+880 1751601039';
  const orgEmail = settings?.email || 'greenearthbd.25@gmail.com';
  const orgAddress = (isBangla ? settings?.addressBn : settings?.address) || (isBangla ? 'সান্তাহার, আদমদীঘি, বগুড়া' : 'Santahar, Adamdighi, Bogura');
  const orgWebsite = typeof window !== 'undefined' ? window.location.origin : 'https://greenearthbd.org';

  const initials = volunteer.name
    ? volunteer.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'V';

  const getInterestTitle = (interest?: string) => {
    switch (interest) {
      case 'plantation': return isBangla ? 'ম্যানগ্রোভ বৃক্ষরোপণ' : 'Mangrove Plantation';
      case 'renewable': return isBangla ? 'সৌর বিদ্যুৎ ও জ্বালানি' : 'Solar Micro-Grids';
      case 'water': return isBangla ? 'নিরাপদ পানি সরবরাহ' : 'Safe Water Supply';
      case 'waste': return isBangla ? 'বর্জ্য অপসারণ ও পুনর্ব্যবহার' : 'Waste Cleanup & Recycling';
      case 'awareness': return isBangla ? 'পরিবেশ সচেতনতা ক্যাম্পেইন' : 'School Awareness Drives';
      default: return interest || (isBangla ? 'সাধারণ স্বেচ্ছাসেবা' : 'General Volunteering');
    }
  };

  const getMembershipTitle = (mem?: string) => {
    switch (mem) {
      case 'already_member': return isBangla ? 'আজীবন সদস্য (Lifetime)' : 'Lifetime Member';
      case 'submitted_pending': return isBangla ? 'আবেদন পেন্ডিং (Pending)' : 'Registered Volunteer';
      default: return isBangla ? 'মাঠ ভলান্টিয়ার (Field Volunteer)' : 'Field Volunteer';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Generate WhatsApp link
  const getWhatsAppLink = () => {
    let phone = String(volunteer.phone || '').replace(/\D/g, '');
    if (phone.startsWith('0')) phone = '88' + phone;
    else if (!phone.startsWith('88') && phone.length === 10) phone = '880' + phone;

    const msg = isBangla
      ? `*${orgName} - অফিসিয়াল স্বেচ্ছাসেবী পরিচয়পত্র* 🪪\n\nপ্রিয় *${volunteer.name}*,\nআপনার অফিসিয়াল স্বেচ্ছাসেবী আইডি: *${volunteer.id}*\nক্যাম্পেইন: ${getInterestTitle(volunteer.interest)}\n\nগ্রিন আর্থ পরিবারের সক্রিয় সদস্য হিসেবে আপনাকে শুভেচ্ছা! 🌿`
      : `*${orgName} - Official Volunteer ID Card* 🪪\n\nDear *${volunteer.name}*,\nYour Volunteer ID is: *${volunteer.id}*\nCampaign: ${getInterestTitle(volunteer.interest)}\n\nWelcome to the Green Earth family! 🌿`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Print Specific CSS */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-id-card-wrap, #printable-id-card-wrap * {
            visibility: visible !important;
          }
          #printable-id-card-wrap {
            position: fixed !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) scale(1.05) !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm no-print"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 280 }}
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header Bar */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-slate-800/80 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between no-print">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#1F5E2E]/10 dark:bg-emerald-500/20 text-[#1F5E2E] dark:text-emerald-400 rounded-xl">
              <Award size={18} />
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-900 dark:text-white leading-tight">
                {isBangla ? 'ভলান্টিয়ার ডিজিটাল পরিচয়পত্র (Badge)' : 'Digital Volunteer Identity Badge'}
              </h3>
              <p className="text-[10px] text-gray-400 dark:text-slate-400 font-mono">
                CR80 Official Format • ID: {volunteer.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Card Canvas Scrollable Area */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-slate-100/60 dark:bg-slate-950/60">
          
          {/* THE PRINTABLE ID CARD */}
          <div
            id="printable-id-card-wrap"
            ref={cardRef}
            className="w-[340px] sm:w-[360px] bg-white rounded-3xl shadow-xl border border-gray-200/80 overflow-hidden relative font-sans text-left transition-all"
            style={{ minHeight: '520px' }}
          >
            {/* Top Security Hologram Bar */}
            <div className="h-2 w-full bg-gradient-to-r from-[#1F5E2E] via-[#6BBF3A] to-[#2E7D32]" />

            {/* Official Header */}
            <div className="p-5 pb-4 bg-gradient-to-b from-[#1F5E2E] to-[#154621] text-white relative overflow-hidden">
              {/* Background watermark leaf */}
              <div className="absolute -right-6 -bottom-8 opacity-10 pointer-events-none">
                <ShieldCheck size={140} />
              </div>

              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-white font-black text-sm shadow-inner">
                    🌿
                  </div>
                  <div>
                    <h2 className="text-sm font-black tracking-wide leading-tight uppercase font-mono">
                      {orgName}
                    </h2>
                    <p className="text-[9px] text-emerald-200 uppercase tracking-widest font-semibold">
                      Bangladesh Environmental Trust
                    </p>
                  </div>
                </div>

                <span className="bg-[#6BBF3A]/25 border border-[#6BBF3A]/40 text-emerald-100 text-[9px] font-black font-mono uppercase px-2 py-0.5 rounded-full">
                  OFFICIAL
                </span>
              </div>

              <div className="mt-3.5 pt-2.5 border-t border-white/10 flex items-center justify-between">
                <span className="text-[9px] font-mono tracking-widest text-emerald-200 uppercase">
                  VOLUNTEER IDENTITY CARD
                </span>
                <span className="text-[9px] font-mono font-bold text-white">
                  {getMembershipTitle(volunteer.membership)}
                </span>
              </div>
            </div>

            {/* Main Badge Body */}
            <div className="p-5 space-y-4 text-gray-800 relative bg-white">
              {/* Photo & Primary Details Row */}
              <div className="flex items-center gap-4">
                {/* Avatar with Ring */}
                <div className="relative shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1F5E2E]/10 to-[#6BBF3A]/20 border-2 border-[#1F5E2E] flex items-center justify-center font-black text-2xl text-[#1F5E2E] font-mono shadow-md">
                    {initials}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-[#1F5E2E] text-white p-1 rounded-full border-2 border-white shadow">
                    <CheckCircle size={10} className="stroke-[3]" />
                  </div>
                </div>

                {/* Name & ID */}
                <div className="space-y-1 overflow-hidden">
                  <div className="inline-block bg-[#1F5E2E]/10 border border-[#1F5E2E]/20 text-[#1F5E2E] text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-md">
                    ID: {volunteer.id}
                  </div>
                  <h3 className="text-base font-black text-gray-900 leading-tight truncate">
                    {volunteer.name}
                  </h3>
                  <p className="text-[11px] font-semibold text-gray-500">
                    {volunteer.profession || (isBangla ? 'স্বেচ্ছাসেবী' : 'Volunteer')}
                  </p>
                </div>
              </div>

              {/* Data Grid Section */}
              <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                    {isBangla ? 'রক্তের গ্রুপ' : 'Blood Group'}
                  </div>
                  <div className="font-extrabold text-red-600 font-mono flex items-center gap-1 mt-0.5">
                    <Droplet size={11} fill="currentColor" />
                    <span>{volunteer.bloodGroup && volunteer.bloodGroup !== 'Unknown' ? volunteer.bloodGroup : 'N/A'}</span>
                  </div>
                </div>

                <div>
                  <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                    {isBangla ? 'জেলা / এলাকা' : 'District'}
                  </div>
                  <div className="font-bold text-gray-800 truncate mt-0.5">
                    {volunteer.location || 'Bangladesh'}
                  </div>
                </div>

                <div className="col-span-2 pt-1 border-t border-gray-200/60">
                  <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                    {isBangla ? 'নির্ধারিত ক্যাম্পেইন' : 'Assigned Campaign'}
                  </div>
                  <div className="font-extrabold text-[#1F5E2E] text-[11px] mt-0.5 truncate">
                    🌿 {getInterestTitle(volunteer.interest)}
                  </div>
                </div>
              </div>

              {/* Verification & QR Code Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                {/* Simulated QR Code SVG */}
                <div className="flex items-center gap-2.5">
                  <div className="w-14 h-14 bg-gray-900 rounded-xl p-1.5 flex flex-col justify-between shadow-inner shrink-0">
                    <div className="flex justify-between">
                      <div className="w-3.5 h-3.5 bg-white rounded-xs p-0.5 flex items-center justify-center">
                        <div className="w-2 h-2 bg-gray-900" />
                      </div>
                      <div className="w-3.5 h-3.5 bg-white rounded-xs p-0.5 flex items-center justify-center">
                        <div className="w-2 h-2 bg-gray-900" />
                      </div>
                    </div>
                    <div className="flex justify-center my-auto">
                      <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full" />
                    </div>
                    <div className="flex justify-between">
                      <div className="w-3.5 h-3.5 bg-white rounded-xs p-0.5 flex items-center justify-center">
                        <div className="w-2 h-2 bg-gray-900" />
                      </div>
                      <div className="w-2 h-2 bg-white" />
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-[9px] font-mono font-bold text-gray-700 uppercase">
                      SECURE VERIFIED
                    </div>
                    <div className="text-[8px] text-gray-400 font-mono">
                      Issued: {new Date(volunteer.date || Date.now()).toLocaleDateString()}
                    </div>
                    <div className="text-[8px] text-[#1F5E2E] font-bold font-mono">
                      Valid: Dec 2027
                    </div>
                  </div>
                </div>

                {/* Authorized Signature Block */}
                <div className="text-right flex flex-col items-end">
                  <div className="font-serif italic text-xs font-bold text-gray-700 tracking-wider">
                    Tanbir Hasan
                  </div>
                  <div className="w-16 h-0.5 bg-gray-300 mt-0.5" />
                  <div className="text-[8px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                    Authorized Sign
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Security Hologram Footer */}
            <div className="p-2.5 bg-gray-100 border-t border-gray-200 text-center text-[8px] font-mono font-bold text-gray-500 uppercase tracking-widest flex items-center justify-center gap-1.5">
              <span>PROTECTING BANGLADESH ECOSYSTEM</span>
              <span>•</span>
              <span className="text-[#1F5E2E]">{orgWebsite.replace('https://', '')}</span>
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-[#1F5E2E] hover:bg-[#2E7D32] text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm hover:shadow"
            >
              <Printer size={15} />
              <span>{isBangla ? 'কার্ড প্রিন্ট / PDF ডাউনলোড' : 'Print / Save PDF'}</span>
            </button>

            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl transition-all cursor-pointer"
              title={isBangla ? 'হোয়াটসঅ্যাপে কার্ড পাঠান' : 'Send via WhatsApp'}
            >
              <MessageCircle size={16} />
            </a>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto py-2.5 px-5 border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-200 bg-white dark:bg-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            {isBangla ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
