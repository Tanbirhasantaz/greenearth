import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Award, Printer, Download, CheckCircle, ShieldCheck, Leaf } from 'lucide-react';

export interface ReceiptData {
  type: 'volunteer' | 'donation';
  recipientName: string;
  phone?: string;
  amount?: string | number;
  paymentMethod?: string;
  projectOrInterest?: string;
  date?: string;
  transactionId?: string;
}

interface DigitalReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ReceiptData | null;
  isBangla: boolean;
}

export default function DigitalReceiptModal({
  isOpen,
  onClose,
  data,
  isBangla
}: DigitalReceiptModalProps) {
  if (!data) return null;

  const receiptId = `GE-${data.type === 'donation' ? 'DON' : 'VOL'}-${Date.now().toString().slice(-6)}`;
  const dateFormatted = data.date || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm print:hidden"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            className="relative bg-white rounded-3xl p-6 sm:p-10 max-w-xl w-full shadow-2xl border-4 border-[#1F5E2E]/20 overflow-hidden z-10 print:border-none print:shadow-none print:p-0 print:max-w-none"
          >
            {/* Close Button (Hidden on Print) */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors print:hidden"
            >
              <X size={20} />
            </button>

            {/* Printable Certificate / Receipt Wrapper */}
            <div id="printable-certificate" className="bg-[#FAFBF9] border-2 border-emerald-800/30 rounded-2xl p-6 sm:p-8 relative text-center">
              {/* Corner Watermarks */}
              <div className="absolute top-2 left-2 text-[#1F5E2E]/10 select-none">
                <Leaf size={48} />
              </div>
              <div className="absolute bottom-2 right-2 text-[#1F5E2E]/10 select-none">
                <Leaf size={48} />
              </div>

              {/* Header Logo & Org Name */}
              <div className="flex flex-col items-center gap-1 mb-6">
                <div className="w-14 h-14 rounded-full bg-[#1F5E2E] text-white flex items-center justify-center shadow-md mb-2">
                  <Award size={32} className="text-[#6BBF3A]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#1F5E2E] tracking-tight">
                  GREEN EARTH BANGLADESH
                </h3>
                <p className="text-[11px] font-mono uppercase tracking-widest text-gray-500 font-bold">
                  {data.type === 'donation' 
                    ? (isBangla ? 'অফিশিয়াল অনুদান স্বীকৃতি রসিদ' : 'Official Contribution Receipt')
                    : (isBangla ? 'স্বেচ্ছাসেবী স্বীকৃতি সনদ' : 'Volunteer Honor Certificate')}
                </p>
                <div className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full mt-1 border border-emerald-200">
                  ID: {receiptId}
                </div>
              </div>

              {/* Presented To */}
              <div className="my-6">
                <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">
                  {isBangla ? 'সম্মানিত প্রাপক' : 'Proudly Presented To'}
                </p>
                <h2 className="text-2xl sm:text-3xl font-serif font-black text-gray-900 border-b border-gray-200 pb-2 inline-block px-4">
                  {data.recipientName || (isBangla ? 'পরিবেশ বন্ধু' : 'Valued Supporter')}
                </h2>
              </div>

              {/* Body Statement */}
              <p className="text-xs sm:text-sm text-gray-600 font-sans leading-relaxed max-w-md mx-auto mb-6">
                {data.type === 'donation' ? (
                  isBangla
                    ? `বাংলাদেশে উপকূলীয় বনায়ন, সৌরবিদ্যুৎ এবং বিশুদ্ধ পানির প্রকল্পে আপনার মূল্যবান আর্থিক সহায়তার জন্য আন্তরিক ধন্যবাদ জানাচ্ছি।`
                    : `In deep appreciation for your vital financial contribution toward tree plantation, clean solar energy, and safe drinking water across Bangladesh.`
                ) : (
                  isBangla
                    ? `সবুজ ও বাসযোগ্য বাংলাদেশ গড়ার জাতীয় অভিযানে সক্রিয় স্বেচ্ছাসেবী হিসেবে যুক্ত হওয়ার জন্য আপনাকে এই স্বীকৃতিপত্র প্রদান করা হলো।`
                    : `In sincere recognition of your pledge to stand with Green Earth as an environmental guardian and community volunteer.`
                )}
              </p>

              {/* Details Key-Value Matrix */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 grid grid-cols-2 gap-3 text-left text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">{isBangla ? 'তারিখ' : 'Date'}</span>
                  <span className="font-bold text-gray-800">{dateFormatted}</span>
                </div>
                {data.amount && (
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">{isBangla ? 'অনুদান পরিমাণ' : 'Amount'}</span>
                    <span className="font-black text-[#1F5E2E] text-sm">৳{Number(data.amount).toLocaleString(isBangla ? 'bn-BD' : 'en-US')}</span>
                  </div>
                )}
                {data.paymentMethod && (
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">{isBangla ? 'পদ্ধতি' : 'Method'}</span>
                    <span className="font-bold text-gray-800 uppercase">{data.paymentMethod}</span>
                  </div>
                )}
                {data.transactionId && (
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">{isBangla ? 'ট্রানজেকশন আইডি' : 'Trx ID'}</span>
                    <span className="font-mono text-gray-800 font-semibold">{data.transactionId}</span>
                  </div>
                )}
                {data.phone && (
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">{isBangla ? 'প্রেরক মোবাইল' : 'Sender Phone'}</span>
                    <span className="font-mono text-gray-800 font-semibold">{data.phone}</span>
                  </div>
                )}
                {data.projectOrInterest && (
                  <div className="col-span-2">
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">{isBangla ? 'আগ্রহের ক্ষেত্র' : 'Field / Area'}</span>
                    <span className="font-bold text-gray-800">{data.projectOrInterest}</span>
                  </div>
                )}
              </div>

              {/* Authorized Signatures & Seal */}
              <div className="flex items-end justify-between pt-4 border-t border-gray-200 text-left">
                <div className="flex flex-col">
                  <div className="w-24 border-b border-gray-400 mb-1" />
                  <span className="text-[11px] font-black text-gray-800">Dr. Anisur Rahman</span>
                  <span className="text-[9px] text-gray-500 font-semibold uppercase">{isBangla ? 'নির্বাহী পরিচালক, গ্রিন আর্থ' : 'Executive Director, Green Earth'}</span>
                </div>

                <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                  <ShieldCheck size={16} />
                  <span className="text-[10px] font-mono font-bold uppercase">{isBangla ? 'যাচাইকৃত সনদ' : 'Verified Seal'}</span>
                </div>
              </div>
            </div>

            {/* Print & Action Buttons (Hidden on Print) */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 print:hidden">
              <button
                onClick={handlePrint}
                className="w-full sm:flex-1 bg-[#1F5E2E] hover:bg-[#184a24] text-white font-sans font-bold py-3 px-6 rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
              >
                <Printer size={16} />
                <span>{isBangla ? 'প্রিন্ট বা PDF হিসেবে সংরক্ষণ করুন' : 'Print / Save as PDF'}</span>
              </button>
              <button
                onClick={onClose}
                className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 font-sans font-bold py-3 px-6 rounded-full transition-colors cursor-pointer text-xs"
              >
                {isBangla ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
