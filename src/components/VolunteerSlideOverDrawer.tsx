import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, MessageCircle, Mail, Award, Edit, Trash2, Phone, MapPin, 
  Droplet, Briefcase, Clock, Calendar, ShieldCheck, CheckCircle, 
  ExternalLink, ChevronRight, User
} from 'lucide-react';

interface SlideOverDrawerProps {
  volunteer: any | null;
  onClose: () => void;
  onEdit: (vol: any) => void;
  onDelete: (id: string) => void;
  onGenerateIdCard: (vol: any) => void;
  onUpdateStatus: (id: string, newStatus: string) => void;
  getGmailUrl: (vol: any) => string;
  getWhatsAppUrl: (vol: any) => string;
  formatFullDateTime: (dateStr?: string | number | null) => string;
  isBangla: boolean;
  isDarkMode: boolean;
}

export default function VolunteerSlideOverDrawer({
  volunteer,
  onClose,
  onEdit,
  onDelete,
  onGenerateIdCard,
  onUpdateStatus,
  getGmailUrl,
  getWhatsAppUrl,
  formatFullDateTime,
  isBangla,
  isDarkMode
}: SlideOverDrawerProps) {
  if (!volunteer) return null;

  const initials = volunteer.name
    ? volunteer.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'V';

  const getInterestTitle = (interest?: string) => {
    switch (interest) {
      case 'plantation': return isBangla ? 'ম্যানগ্রোভ বৃক্ষরোপণ কর্মসূচি' : 'Mangrove Tree Plantation';
      case 'renewable': return isBangla ? 'সৌর বিদ্যুৎ ও জ্বালানি' : 'Solar Micro-Grids';
      case 'water': return isBangla ? 'নিরাপদ পানি সরবরাহ প্ল্যান্ট' : 'Safe Water Supply Plants';
      case 'waste': return isBangla ? 'বর্জ্য অপসারণ ও পুনর্ব্যবহার' : 'Waste Cleanup & Recycling';
      case 'awareness': return isBangla ? 'পরিবেশ সচেতনতা ক্যাম্পেইন' : 'School Awareness Campaigns';
      default: return interest || (isBangla ? 'সাধারণ স্বেচ্ছাসেবা' : 'General Volunteering');
    }
  };

  const getProfessionTitle = (prof?: string) => {
    switch (prof) {
      case 'student': return isBangla ? 'ছাত্র / শিক্ষার্থী' : 'Student';
      case 'govt_service': return isBangla ? 'সরকারি চাকরিজীবী' : 'Government Service';
      case 'private_service': return isBangla ? 'বেসরকারি চাকরিজীবী' : 'Private Sector';
      case 'business': return isBangla ? 'ব্যবসায়ী' : 'Business';
      case 'teacher': return isBangla ? 'শিক্ষক / শিক্ষিকা' : 'Teacher / Educator';
      case 'doctor': return isBangla ? 'চিকিৎসক' : 'Doctor / Healthcare';
      case 'engineer': return isBangla ? 'প্রকৌশলী' : 'Engineer / Tech';
      case 'ngo': return isBangla ? 'এনজিও কর্মী' : 'Development / NGO';
      case 'freelancer': return isBangla ? 'ফ্রিল্যান্সার' : 'Freelancer';
      default: return prof || (isBangla ? 'অন্যান্য' : 'Other');
    }
  };

  const getAvailabilityTitle = (avail?: string) => {
    switch (avail) {
      case 'flexible': return isBangla ? 'প্রকল্প অনুযায়ী যেকোনো সময় (ফ্লেক্সিবল)' : 'Flexible / Project-based';
      case 'weekends': return isBangla ? 'শুধুমাত্র ছুটির দিন (শুক্র ও শনি)' : 'Weekends Only';
      case 'weekdays': return isBangla ? 'কর্মদিবস (রবি থেকে বৃহস্পতি)' : 'Weekdays';
      case 'fulltime': return isBangla ? 'ফুল-টাইম স্বেচ্ছাসেবী' : 'Full-time commitment';
      default: return avail || 'Flexible';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      {/* Slide-Over Panel Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="w-screen max-w-xl bg-white dark:bg-slate-900 shadow-2xl flex flex-col text-left font-sans border-l border-gray-200 dark:border-slate-800"
        >
          {/* 1. Drawer Header with Gradient Hero */}
          <div className="p-6 bg-gradient-to-r from-[#1F5E2E] to-[#2E7D32] text-white relative">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-4 pr-10">
              <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center font-black text-2xl font-mono text-white shadow-inner shrink-0">
                {initials}
              </div>

              <div className="space-y-1 overflow-hidden">
                <div className="inline-block bg-white/20 border border-white/30 text-white text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-md">
                  ID: {volunteer.id}
                </div>
                <h3 className="text-xl font-black text-white leading-tight truncate">
                  {volunteer.name}
                </h3>
                <p className="text-xs text-emerald-100 font-medium truncate">
                  {getProfessionTitle(volunteer.profession)} • {volunteer.location || 'Bangladesh'}
                </p>
              </div>
            </div>
          </div>

          {/* 2. Fast Interactive Actions Bar */}
          <div className="p-3 bg-gray-50 dark:bg-slate-800/90 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between gap-2 overflow-x-auto">
            {/* WhatsApp */}
            <a
              href={getWhatsAppUrl(volunteer)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
              title="Send WhatsApp confirmation message"
            >
              <MessageCircle size={14} />
              <span>WhatsApp</span>
            </a>

            {/* Gmail */}
            <a
              href={getGmailUrl(volunteer)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#1F5E2E] hover:bg-[#2E7D32] text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
              title="Draft acknowledgment email in Gmail"
            >
              <Mail size={14} />
              <span>Gmail</span>
            </a>

            {/* ID Card Generator */}
            <button
              type="button"
              onClick={() => onGenerateIdCard(volunteer)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
              title="Generate printable Volunteer ID Badge"
            >
              <Award size={14} />
              <span>{isBangla ? 'আইডি কার্ড' : 'ID Badge'}</span>
            </button>

            {/* Edit */}
            <button
              type="button"
              onClick={() => onEdit(volunteer)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer"
            >
              <Edit size={14} />
              <span>{isBangla ? 'এডিট' : 'Edit'}</span>
            </button>

            {/* Delete */}
            <button
              type="button"
              onClick={() => onDelete(volunteer.id)}
              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors cursor-pointer shrink-0"
              title="Delete volunteer"
            >
              <Trash2 size={16} />
            </button>
          </div>

          {/* 3. Drawer Scrollable Body Content */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-gray-700 dark:text-slate-300">
            
            {/* Instant Membership Status Control */}
            <div className="bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/60 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-black uppercase text-[#1F5E2E] dark:text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck size={13} />
                  <span>{isBangla ? 'সদস্যপদ স্ট্যাটাস কন্ট্রোল' : 'Membership Approval Status'}</span>
                </span>
                <span className="text-[9px] bg-[#6BBF3A]/20 text-[#1F5E2E] dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                  Instant Save
                </span>
              </div>
              <select
                value={volunteer.membership || 'no_intent'}
                onChange={(e) => onUpdateStatus(volunteer.id, e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800 rounded-xl font-bold text-xs text-gray-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-[#1F5E2E]/20 select-hand cursor-pointer"
              >
                <option value="no_intent">{isBangla ? 'ফিল্ড ভলান্টিয়ার (Field Volunteer Only)' : 'Field Volunteer Only'}</option>
                <option value="submitted_pending">{isBangla ? 'আবেদন পেন্ডিং (Submitted Form)' : 'Submitted Form (Pending Approval)'}</option>
                <option value="already_member">{isBangla ? 'আজীবন সদস্য (Lifetime Member)' : 'Lifetime Member'}</option>
              </select>
            </div>

            {/* Contact Details Card */}
            <div className="bg-white dark:bg-slate-800 border border-gray-200/80 dark:border-slate-700 rounded-2xl p-4 space-y-3 shadow-xs">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-slate-400 font-mono">
                {isBangla ? 'যোগাযোগের তথ্য' : 'Contact Information'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 rounded-xl">
                    <Phone size={14} />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-[10px] text-gray-400">{isBangla ? 'মোবাইল নম্বর' : 'Phone'}</div>
                    <a href={`tel:${volunteer.phone}`} className="font-bold text-gray-800 dark:text-white hover:underline truncate block">
                      {volunteer.phone || '—'}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 rounded-xl">
                    <Mail size={14} />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-[10px] text-gray-400">{isBangla ? 'ইমেইল' : 'Email'}</div>
                    <a href={`mailto:${volunteer.email}`} className="font-bold text-[#1F5E2E] dark:text-emerald-400 hover:underline truncate block">
                      {volunteer.email || '—'}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 sm:col-span-2 pt-2 border-t border-gray-100 dark:border-slate-700/60">
                  <div className="p-2 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 rounded-xl">
                    <MapPin size={14} />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400">{isBangla ? 'জেলা / এলাকা' : 'District / Area'}</div>
                    <div className="font-bold text-gray-800 dark:text-white">
                      {volunteer.location || (isBangla ? 'অনুল্লিখিত' : 'Not specified')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile & Skills Matrix */}
            <div className="bg-white dark:bg-slate-800 border border-gray-200/80 dark:border-slate-700 rounded-2xl p-4 space-y-3 shadow-xs">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-slate-400 font-mono">
                {isBangla ? 'স্বেচ্ছাসেবী প্রোফাইল ও ক্ষেত্র' : 'Volunteer Profile & Engagement'}
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                  <div className="text-[9px] text-gray-400 font-bold uppercase">{isBangla ? 'রক্তের গ্রুপ' : 'Blood Group'}</div>
                  <div className="font-extrabold text-red-600 dark:text-red-400 font-mono flex items-center gap-1 mt-0.5">
                    <Droplet size={12} fill="currentColor" />
                    <span>{volunteer.bloodGroup && volunteer.bloodGroup !== 'Unknown' ? volunteer.bloodGroup : 'Unknown'}</span>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                  <div className="text-[9px] text-gray-400 font-bold uppercase">{isBangla ? 'পেশা' : 'Profession'}</div>
                  <div className="font-bold text-gray-800 dark:text-slate-200 truncate mt-0.5">
                    {getProfessionTitle(volunteer.profession)}
                  </div>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl col-span-2">
                  <div className="text-[9px] text-gray-400 font-bold uppercase">{isBangla ? 'ক্যাম্পেইন আগ্রহ' : 'Assigned Campaign'}</div>
                  <div className="font-extrabold text-[#1F5E2E] dark:text-emerald-400 mt-0.5">
                    🌿 {getInterestTitle(volunteer.interest)}
                  </div>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl col-span-2">
                  <div className="text-[9px] text-gray-400 font-bold uppercase">{isBangla ? 'কাজের সময় / প্রাপ্যতা' : 'Availability'}</div>
                  <div className="font-bold text-gray-700 dark:text-slate-300 mt-0.5">
                    {getAvailabilityTitle(volunteer.availability)}
                  </div>
                </div>
              </div>
            </div>

            {/* Motivation Message */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-slate-400 font-mono">
                {isBangla ? 'স্বেচ্ছাসেবক হওয়ার প্রেরণা ও বার্তা' : 'Motivation Message & Notes'}
              </h4>
              <div className="bg-[#1F5E2E]/5 dark:bg-emerald-950/20 border border-[#1F5E2E]/10 dark:border-emerald-800/40 rounded-2xl p-4 relative">
                <span className="absolute right-4 top-2 text-[#1F5E2E]/20 dark:text-emerald-500/20 text-4xl font-serif">“</span>
                <p className="text-gray-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap relative z-10 font-medium">
                  {volunteer.message || (isBangla ? 'কোনো বার্তা প্রদান করা হয়নি।' : 'No bio or message was submitted.')}
                </p>
              </div>
            </div>

            {/* Application Audit Timeline */}
            <div className="p-4 bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 rounded-2xl flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-400 font-mono">
              <div className="flex items-center gap-1.5">
                <Clock size={13} className="text-[#1F5E2E] dark:text-emerald-400" />
                <span>{isBangla ? 'আবেদনের সময়: ' : 'Submitted: '}{formatFullDateTime(volunteer.date)}</span>
              </div>
              <span className="text-[#1F5E2E] dark:text-emerald-400 font-bold">
                ✓ Recorded
              </span>
            </div>

          </div>

          {/* 4. Drawer Footer Close Button */}
          <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 flex items-center justify-end">
            <button
              onClick={onClose}
              className="py-2.5 px-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-xs"
            >
              {isBangla ? 'ড্রয়ার বন্ধ করুন' : 'Close Drawer'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
