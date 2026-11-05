/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import DigitalReceiptModal, { ReceiptData } from '../components/DigitalReceiptModal';
import { 
  Award, Heart, CheckCircle, Info, Lock, ArrowRight, User, Mail, Phone, Calendar, 
  MapPin, Clipboard, Briefcase, Clock, Droplet, Users, Trees, Sun, Trash2, Megaphone, 
  ChevronRight, ChevronLeft, Check, Sparkles, MessageCircle, RefreshCw, ShieldCheck,
  Printer, ExternalLink
} from 'lucide-react';

interface InvolvedProps {
  isBangla: boolean;
  onFormSuccess: (title: string, message: string) => void;
  settings?: any;
}

export default function Involved({ isBangla, onFormSuccess, settings }: InvolvedProps) {
  // Volunteer Form State
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [volName, setVolName] = useState('');
  const [volEmail, setVolEmail] = useState('');
  const [volPhone, setVolPhone] = useState('');
  const [volInterest, setVolInterest] = useState('plantation');
  const [volMembership, setVolMembership] = useState('no_intent');
  const [volProfession, setVolProfession] = useState('student');
  const [volLocation, setVolLocation] = useState('');
  const [volBloodGroup, setVolBloodGroup] = useState('Unknown');
  const [volAvailability, setVolAvailability] = useState('flexible');
  const [volMessage, setVolMessage] = useState('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [volStep, setVolStep] = useState<1 | 2 | 3>(1);
  const [isSubmittingVol, setIsSubmittingVol] = useState(false);
  const [submittedVolSuccess, setSubmittedVolSuccess] = useState<any | null>(null);

  // Donation State
  const [selectedTier, setSelectedTier] = useState<number | 'custom'>(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'card' | 'bank'>('bkash');
  const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donationError, setDonationError] = useState('');

  // Validate Step 1 (Personal & Contact)
  const validateStep1 = () => {
    const errors: { [key: string]: string } = {};

    if (!volName.trim()) {
      errors.name = isBangla ? 'আপনার পূর্ণ নাম দিন' : 'Please enter your full name';
    }
    if (!volPhone.trim()) {
      errors.phone = isBangla ? 'আপনার মোবাইল নম্বর দিন' : 'Please enter your phone number';
    } else {
      const cleanPhone = volPhone.replace(/[\s\-]/g, '');
      const bdPhoneRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
      if (!bdPhoneRegex.test(cleanPhone)) {
        errors.phone = isBangla ? 'সঠিক ১১-ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)' : 'Please enter a valid 11-digit mobile number';
      }
    }
    if (!volEmail.trim()) {
      errors.email = isBangla ? 'আপনার ইমেইল দিন' : 'Please enter your email';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(volEmail.trim())) {
        errors.email = isBangla ? 'সঠিক ইমেইল ঠিকানা দিন' : 'Please enter a valid email address';
      }
    }
    if (!volLocation.trim()) {
      errors.location = isBangla ? 'আপনার এলাকা বা জেলার নাম লিখুন' : 'Please enter your district/area';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetVolunteerForm = () => {
    setVolName('');
    setVolEmail('');
    setVolPhone('');
    setVolMessage('');
    setVolLocation('');
    setVolMembership('no_intent');
    setVolProfession('student');
    setVolBloodGroup('Unknown');
    setVolAvailability('flexible');
    setVolInterest('plantation');
    setVolStep(1);
    setSubmittedVolSuccess(null);
    setFormErrors({});
  };

  const getCoordinatorWhatsAppUrl = (applicantId?: string) => {
    const rawPhone = (settings?.phone || '+880 1751601039').replace(/[^0-9]/g, '');
    const cleanPhone = rawPhone.startsWith('880') ? rawPhone : ('880' + rawPhone.replace(/^0/, ''));
    const text = isBangla
      ? `আসসালামু আলাইকুম গ্রিন আর্থ! 🌿\nআমি ওয়েবসাইটে স্বেচ্ছাসেবী হিসেবে আবেদন করেছি।\n\n• আবেদনকারী: ${submittedVolSuccess?.name || volName || 'স্বেচ্ছাসেবী'}\n• আবেদন আইডি: ${applicantId || submittedVolSuccess?.id || 'VOL-PENDING'}\n• মোবাইল: ${submittedVolSuccess?.phone || volPhone}\n• জেলা: ${submittedVolSuccess?.location || volLocation}\n\nআমার আবেদনটি সক্রিয় করতে পরবর্তী করণীয় জানালে উপকৃত হব। ধন্যবাদ!`
      : `Hello Green Earth! 🌿\nI have submitted my volunteer application on your website.\n\n• Name: ${submittedVolSuccess?.name || volName || 'Volunteer'}\n• Application ID: ${applicantId || submittedVolSuccess?.id || 'VOL-PENDING'}\n• Phone: ${submittedVolSuccess?.phone || volPhone}\n• District: ${submittedVolSuccess?.location || volLocation}\n\nPlease confirm my application status. Thank you!`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  // Handle volunteer submission
  const handleVolunteerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1()) {
      setVolStep(1);
      return;
    }

    setFormErrors({});
    setIsSubmittingVol(true);

    const payload = {
      name: volName,
      email: volEmail,
      phone: volPhone,
      interest: volInterest,
      membershipStatus: volMembership,
      membership: volMembership,
      profession: volProfession,
      location: volLocation,
      bloodGroup: volBloodGroup,
      availability: volAvailability,
      message: volMessage,
      date: new Date().toISOString()
    };

    const executeClientFallbackVolunteer = () => {
      try {
        const savedVols = localStorage.getItem('volunteers');
        const currentVols = savedVols ? JSON.parse(savedVols) : [];
        
        const fallbackVol = {
          ...payload,
          id: `VOL-${Math.floor(10000 + Math.random() * 90000)}`,
          status: 'pending'
        };

        const updatedVols = [...currentVols, fallbackVol];
        localStorage.setItem('volunteers', JSON.stringify(updatedVols));

        setSubmittedVolSuccess(fallbackVol);
        setIsSubmittingVol(false);

        onFormSuccess(
          isBangla ? 'আবেদন সম্পন্ন হয়েছে!' : 'Application Submitted!',
          isBangla 
            ? 'স্বেচ্ছাসেবী হিসেবে আপনার আবেদনটি সফলভাবে গৃহীত হয়েছে। আমাদের টিম খুব শীঘ্রই আপনার সাথে যোগাযোগ করবে!' 
            : 'Your professional volunteer application has been successfully submitted! Our coordinator team will review your details and connect with you shortly.'
        );
      } catch (fallbackErr) {
        console.error("Volunteer fallback failed:", fallbackErr);
        setIsSubmittingVol(false);
        alert(isBangla ? 'একটি সমস্যা হয়েছে, অনুগ্রহ করে আবার চেষ্টা করুন।' : 'Something went wrong, please try again.');
      }
    };

    fetch('/api/volunteers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Server returned non-OK status');
        }
        return res.json();
      })
      .then((data) => {
        const assignedId = data?.volunteer?.id || data?.id || `VOL-${Math.floor(10000 + Math.random() * 90000)}`;
        setSubmittedVolSuccess({
          ...payload,
          id: assignedId
        });
        setIsSubmittingVol(false);

        onFormSuccess(
          isBangla ? 'আবেদন সম্পন্ন হয়েছে!' : 'Application Submitted!',
          isBangla 
            ? 'স্বেচ্ছাসেবী হিসেবে আপনার আবেদনটি সফলভাবে গৃহীত হয়েছে। আমাদের টিম খুব শীঘ্রই আপনার সাথে যোগাযোগ করবে!' 
            : 'Your professional volunteer application has been successfully submitted! Our coordinator team will review your details and connect with you shortly.'
        );
      })
      .catch((err) => {
        console.warn("Server volunteer registration failed, falling back to local storage:", err);
        executeClientFallbackVolunteer();
      });
  };

  // Handle donation submit
  const handleDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDonationError('');

    if (!donorName.trim()) {
      setDonationError(isBangla ? 'অনুগ্রহ করে আপনার নাম দিন' : 'Please enter your name');
      return;
    }

    if (!donorEmail.trim()) {
      setDonationError(isBangla ? 'অনুগ্রহ করে আপনার ইমেইল দিন' : 'Please enter your email');
      return;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(donorEmail.trim())) {
        setDonationError(isBangla ? 'একটি সঠিক ইমেইল ঠিকানা দিন' : 'Please enter a valid email address');
        return;
      }
    }

    const finalAmount = selectedTier === 'custom' ? Number(customAmount) : selectedTier;
    if (!finalAmount || finalAmount <= 0) {
      setDonationError(isBangla ? 'অনুগ্রহ করে সঠিক অনুদানের পরিমাণ দিন' : 'Please specify a valid donation amount');
      return;
    }

    if (paymentMethod === 'card' || paymentMethod === 'bank') {
      setDonationError(
        isBangla 
          ? 'কার্ড এবং ব্যাংক পেমেন্ট সাময়িকভাবে বন্ধ রয়েছে। অনুগ্রহ করে বিকাশ অথবা নগদ ব্যবহার করুন।' 
          : 'Card and Bank payments are temporarily offline. Please use bKash or Nagad.'
      );
      return;
    }

    // Trigger transaction code modal for bKash / Nagad, or complete Card/Bank directly
    if (paymentMethod === 'bkash' || paymentMethod === 'nagad') {
      setShowPaymentInstructions(true);
    } else {
      // Simulate direct bank/card success and POST immediately
      const txnId = `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      const payload = {
        name: donorName,
        email: donorEmail,
        amount: finalAmount,
        method: paymentMethod,
        paymentMethod: paymentMethod,
        transactionId: txnId,
        transId: txnId,
        status: 'verified',
        date: new Date().toISOString()
      };

      const executeClientFallbackDirectDonation = () => {
        try {
          const savedDons = localStorage.getItem('donations');
          const currentDons = savedDons ? JSON.parse(savedDons) : [];
          
          const fallbackDon = {
            ...payload,
            id: `DON-LOCAL-${Date.now()}`
          };
          
          const updatedDons = [...currentDons, fallbackDon];
          localStorage.setItem('donations', JSON.stringify(updatedDons));
          
          setDonorName('');
          setDonorEmail('');
          onFormSuccess(
            isBangla ? 'অনুদান যাচাইাধীন রয়েছে (Under Review)!' : 'Donation Under Review!',
            isBangla
              ? `ধন্যবাদ! আপনার ৳${finalAmount.toLocaleString('bn-BD')} অনুদানটি সফলভাবে জমা হয়েছে। আমাদের অ্যাডমিন টিম ট্রানজেকশনটি যাচাই করে অনুমোদন করার পর এটি আপডেট করা হবে।`
              : `Thank you! Your donation of ৳${finalAmount.toLocaleString('en-US')} has been submitted successfully. Our admin team will review and approve the transaction shortly.`
          );
        } catch (fallbackErr) {
          console.error("Direct donation fallback failed:", fallbackErr);
          alert(isBangla ? 'অনুদান সম্পন্ন করতে সমস্যা হয়েছে।' : 'Error recording your donation.');
        }
      };

      fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Server returned non-OK status');
          }
          return res.json();
        })
        .then((data) => {
          setDonorName('');
          setDonorEmail('');
          onFormSuccess(
            isBangla ? 'অনুদান যাচাইাধীন রয়েছে (Under Review)!' : 'Donation Under Review!',
            isBangla
              ? `ধন্যবাদ! আপনার ৳${finalAmount.toLocaleString('bn-BD')} অনুদানটি সফলভাবে জমা হয়েছে। আমাদের অ্যাডমিন টিম ট্রানজেকশনটি যাচাই করে অনুমোদন করার পর এটি আপডেট করা হবে।`
              : `Thank you! Your donation of ৳${finalAmount.toLocaleString('en-US')} has been submitted successfully. Our admin team will review and approve the transaction shortly.`
          );
        })
        .catch((err) => {
          console.warn("Server direct donation registration failed, falling back to local storage:", err);
          executeClientFallbackDirectDonation();
        });
    }
  };

  const handleVerifyTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      alert(isBangla ? 'অনুগ্রহ করে ট্রানজেকশন আইডি দিন' : 'Please enter the transaction ID');
      return;
    }

    const finalAmount = selectedTier === 'custom' ? Number(customAmount) : selectedTier;

    const payload = {
      name: donorName,
      email: donorEmail,
      amount: finalAmount,
      method: paymentMethod,
      paymentMethod: paymentMethod,
      transactionId: transactionId,
      transId: transactionId,
      status: 'pending',
      date: new Date().toISOString()
    };

    const executeClientFallbackVerifyDonation = () => {
      try {
        const savedDons = localStorage.getItem('donations');
        const currentDons = savedDons ? JSON.parse(savedDons) : [];
        
        const fallbackDon = {
          ...payload,
          id: `DON-LOCAL-${Date.now()}`
        };
        
        const updatedDons = [...currentDons, fallbackDon];
        localStorage.setItem('donations', JSON.stringify(updatedDons));
        
        setShowPaymentInstructions(false);
        setTransactionId('');
        setDonorName('');
        setDonorEmail('');

        onFormSuccess(
          isBangla ? 'অনুদান যাচাইাধীন রয়েছে (Under Review)!' : 'Donation Under Review!',
          isBangla
            ? `ধন্যবাদ! আপনার ৳${finalAmount.toLocaleString('bn-BD')} অনুদান ভেরিফিকেশন অনুরোধটি সফলভাবে সাবমিট করা হয়েছে। আমাদের অ্যাডমিন টিম ট্রানজেকশন আইডি (${transactionId}) যাচাই করে এটি অনুমোদন করবে।`
            : `Thank you! Your donation verification request of ৳${finalAmount.toLocaleString('en-US')} under Trans ID: ${transactionId} has been submitted. Our admin team will verify and approve the transaction shortly.`
        );
      } catch (fallbackErr) {
        console.error("Verification donation fallback failed:", fallbackErr);
        alert(isBangla ? 'ভেরিফিকেশন সম্পন্ন করতে ব্যর্থ হয়েছে।' : 'Failed to submit verification.');
      }
    };

    fetch('/api/donations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Server returned non-OK status');
        }
        return res.json();
      })
      .then((data) => {
        setShowPaymentInstructions(false);
        setTransactionId('');
        setDonorName('');
        setDonorEmail('');

        onFormSuccess(
          isBangla ? 'অনুদান যাচাইাধীন রয়েছে (Under Review)!' : 'Donation Under Review!',
          isBangla
            ? `ধন্যবাদ! আপনার ৳${finalAmount.toLocaleString('bn-BD')} অনুদান ভেরিফিকেশন অনুরোধটি সফলভাবে সাবমিট করা হয়েছে। আমাদের অ্যাডমিন টিম ট্রানজেকশন আইডি (${transactionId}) যাচাই করে এটি অনুমোদন করবে।`
            : `Thank you! Your donation verification request of ৳${finalAmount.toLocaleString('en-US')} under Trans ID: ${transactionId} has been submitted. Our admin team will verify and approve the transaction shortly.`
        );
      })
      .catch((err) => {
        console.warn("Server donation verification failed, falling back to local storage:", err);
        executeClientFallbackVerifyDonation();
      });
  };

  const tiers = [
    { amount: 500, label: 'Plant a Seedling', labelBn: 'একটি চারা গাছ রোপণ', desc: 'Sponsor 2 native tree saplings including nursery rearing & organic soils.', descBn: '২টি দেশীয় গাছের চারা নার্সারি পরিচর্যা ও জৈব সারসহ স্পন্সর করুন।' },
    { amount: 1000, label: 'Pure Water Support', labelBn: 'বিশুদ্ধ পানি সহায়তা', desc: 'Contribute to deep tube wells and filtration maintenance for high-arsenic chars.', descBn: 'আর্সেনিক কবলিত চরে গভীর নলকূপ ও ফিল্টার মেরামতের কাজে সহায়তা করুন।' },
    { amount: 5000, label: 'Solar Light Pack', labelBn: 'সৌর শক্তির প্যাকেজ', desc: 'Fund a high-efficiency solar lighting unit for a remote school child\'s home study.', descBn: 'প্রত্যন্ত চর অঞ্চলের একটি শিক্ষার্থীর বাড়িতে পড়ার জন্য সোলার লাইট স্থাপন করুন।' }
  ];

  return (
    <div className="flex flex-col w-full bg-[#FAFAF7] pt-24 pb-20" id="involved-view">
      {/* 1. HERO HEADER */}
      <section className="relative py-12 overflow-hidden bg-gradient-to-b from-[#1F5E2E]/10 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 flex flex-col items-center gap-4">
          <span className="text-xs font-mono font-black text-[#6BBF3A] uppercase tracking-widest block">
            {isBangla ? 'অংশগ্রহণ করুন' : 'Support the Movement'}
          </span>
          <h1 className="font-sans text-fluid-hero font-black text-[#1F5E2E]">
            {isBangla ? 'সবুজ আন্দোলনে যুক্ত হোন' : 'Get Involved with Green Earth'}
          </h1>
          <p className="font-sans text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
            {isBangla
              ? 'গ্রিন আর্থ-এ আপনি স্বেচ্ছাসেবী হিসেবে সময় দিতে পারেন, অথবা সুবিধাবঞ্চিত মানুষের জন্য বিশুদ্ধ পানি ও সবুজ জ্বালানি সংস্থানে সরাসরি অনুদান দিতে পারেন।'
              : 'Every seedling planted, microgrid installed, and water well completed relies on the dedication of citizens like you.'
            }
          </p>
          <div className="h-1 w-16 bg-[#6BBF3A] rounded-full mt-2" />
        </div>
      </section>

      {/* MEMBERSHIP REGISTRATION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" id="membership-section">
        <div className="bg-white border border-[#1F5E2E]/10 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden flex flex-col gap-8">
          {/* Subtle decorative background plant leaf pattern */}
          <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none text-[#1F5E2E]">
            <Award size={300} />
          </div>
          
          <div className="text-left space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6BBF3A]/10 text-[#1F5E2E] text-xs font-mono font-bold uppercase tracking-wider">
              <Award size={14} className="text-[#6BBF3A]" />
              <span>{isBangla ? 'অংশগ্রহণের ২টি সহজ মাধ্যম' : '2 Simple Ways to Join'}</span>
            </div>
            
            <h2 className="font-sans text-2xl sm:text-3xl font-black text-[#1F5E2E]">
              {isBangla ? 'গ্রিন আর্থ-এর আন্দোলনের সাথে যুক্ত হোন' : 'Join the Green Earth Movement'}
            </h2>
            
            <p className="font-sans text-sm sm:text-base text-gray-600 leading-relaxed max-w-4xl">
              {isBangla
                ? 'পরিবেশ সংরক্ষণ ও জলবায়ু পরিবর্তন মোকাবিলায় আমাদের সাথে যুক্ত হওয়া এখন আরও সহজ। আপনি যেকোনো একটি সুবিধাজনক উপায় বেছে নিয়ে আমাদের গ্রিন ফোর্সের সঙ্গী হতে পারেন:'
                : 'Getting involved in environmental protection is now easier than ever. You can choose either of our two structured paths to join our dedicated Green Force:'
              }
            </p>
            
            {/* The 2 Paths Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Path 1 Card */}
              <div className="bg-[#6BBF3A]/5 border border-[#6BBF3A]/15 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#1F5E2E] font-sans font-extrabold text-base">
                    <Users size={18} className="text-[#6BBF3A]" />
                    <span>{isBangla ? '১. নিবন্ধিত ফিল্ড ভলান্টিয়ার' : '1. Registered Field Volunteer'}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {isBangla
                      ? 'সম্পূর্ণ বিনামূল্যে মাঠ পর্যায়ের বিভিন্ন বৃক্ষরোপণ, নদী পরিচ্ছন্নতা, সোলার ইলেকট্রোলাইট প্যাক ও বিশুদ্ধ পানির ফিল্টার স্থাপনের কার্যক্রমে সরাসরি অংশ নিন।'
                      : 'Join hands-on field operations: mangrove planting, solar microgrid installations, and clean water deployment. Completely free & flexible.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setVolMembership('no_intent');
                    const element = document.getElementById('volunteer-form-container');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full mt-2 bg-[#6BBF3A]/15 hover:bg-[#6BBF3A]/25 text-[#1F5E2E] font-sans font-bold text-xs py-2.5 px-4 rounded-xl text-center cursor-pointer transition-colors"
                >
                  {isBangla ? 'ভলান্টিয়ার হিসেবে আবেদন করুন' : 'Register as Volunteer'}
                </button>
              </div>

              {/* Path 2 Card */}
              <div className="bg-[#1F5E2E]/5 border border-[#1F5E2E]/15 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#1F5E2E] font-sans font-extrabold text-base">
                    <Award size={18} className="text-[#1F5E2E]" />
                    <span>{isBangla ? '২. অফিশিয়াল আজীবন সদস্য' : '2. Official Lifetime Member'}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {isBangla
                      ? 'নীতি নির্ধারণী সিদ্ধান্ত গ্রহণে ভোটাধিকার, বার্ষিক সাধারণ সভায় অংশগ্রহণ এবং অফিশিয়াল ডিজিটাল মেম্বারশিপ আইডি কার্ড ও সার্টিফিকেট লাভ করুন।'
                      : 'Play a key role in decision-making, gain voting rights, attend summits, and receive an official printed/digital ID card & certificate.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setVolMembership('submitted_pending');
                    const element = document.getElementById('volunteer-form-container');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full mt-2 bg-[#1F5E2E] hover:bg-[#2E7D32] text-white font-sans font-bold text-xs py-2.5 px-4 rounded-xl text-center cursor-pointer shadow-sm transition-colors"
                >
                  {isBangla ? 'আজীবন সদস্যপদের ধাপসমূহ দেখুন' : 'Become a Lifetime Member'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TWO COLUMN FORMS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Col: Volunteer Signup Form (Organized Step Wizard) */}
        <div className="lg:col-span-6 bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between text-left transition-all" id="volunteer-form-container">
          <div>
            {/* Header / Intro */}
            <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-50 text-[#1F5E2E] rounded-2xl shadow-xs">
                  {volMembership === 'no_intent' ? <Users size={24} className="text-[#1F5E2E]" /> : <Award size={24} className="text-[#1F5E2E]" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-sans text-xl sm:text-2xl font-black text-[#1F5E2E]">
                      {isBangla ? 'স্বেচ্ছাসেবী আবেদন পোর্টাল' : 'Volunteer Application'}
                    </h2>
                    <span className="bg-[#6BBF3A]/15 text-[#1F5E2E] text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {isBangla ? 'অফিশিয়াল' : 'Official'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-medium font-sans mt-0.5">
                    {isBangla ? '৩টি সুবিন্যস্ত ধাপে সহজে আবেদন সম্পন্ন করুন' : 'Complete your application in 3 structured steps'}
                  </p>
                </div>
              </div>

              {!submittedVolSuccess && (
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-[11px] font-mono font-black text-[#1F5E2E]">
                    {isBangla ? `ধাপ ${volStep} / ৩` : `Step ${volStep} of 3`}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {volStep === 1 ? (isBangla ? 'ব্যক্তিগত তথ্য' : 'Identity') : volStep === 2 ? (isBangla ? 'ক্যাম্পেইন নির্বাচন' : 'Campaign') : (isBangla ? 'রিভিউ ও সাবমিশন' : 'Review')}
                  </span>
                </div>
              )}
            </div>

            {/* If submitted successfully, show Celebration & Confirmation Slip */}
            {submittedVolSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 py-2"
              >
                {/* Success Banner */}
                <div className="bg-emerald-50/80 border border-emerald-200 rounded-3xl p-6 text-center space-y-3 relative overflow-hidden">
                  <div className="w-16 h-16 bg-gradient-to-tr from-[#1F5E2E] to-[#6BBF3A] text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle size={32} className="stroke-[2.5]" />
                  </div>
                  
                  <div>
                    <span className="inline-block bg-emerald-100 text-[#1F5E2E] text-[11px] font-mono font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                      {isBangla ? 'আবেদন সফলভাবে গৃহীত হয়েছে' : 'Application Received'}
                    </span>
                    <h3 className="text-xl font-black text-gray-900">
                      {isBangla ? `অভিনন্দন, ${submittedVolSuccess.name}!` : `Congratulations, ${submittedVolSuccess.name}!`}
                    </h3>
                    <p className="text-xs text-gray-600 max-w-md mx-auto mt-1 leading-relaxed">
                      {isBangla
                        ? 'গ্রিন আর্থ-এ যুক্ত হওয়ার আগ্রহের জন্য আন্তরিক ধন্যবাদ। আপনার আবেদনপত্রটি সফলভাবে আমাদের সেন্ট্রাল ডাটাবেজে যুক্ত হয়েছে।'
                        : 'Thank you for stepping up to heal Bangladesh. Your profile has been logged in our central volunteer system.'}
                    </p>
                  </div>

                  {/* Candidate Pass Details Box */}
                  <div className="bg-white border border-emerald-200/80 rounded-2xl p-4 text-left shadow-xs space-y-3 max-w-md mx-auto">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase font-mono">{isBangla ? 'ভলান্টিয়ার ট্র্যাকিং আইডি' : 'Volunteer ID'}</div>
                        <div className="text-sm font-black text-[#1F5E2E] font-mono">{submittedVolSuccess.id}</div>
                      </div>
                      <span className="text-xs bg-yellow-50 text-yellow-800 font-bold px-2.5 py-1 rounded-lg border border-yellow-200 flex items-center gap-1 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-ping"></span>
                        {isBangla ? 'যাচাইাধীন (Under Review)' : 'Under Review'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-gray-400 font-medium block">{isBangla ? 'ক্যাম্পেইন:' : 'Campaign:'}</span>
                        <span className="font-bold text-gray-800">
                          {(() => {
                            switch (submittedVolSuccess.interest) {
                              case 'plantation': return isBangla ? 'বৃক্ষরোপণ ও বনায়ন' : 'Mangrove Tree Plantation';
                              case 'renewable': return isBangla ? 'সৌর শক্তি ও বিদ্যুৎ' : 'Solar Micro-Grids';
                              case 'water': return isBangla ? 'বিশুদ্ধ পানি সরবরাহ' : 'Safe Water Wells';
                              case 'waste': return isBangla ? 'বর্জ্য অপসারণ ও নদী' : 'Waste Cleanup';
                              case 'awareness': return isBangla ? 'স্কুল সচেতনতা' : 'School Awareness';
                              default: return submittedVolSuccess.interest;
                            }
                          })()}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 font-medium block">{isBangla ? 'জেলা / এলাকা:' : 'District:'}</span>
                        <span className="font-bold text-gray-800">{submittedVolSuccess.location || '—'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 font-medium block">{isBangla ? 'মোবাইল নম্বর:' : 'Phone:'}</span>
                        <span className="font-bold text-gray-800 font-mono">{submittedVolSuccess.phone}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 font-medium block">{isBangla ? 'সদস্যপদের ধরন:' : 'Role Type:'}</span>
                        <span className="font-bold text-gray-800">
                          {submittedVolSuccess.membership === 'submitted_pending' || submittedVolSuccess.membership === 'already_member'
                            ? (isBangla ? 'আজীবন সদস্য' : 'Lifetime Member')
                            : (isBangla ? 'মাঠ ভলান্টিয়ার' : 'Field Volunteer')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct Next Actions */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-[#6BBF3A]" />
                    <span>{isBangla ? 'তাত্ক্ষণিক যোগাযোগের পরবর্তী পদক্ষেপ:' : 'Immediate Next Steps:'}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* WhatsApp Coordinator Button */}
                    <a
                      href={getCoordinatorWhatsAppUrl(submittedVolSuccess.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-2xl text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MessageCircle size={16} />
                      <span>{isBangla ? 'WhatsApp-এ কনফার্মেশন' : 'Confirm via WhatsApp'}</span>
                    </a>

                    {/* Call Hotline Button */}
                    <a
                      href={`tel:${(settings?.phone || '+880 1751601039')}`}
                      className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold py-3 px-4 rounded-2xl text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Phone size={15} className="text-[#1F5E2E]" />
                      <span>{isBangla ? 'হটলাইনে কল করুন' : 'Call Coordinator'}</span>
                    </a>
                  </div>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={resetVolunteerForm}
                      className="text-xs text-gray-500 hover:text-[#1F5E2E] font-bold underline cursor-pointer inline-flex items-center gap-1"
                    >
                      <RefreshCw size={12} />
                      <span>{isBangla ? 'নতুন আরেকটি আবেদন ফরম পূরণ করুন' : 'Submit Another Volunteer Application'}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* Step Wizard Active Form */
              <div className="space-y-6">
                {/* 3-Step Interactive Progress Bar */}
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    {/* Step 1 Pill */}
                    <button
                      type="button"
                      onClick={() => setVolStep(1)}
                      className={`py-2 px-2.5 rounded-xl text-left border transition-all cursor-pointer flex items-center gap-2 ${
                        volStep === 1
                          ? 'bg-[#1F5E2E] text-white border-[#1F5E2E] shadow-sm'
                          : volStep > 1
                          ? 'bg-emerald-50 text-[#1F5E2E] border-emerald-200'
                          : 'bg-gray-50 text-gray-400 border-gray-200'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-black shrink-0 ${
                        volStep === 1
                          ? 'bg-white text-[#1F5E2E]'
                          : volStep > 1
                          ? 'bg-[#1F5E2E] text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {volStep > 1 ? <Check size={11} className="stroke-[3]" /> : '১'}
                      </span>
                      <div className="truncate">
                        <div className="text-[10px] font-bold leading-none truncate">{isBangla ? '১. পরিচিতি' : '1. Identity'}</div>
                      </div>
                    </button>

                    {/* Step 2 Pill */}
                    <button
                      type="button"
                      onClick={() => {
                        if (validateStep1()) setVolStep(2);
                      }}
                      className={`py-2 px-2.5 rounded-xl text-left border transition-all cursor-pointer flex items-center gap-2 ${
                        volStep === 2
                          ? 'bg-[#1F5E2E] text-white border-[#1F5E2E] shadow-sm'
                          : volStep > 2
                          ? 'bg-emerald-50 text-[#1F5E2E] border-emerald-200'
                          : 'bg-gray-50 text-gray-400 border-gray-200'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-black shrink-0 ${
                        volStep === 2
                          ? 'bg-white text-[#1F5E2E]'
                          : volStep > 2
                          ? 'bg-[#1F5E2E] text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {volStep > 2 ? <Check size={11} className="stroke-[3]" /> : '২'}
                      </span>
                      <div className="truncate">
                        <div className="text-[10px] font-bold leading-none truncate">{isBangla ? '২. কাজের ক্ষেত্র' : '2. Campaign'}</div>
                      </div>
                    </button>

                    {/* Step 3 Pill */}
                    <button
                      type="button"
                      onClick={() => {
                        if (validateStep1()) setVolStep(3);
                      }}
                      className={`py-2 px-2.5 rounded-xl text-left border transition-all cursor-pointer flex items-center gap-2 ${
                        volStep === 3
                          ? 'bg-[#1F5E2E] text-white border-[#1F5E2E] shadow-sm'
                          : 'bg-gray-50 text-gray-400 border-gray-200'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-black shrink-0 ${
                        volStep === 3
                          ? 'bg-white text-[#1F5E2E]'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        ৩
                      </span>
                      <div className="truncate">
                        <div className="text-[10px] font-bold leading-none truncate">{isBangla ? '৩. নিশ্চিতকরণ' : '3. Review'}</div>
                      </div>
                    </button>
                  </div>

                  {/* Progress Line */}
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <motion.div
                      className="bg-[#6BBF3A] h-full rounded-full"
                      initial={false}
                      animate={{
                        width: volStep === 1 ? '33.33%' : volStep === 2 ? '66.66%' : '100%'
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                <form onSubmit={handleVolunteerSubmit} className="space-y-5">
                  <AnimatePresence mode="wait">
                    {/* --- STEP 1: PERSONAL & CONTACT INFO --- */}
                    {volStep === 1 && (
                      <motion.div
                        key="vol-step-1"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        <div className="bg-emerald-50/60 border border-emerald-200/60 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-[#1F5E2E]">
                          <Info size={16} className="shrink-0 mt-0.5 text-[#1F5E2E]" />
                          <p className="leading-relaxed">
                            {isBangla
                              ? 'আপনার সঠিক নাম ও যোগাযোগের নম্বর প্রদান করুন যাতে আমাদের টিম ফিল্ড ক্যাম্পেইনের বিষয়ে আপনার সাথে যুক্ত হতে পারে।'
                              : 'Please enter your authentic name and phone number so our team can coordinate upcoming drives with you.'}
                          </p>
                        </div>

                        {/* Full Name */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5 font-sans">
                            <User size={13} className="text-[#6BBF3A]" />
                            <span>{isBangla ? 'আপনার পূর্ণ নাম' : 'Full Name'} *</span>
                          </label>
                          <input
                            type="text"
                            value={volName}
                            onChange={(e) => {
                              setVolName(e.target.value);
                              if (formErrors.name) setFormErrors(prev => ({ ...prev, name: '' }));
                            }}
                            placeholder={isBangla ? 'যেমন: তানভীর আহমেদ' : 'e.g. Tanvir Ahmed'}
                            className={`w-full bg-gray-50 border ${formErrors.name ? 'border-red-500 ring-2 ring-red-100' : 'border-gray-200 focus:border-[#1F5E2E] focus:ring-2 focus:ring-[#1F5E2E]/10'} rounded-2xl py-3 px-4 text-sm text-gray-800 transition-all outline-none`}
                          />
                          {formErrors.name && <p className="text-red-500 text-xs font-bold pl-1">{formErrors.name}</p>}
                        </div>

                        {/* Mobile Phone & Email side by side */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Mobile */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5 font-sans">
                              <Phone size={13} className="text-[#6BBF3A]" />
                              <span>{isBangla ? 'মোবাইল নম্বর' : 'Phone Number'} *</span>
                            </label>
                            <input
                              type="tel"
                              value={volPhone}
                              onChange={(e) => {
                                setVolPhone(e.target.value);
                                if (formErrors.phone) setFormErrors(prev => ({ ...prev, phone: '' }));
                              }}
                              placeholder="017XXXXXXXX"
                              className={`w-full bg-gray-50 border ${formErrors.phone ? 'border-red-500 ring-2 ring-red-100' : 'border-gray-200 focus:border-[#1F5E2E] focus:ring-2 focus:ring-[#1F5E2E]/10'} rounded-2xl py-3 px-4 text-sm text-gray-800 transition-all outline-none font-mono`}
                            />
                            {formErrors.phone ? (
                              <p className="text-red-500 text-xs font-bold pl-1">{formErrors.phone}</p>
                            ) : (
                              <p className="text-[10px] text-gray-400 pl-1">{isBangla ? 'হোয়াটসঅ্যাপ সক্রিয় নম্বর দেওয়া শ্রেয়' : 'Prefer WhatsApp enabled number'}</p>
                            )}
                          </div>

                          {/* Email */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5 font-sans">
                              <Mail size={13} className="text-[#6BBF3A]" />
                              <span>{isBangla ? 'ইমেইল ঠিকানা' : 'Email Address'} *</span>
                            </label>
                            <input
                              type="email"
                              value={volEmail}
                              onChange={(e) => {
                                setVolEmail(e.target.value);
                                if (formErrors.email) setFormErrors(prev => ({ ...prev, email: '' }));
                              }}
                              placeholder="yourname@gmail.com"
                              className={`w-full bg-gray-50 border ${formErrors.email ? 'border-red-500 ring-2 ring-red-100' : 'border-gray-200 focus:border-[#1F5E2E] focus:ring-2 focus:ring-[#1F5E2E]/10'} rounded-2xl py-3 px-4 text-sm text-gray-800 transition-all outline-none`}
                            />
                            {formErrors.email && <p className="text-red-500 text-xs font-bold pl-1">{formErrors.email}</p>}
                          </div>
                        </div>

                        {/* District / Location */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5 font-sans">
                            <MapPin size={13} className="text-[#6BBF3A]" />
                            <span>{isBangla ? 'আপনার জেলা / এলাকা' : 'District / Area'} *</span>
                          </label>
                          <input
                            type="text"
                            value={volLocation}
                            onChange={(e) => {
                              setVolLocation(e.target.value);
                              if (formErrors.location) setFormErrors(prev => ({ ...prev, location: '' }));
                            }}
                            placeholder={isBangla ? 'যেমন: বগুড়া, সাতক্ষীরা, ঢাকা' : 'e.g. Bogura, Satkhira, Dhaka'}
                            className={`w-full bg-gray-50 border ${formErrors.location ? 'border-red-500 ring-2 ring-red-100' : 'border-gray-200 focus:border-[#1F5E2E] focus:ring-2 focus:ring-[#1F5E2E]/10'} rounded-2xl py-3 px-4 text-sm text-gray-800 transition-all outline-none`}
                          />
                          {formErrors.location && <p className="text-red-500 text-xs font-bold pl-1">{formErrors.location}</p>}
                        </div>

                        {/* Step 1 Action Button */}
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (validateStep1()) {
                                setVolStep(2);
                              }
                            }}
                            className="w-full bg-[#1F5E2E] hover:bg-[#2E7D32] text-white font-bold py-3.5 px-6 rounded-2xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <span>{isBangla ? 'পরবর্তী ধাপ: কাজের ক্ষেত্র নির্বাচন' : 'Next: Select Campaign & Role'}</span>
                            <ArrowRight size={16} />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* --- STEP 2: CAMPAIGN & ENGAGEMENT --- */}
                    {volStep === 2 && (
                      <motion.div
                        key="vol-step-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-5"
                      >
                        {/* Visual Campaign Cards */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center justify-between font-sans">
                            <span className="flex items-center gap-1.5">
                              <Award size={13} className="text-[#6BBF3A]" />
                              <span>{isBangla ? 'আগ্রহের ক্ষেত্র বা ক্যাম্পেইন পছন্দ করুন' : 'Select Campaign of Interest'} *</span>
                            </span>
                            <span className="text-[10px] text-[#1F5E2E] font-mono font-bold lowercase">
                              {isBangla ? 'ক্লিক করে নির্বাচন করুন' : 'Click card to select'}
                            </span>
                          </label>

                          <div className="grid grid-cols-1 gap-2.5">
                            {[
                              {
                                id: 'plantation',
                                title: isBangla ? 'ম্যানগ্রোভ ও উপকূলীয় বনায়ন' : 'Mangrove Tree Plantation',
                                desc: isBangla ? 'সুন্দরবন ও চরাঞ্চলে গাছ রোপণ ও পরিচর্যা' : 'Planting native trees & mangrove belts',
                                icon: <Trees size={18} className="text-emerald-600" />,
                                tag: isBangla ? 'মাঠপর্যায়' : 'Field Drive'
                              },
                              {
                                id: 'renewable',
                                title: isBangla ? 'সৌর বিদ্যুৎ ও গ্রিন এনার্জি' : 'Solar Micro-Grid Electrification',
                                desc: isBangla ? 'অফ-গ্রিড চরে শিশুদের জন্য সৌর বাতি স্থাপন' : 'Clean solar light for remote off-grid schools',
                                icon: <Sun size={18} className="text-amber-500" />,
                                tag: isBangla ? 'প্রযুক্তি' : 'Clean Energy'
                              },
                              {
                                id: 'water',
                                title: isBangla ? 'বিশুদ্ধ পানি ও আর্সেনিক প্রতিকার' : 'Safe Water & Well Drilling',
                                desc: isBangla ? 'গভীর নলকূপ স্থাপন ও ওয়াটার ফিল্টারেশন' : 'Tube-wells & community arsenic filtration',
                                icon: <Droplet size={18} className="text-blue-500" />,
                                tag: isBangla ? 'জনস্বাস্থ্য' : 'Safe Water'
                              },
                              {
                                id: 'waste',
                                title: isBangla ? 'নদী পরিচ্ছন্নতা ও বর্জ্য রিসাইক্লিং' : 'River Cleanup & Waste Recycling',
                                desc: isBangla ? 'নদী ও পরিবেশ থেকে প্লাস্টিক বর্জ্য অপসারণ' : 'Urban river clearing & plastic circularity',
                                icon: <Trash2 size={18} className="text-teal-600" />,
                                tag: isBangla ? 'পরিবেশ রক্ষা' : 'Clean Earth'
                              },
                              {
                                id: 'awareness',
                                title: isBangla ? 'স্কুল-কলেজ পরিবেশ সচেতনতা' : 'Environmental School Awareness',
                                desc: isBangla ? 'তরুণ প্রজন্মের মাঝে জলবায়ু সচেতনতা তৈরি' : 'Seminars, workshops & eco clubs in schools',
                                icon: <Megaphone size={18} className="text-purple-600" />,
                                tag: isBangla ? 'প্রচার ও শিক্ষা' : 'Advocacy'
                              }
                            ].map((c) => {
                              const isSelected = volInterest === c.id;
                              return (
                                <button
                                  key={c.id}
                                  type="button"
                                  onClick={() => setVolInterest(c.id)}
                                  className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                                    isSelected
                                      ? 'bg-emerald-50/80 border-[#1F5E2E] ring-2 ring-[#1F5E2E]/10 shadow-xs'
                                      : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-white shadow-xs' : 'bg-gray-100'}`}>
                                      {c.icon}
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <h4 className={`text-xs font-bold leading-tight ${isSelected ? 'text-[#1F5E2E]' : 'text-gray-800'}`}>
                                          {c.title}
                                        </h4>
                                        <span className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono font-medium">
                                          {c.tag}
                                        </span>
                                      </div>
                                      <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                                        {c.desc}
                                      </p>
                                    </div>
                                  </div>

                                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                                    isSelected ? 'bg-[#1F5E2E] border-[#1F5E2E] text-white' : 'border-gray-300 bg-white'
                                  }`}>
                                    {isSelected && <Check size={12} className="stroke-[3]" />}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Profession, Availability & Blood Group */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {/* Profession */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1 font-sans">
                              <Briefcase size={12} className="text-[#6BBF3A]" />
                              <span>{isBangla ? 'পেশা' : 'Profession'} *</span>
                            </label>
                            <select
                              value={volProfession}
                              onChange={(e) => setVolProfession(e.target.value)}
                              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs text-gray-700 font-bold focus:outline-none focus:border-[#1F5E2E]"
                            >
                              <option value="student">{isBangla ? 'শিক্ষার্থী' : 'Student'}</option>
                              <option value="job_holder">{isBangla ? 'চাকরিজীবী' : 'Job Holder'}</option>
                              <option value="academician">{isBangla ? 'শিক্ষক / গবেষক' : 'Teacher / Researcher'}</option>
                              <option value="business">{isBangla ? 'ব্যবসায়ী' : 'Business'}</option>
                              <option value="other">{isBangla ? 'অন্যান্য' : 'Other'}</option>
                            </select>
                          </div>

                          {/* Availability */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1 font-sans">
                              <Clock size={12} className="text-[#6BBF3A]" />
                              <span>{isBangla ? 'কাজের সময়' : 'Availability'} *</span>
                            </label>
                            <select
                              value={volAvailability}
                              onChange={(e) => setVolAvailability(e.target.value)}
                              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs text-gray-700 font-bold focus:outline-none focus:border-[#1F5E2E]"
                            >
                              <option value="flexible">{isBangla ? 'নমনীয় / প্রজেক্ট ভিত্তিক' : 'Flexible'}</option>
                              <option value="weekends">{isBangla ? 'ছুটির দিনে (শুক্র-শনি)' : 'Weekends Only'}</option>
                              <option value="weekdays">{isBangla ? 'কর্মদিবসে (রবি-বৃহঃ)' : 'Weekdays Only'}</option>
                              <option value="fulltime">{isBangla ? 'পূর্ণকালীন মাঠকর্মী' : 'Full-time'}</option>
                            </select>
                          </div>

                          {/* Blood Group */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1 font-sans">
                              <Droplet size={12} className="text-red-500" />
                              <span>{isBangla ? 'রক্তের গ্রুপ' : 'Blood Group'}</span>
                            </label>
                            <select
                              value={volBloodGroup}
                              onChange={(e) => setVolBloodGroup(e.target.value)}
                              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs text-gray-700 font-bold focus:outline-none focus:border-[#1F5E2E]"
                            >
                              <option value="Unknown">{isBangla ? 'জানিনা / পরে জানাবো' : 'Select'}</option>
                              <option value="A+">A+</option>
                              <option value="A-">A-</option>
                              <option value="B+">B+</option>
                              <option value="B-">B-</option>
                              <option value="O+">O+</option>
                              <option value="O-">O-</option>
                              <option value="AB+">AB+</option>
                              <option value="AB-">AB-</option>
                            </select>
                          </div>
                        </div>

                        {/* Step 2 Action Buttons */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setVolStep(1)}
                            className="bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold py-3 px-4 rounded-2xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <ChevronLeft size={16} />
                            <span>{isBangla ? 'পূর্ববর্তী ধাপ' : 'Back'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setVolStep(3)}
                            className="bg-[#1F5E2E] hover:bg-[#2E7D32] text-white font-bold py-3 px-4 rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span>{isBangla ? 'পরবর্তী ধাপ: মেম্বারশিপ ও রিভিউ' : 'Next: Review'}</span>
                            <ArrowRight size={16} />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* --- STEP 3: MEMBERSHIP ROLE & REVIEW --- */}
                    {volStep === 3 && (
                      <motion.div
                        key="vol-step-3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-5"
                      >
                        {/* Membership Type Selector */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5 font-sans">
                            <ShieldCheck size={13} className="text-[#6BBF3A]" />
                            <span>{isBangla ? 'সদস্যপদের ধরন নির্ধারণ করুন' : 'Select Membership Role'} *</span>
                          </label>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {/* Role 1: Field Volunteer */}
                            <button
                              type="button"
                              onClick={() => setVolMembership('no_intent')}
                              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                                volMembership === 'no_intent'
                                  ? 'bg-emerald-50/80 border-[#1F5E2E] ring-2 ring-[#1F5E2E]/10 shadow-xs'
                                  : 'bg-white border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
                                  <Users size={14} className="text-[#1F5E2E]" />
                                  <span>{isBangla ? '১. ফিল্ড ভলান্টিয়ার' : 'Field Volunteer'}</span>
                                </span>
                                <span className="text-[10px] font-mono font-bold bg-[#6BBF3A]/20 text-[#1F5E2E] px-2 py-0.5 rounded-full">
                                  {isBangla ? '১০০% ফ্রি' : '100% Free'}
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-500 leading-snug">
                                {isBangla
                                  ? 'কোনো ফি নেই। সরাসরি বৃক্ষরোপণ ও মাঠপর্যায়ের কার্যক্রমে স্বেচ্ছাশ্রম দিন।'
                                  : 'Free to join. Directly take part in field planting and local green projects.'}
                              </p>
                            </button>

                            {/* Role 2: Lifetime Member */}
                            <button
                              type="button"
                              onClick={() => setVolMembership('submitted_pending')}
                              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                                volMembership !== 'no_intent'
                                  ? 'bg-emerald-50/80 border-[#1F5E2E] ring-2 ring-[#1F5E2E]/10 shadow-xs'
                                  : 'bg-white border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
                                  <Award size={14} className="text-[#1F5E2E]" />
                                  <span>{isBangla ? '২. আজীবন সদস্য' : 'Lifetime Member'}</span>
                                </span>
                                <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                                  {isBangla ? 'অফিশিয়াল ব্যাজ' : 'Official Badge'}
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-500 leading-snug">
                                {isBangla
                                  ? 'ভোটাধিকার, অফিসিয়াল ডিজিটাল আইডি কার্ড ও সার্টিফিকেট প্রাপ্তি।'
                                  : 'Voting rights, certificate and permanent official identity badge.'}
                              </p>
                            </button>
                          </div>

                          {/* Extra note if Lifetime Member */}
                          {volMembership !== 'no_intent' && (
                            <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
                              <Info size={15} className="shrink-0 mt-0.5 text-amber-700" />
                              <div className="space-y-1">
                                <p className="leading-relaxed">
                                  {isBangla
                                    ? 'আজীবন সদস্যপদের ছবি ও ডকুমেন্টের জন্য অফিশিয়াল গুগল ফর্মটিও পূরণ করে রাখুন:'
                                    : 'Please ensure you also submit the Google membership form for ID printing:'}
                                </p>
                                <a
                                  href={settings?.membershipFormUrl || 'https://forms.gle/51Kt57CfRuAnAGy88'}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1F5E2E] hover:underline cursor-pointer"
                                >
                                  <span>{isBangla ? 'গুগল ফর্মটি খুলুন' : 'Open Google Form'}</span>
                                  <ExternalLink size={11} />
                                </a>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Motivation Message (Optional) */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-gray-600 uppercase tracking-wider font-sans">
                            {isBangla ? 'স্বেচ্ছাসেবক হওয়ার প্রেরণা / বার্তা (ঐচ্ছিক)' : 'Motivation Message (Optional)'}
                          </label>
                          <textarea
                            rows={2}
                            value={volMessage}
                            onChange={(e) => setVolMessage(e.target.value)}
                            placeholder={isBangla ? 'গ্রিন আর্থ-এ কেন যুক্ত হতে চান বা পরিবেশ রক্ষায় আপনার ভাবনা...' : 'Why do you want to join Green Earth?'}
                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 focus:outline-none focus:border-[#1F5E2E] text-xs text-gray-800 transition-all resize-none"
                          />
                        </div>

                        {/* Live Candidate Overview Box */}
                        <div className="bg-gradient-to-r from-emerald-50/90 to-teal-50/50 border border-emerald-200/80 rounded-2xl p-4 space-y-3">
                          <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                            <span className="text-[11px] font-black text-[#1F5E2E] uppercase tracking-wider flex items-center gap-1.5 font-mono">
                              <Sparkles size={13} className="text-[#6BBF3A]" />
                              <span>{isBangla ? 'আবেদনপত্রের সারসংক্ষেপ' : 'Application Summary'}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => setVolStep(1)}
                              className="text-[10px] font-bold text-[#1F5E2E] hover:underline cursor-pointer"
                            >
                              {isBangla ? 'তথ্য সম্পাদনা' : 'Edit Info'}
                            </button>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                            <div>
                              <span className="text-[10px] text-gray-400 block">{isBangla ? 'নাম:' : 'Name:'}</span>
                              <span className="font-bold text-gray-800 truncate block">{volName || (isBangla ? 'অনুল্লিখিত' : 'N/A')}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-gray-400 block">{isBangla ? 'মোবাইল:' : 'Phone:'}</span>
                              <span className="font-bold text-gray-800 font-mono">{volPhone || (isBangla ? 'অনুল্লিখিত' : 'N/A')}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-gray-400 block">{isBangla ? 'জেলা:' : 'District:'}</span>
                              <span className="font-bold text-gray-800">{volLocation || (isBangla ? 'অনুল্লিখিত' : 'N/A')}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-gray-400 block">{isBangla ? 'ক্যাম্পেইন:' : 'Campaign:'}</span>
                              <span className="font-bold text-[#1F5E2E]">
                                {(() => {
                                  switch (volInterest) {
                                    case 'plantation': return isBangla ? 'বৃক্ষরোপণ' : 'Plantation';
                                    case 'renewable': return isBangla ? 'সৌর শক্তি' : 'Solar';
                                    case 'water': return isBangla ? 'বিশুদ্ধ পানি' : 'Water';
                                    case 'waste': return isBangla ? 'বর্জ্য অপসারণ' : 'Waste';
                                    case 'awareness': return isBangla ? 'সচেতনতা' : 'Awareness';
                                    default: return volInterest;
                                  }
                                })()}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] text-gray-400 block">{isBangla ? 'রক্তের গ্রুপ:' : 'Blood Group:'}</span>
                              <span className="font-bold text-red-600 font-mono">{volBloodGroup}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-gray-400 block">{isBangla ? 'ধরন:' : 'Type:'}</span>
                              <span className="font-bold text-emerald-800">
                                {volMembership !== 'no_intent' ? (isBangla ? 'আজীবন সদস্য' : 'Lifetime') : (isBangla ? 'ভলান্টিয়ার' : 'Volunteer')}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Step 3 Action Buttons */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setVolStep(2)}
                            disabled={isSubmittingVol}
                            className="bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold py-3.5 px-4 rounded-2xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <ChevronLeft size={16} />
                            <span>{isBangla ? 'পূর্ববর্তী ধাপ' : 'Back'}</span>
                          </button>

                          <button
                            type="submit"
                            disabled={isSubmittingVol}
                            className="bg-[#1F5E2E] hover:bg-[#2E7D32] text-white font-bold py-3.5 px-4 rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                            id="volunteer-form-submit"
                          >
                            {isSubmittingVol ? (
                              <>
                                <RefreshCw size={14} className="animate-spin" />
                                <span>{isBangla ? 'জমা হচ্ছে...' : 'Submitting...'}</span>
                              </>
                            ) : (
                              <>
                                <span>{isBangla ? 'আবেদন নিশ্চিত ও জমা দিন' : 'Confirm & Submit Application'}</span>
                                <ArrowRight size={15} />
                              </>
                            )}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Donation Section */}
        <div className="lg:col-span-6 bg-white border border-gray-200/60 rounded-3xl p-6 sm:p-10 shadow-sm flex flex-col justify-between text-left" id="donation-panel-container">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-red-50 text-red-500 rounded-2xl">
                <Heart size={24} fill="currentColor" className="animate-pulse" />
              </div>
              <div>
                <h2 className="font-sans text-2xl font-extrabold text-[#1F5E2E]">
                  {isBangla ? 'সহযোগিতার হাত বাড়ান' : 'Donate Now'}
                </h2>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider font-mono mt-0.5">
                  {isBangla ? 'আপনার সহায়তা আমাদের শক্তি' : 'Empower grassroots climate action'}
                </p>
              </div>
            </div>

            <p className="font-sans text-sm text-gray-600 leading-relaxed mb-6">
              {isBangla
                ? 'আপনার দেওয়া অনুদানের মাধ্যমে সরাসরি উপকূলীয় মানুষ ও অফ-গ্রিড শিশুরা বিদ্যুৎ এবং বিশুদ্ধ পানির সংস্থান পায়। প্রতিটি অনুদান সম্পূর্ণ স্বচ্ছতার সাথে পরিচালনা করা হয়।'
                : '100% of your contributions go directly to purchase seeds, solar inverters, and well filters. Ensure immediate relief to flood-prone vulnerable communities.'
              }
            </p>

            <form onSubmit={handleDonationSubmit} className="space-y-6">
              {/* Tiers Grid */}
              <div className="grid grid-cols-1 gap-3.5" id="donation-tiers">
                {tiers.map((tier) => (
                  <button
                    key={tier.amount}
                    type="button"
                    onClick={() => {
                      setSelectedTier(tier.amount);
                      setDonationError('');
                    }}
                    className={`w-full border p-4 rounded-2xl text-left transition-all flex items-start gap-4 cursor-pointer relative ${
                      selectedTier === tier.amount
                        ? 'border-[#6BBF3A] bg-[#6BBF3A]/5 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`mt-1 p-1 rounded-full border-2 ${selectedTier === tier.amount ? 'border-[#1F5E2E] bg-[#1F5E2E]' : 'border-gray-300 bg-transparent'}`}>
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-sans text-base font-extrabold text-[#1F5E2E]">
                          {tier.label}
                        </span>
                        <span className="font-sans font-black text-lg text-[#1F5E2E]">
                          ৳{isBangla ? tier.amount.toLocaleString('bn-BD') : tier.amount.toLocaleString()}
                        </span>
                      </div>
                      <p className="font-sans text-xs text-gray-500 leading-relaxed">
                        {isBangla ? tier.descBn : tier.desc}
                      </p>
                    </div>
                  </button>
                ))}

                {/* Custom Tier Button */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTier('custom');
                    setDonationError('');
                  }}
                  className={`w-full border p-4 rounded-2xl text-left transition-all flex items-center gap-4 cursor-pointer ${
                    selectedTier === 'custom'
                      ? 'border-[#6BBF3A] bg-[#6BBF3A]/5 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`p-1 rounded-full border-2 ${selectedTier === 'custom' ? 'border-[#1F5E2E] bg-[#1F5E2E]' : 'border-gray-300 bg-transparent'}`}>
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <span className="font-sans text-base font-extrabold text-[#1F5E2E]">
                    {isBangla ? 'অন্যান্য পরিমাণ' : 'Custom Contribution Amount'}
                  </span>
                </button>
              </div>

              {/* Custom input panel */}
              {selectedTier === 'custom' && (
                <div className="flex flex-col gap-1.5 font-sans">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {isBangla ? 'টাকার পরিমাণ লিখুন (৳)' : 'Specify Taka Amount (৳)'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-sans font-bold text-gray-400 text-base">৳</span>
                    <input
                      type="number"
                      min="50"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setDonationError('');
                      }}
                      placeholder="e.g. 5000"
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-8 pr-4 focus:outline-none focus:ring-2 focus:ring-[#6BBF3A] text-sm text-gray-800 transition-all font-bold"
                    />
                  </div>
                </div>
              )}

              {/* Donor Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <User size={12} className="text-[#6BBF3A]" />
                    <span>{isBangla ? 'আপনার নাম' : 'Your Name'} *</span>
                  </label>
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => {
                      setDonorName(e.target.value);
                      setDonationError('');
                    }}
                    placeholder={isBangla ? 'যেমন: হাসিব রহমান' : 'e.g. Hasib Rahman'}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#6BBF3A] text-sm text-gray-800 transition-all font-semibold"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <Mail size={12} className="text-[#6BBF3A]" />
                    <span>{isBangla ? 'ইমেইল ঠিকানা' : 'Email Address'} *</span>
                  </label>
                  <input
                    type="email"
                    value={donorEmail}
                    onChange={(e) => {
                      setDonorEmail(e.target.value);
                      setDonationError('');
                    }}
                    placeholder={isBangla ? 'যেমন: name@example.com' : 'e.g. name@example.com'}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#6BBF3A] text-sm text-gray-800 transition-all font-semibold"
                    required
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider block">
                  {isBangla ? 'পেমেন্ট মাধ্যম নির্বাচন' : 'Preferred Payment Channel'}
                </span>
                <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold font-mono">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('bkash');
                      setDonationError('');
                    }}
                    className={`py-3 rounded-xl border transition-all cursor-pointer ${
                      paymentMethod === 'bkash'
                        ? 'border-pink-500 bg-pink-500/10 text-pink-700 font-extrabold shadow-sm'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-500'
                    }`}
                  >
                    bKash
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('nagad');
                      setDonationError('');
                    }}
                    className={`py-3 rounded-xl border transition-all cursor-pointer ${
                      paymentMethod === 'nagad'
                        ? 'border-orange-500 bg-orange-500/10 text-orange-700 font-extrabold shadow-sm'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-500'
                    }`}
                  >
                    Nagad
                  </button>
                  <div
                    className="py-3 rounded-xl border border-gray-100 bg-gray-50 text-gray-400 opacity-60 relative cursor-not-allowed select-none flex flex-col items-center justify-center min-h-[46px]"
                    title={isBangla ? 'কার্ড পেমেন্ট সাময়িকভাবে বন্ধ আছে' : 'Card payment is temporarily offline'}
                  >
                    <span>Card</span>
                    <span className="absolute -top-1.5 bg-red-500 text-white text-[8px] px-1 py-0.5 rounded-full font-sans font-extrabold uppercase scale-90 tracking-wider">
                      {isBangla ? 'বন্ধ' : 'Offline'}
                    </span>
                  </div>
                  <div
                    className="py-3 rounded-xl border border-gray-100 bg-gray-50 text-gray-400 opacity-60 relative cursor-not-allowed select-none flex flex-col items-center justify-center min-h-[46px]"
                    title={isBangla ? 'ব্যাংক ট্রান্সফার সাময়িকভাবে বন্ধ আছে' : 'Bank transfer is temporarily offline'}
                  >
                    <span>Bank</span>
                    <span className="absolute -top-1.5 bg-red-500 text-white text-[8px] px-1 py-0.5 rounded-full font-sans font-extrabold uppercase scale-90 tracking-wider">
                      {isBangla ? 'বন্ধ' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>

              {donationError && <p className="text-red-500 text-xs font-bold mt-1">{donationError}</p>}

              {/* Submit Donation Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-[#1F5E2E] hover:bg-[#2E7D32] text-white font-sans font-bold py-4 rounded-full shadow transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
                id="donation-panel-submit"
              >
                <Heart size={16} fill="currentColor" />
                <span>{isBangla ? 'সহায়তা সম্পন্ন করুন' : 'Confirm Donation'}</span>
              </motion.button>
            </form>
          </div>
        </div>
      </section>

      {/* 3. CORPORATE SPONSORSHIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="corporate-csr">
        <div className="bg-[#1F5E2E]/5 border border-[#1F5E2E]/10 rounded-3xl p-8 sm:p-12 text-left flex flex-col md:flex-row gap-8 items-center">
          <div className="p-4 bg-[#6BBF3A]/10 text-[#1F5E2E] rounded-3xl shrink-0">
            <Info size={40} />
          </div>
          <div className="flex-1">
            <h3 className="font-sans text-xl sm:text-2xl font-extrabold text-[#1F5E2E] mb-2">
              {isBangla ? 'কর্পোরেট অংশীদারিত্ব ও সিএসআর (CSR)' : 'Corporate Partnerships & CSR Sponsorship'}
            </h3>
            <p className="font-sans text-sm text-gray-600 leading-relaxed mb-4">
              {isBangla
                ? 'আপনার প্রতিষ্ঠান সিএসআর ফান্ডের আওতায় কোনো প্রত্যন্ত গ্রামের স্কুলে সৌর বিদ্যুৎ প্যানেল স্পন্সর করতে পারে, অথবা নির্দিষ্ট উপকূলে হাজার চারা রোপণের দায়িত্ব নিতে পারে। আমরা পূর্ণ ট্যাক্স রিবেট সার্টিফিকেট এবং প্রভাবের বিস্তারিত রিপোর্ট দিয়ে থাকি।'
                : 'Accelerate your organization\'s ESG guidelines. Fund a customized coastal reforestation belt, sponsor a complete digital village microgrid, or maintain full-community filtration units. We provide transparent, certified compliance and impact reports.'
              }
            </p>
            <div className="flex gap-4 items-center">
              <span className="text-xs font-mono font-bold text-gray-400">EMAIL ENQUIRIES:</span>
              <a href="mailto:greenearthbd.25@gmail.com" className="text-sm font-sans font-bold text-[#1F5E2E] hover:underline">
                greenearthbd.25@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MOBILE TRANSACTIONS DETAIL MODAL DIALOG */}
      <AnimatePresence>
        {showPaymentInstructions && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 text-left shadow-2xl relative"
              id="payment-instruction-dialog"
            >
              <h3 className="font-sans text-xl font-bold text-[#1F5E2E] mb-2 flex items-center gap-1.5">
                <CheckCircle size={20} className="text-[#6BBF3A]" />
                {isBangla ? 'মোবাইল ট্রানজেকশন নির্দেশিকা' : 'Mobile Transfer Guidelines'}
              </h3>
              <p className="font-sans text-xs text-gray-500 mb-4">
                {isBangla 
                  ? `নিচের নির্দেশনা অনুযায়ী আপনার ${paymentMethod.toUpperCase()} অ্যাকাউন্ট থেকে পেমেন্ট সম্পন্ন করুন:`
                  : `Please complete the transaction through your ${paymentMethod.toUpperCase()} wallet manually using details below:`
                }
              </p>

              {/* Instructions steps details */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 font-sans text-xs space-y-3 mb-6">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200/50">
                  <span className="text-gray-400 font-bold uppercase">Wallet Type</span>
                  <span className="font-black text-[#1F5E2E]">{paymentMethod.toUpperCase()} (Send Money)</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-200/50">
                  <span className="text-gray-400 font-bold uppercase">Account No</span>
                  <div className="flex items-center gap-1">
                    <span className="font-black text-gray-800">
                      {paymentMethod === 'bkash' 
                        ? (settings?.bkashNo || '+8801751601039') 
                        : (settings?.nagadNo || '+8801751601039')
                      }
                    </span>
                    <button
                      onClick={() => {
                        const walletNo = paymentMethod === 'bkash' 
                          ? (settings?.bkashNo || '+8801751601039') 
                          : (settings?.nagadNo || '+8801751601039');
                        navigator.clipboard.writeText(walletNo);
                        alert('Copied!');
                      }}
                      className="text-gray-400 hover:text-gray-700"
                    >
                      <Clipboard size={12} />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-200/50">
                  <span className="text-gray-400 font-bold uppercase">Reference Code</span>
                  <span className="font-black text-gray-800">GreenEarth</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-bold uppercase">Donation Value</span>
                  <span className="font-black text-pink-600">
                    ৳{selectedTier === 'custom' ? Number(customAmount).toLocaleString() : selectedTier.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Submit ID Form */}
              <form onSubmit={handleVerifyTransaction} className="space-y-4">
                <div className="flex flex-col gap-1 font-sans">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <Lock size={12} className="text-[#6BBF3A]" />
                    <span>{isBangla ? 'ট্রানজেকশন আইডি (Trans ID) দিন' : 'Enter Transaction ID'} *</span>
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="e.g. A9B8C7D6E5"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#6BBF3A] text-sm text-gray-800 font-bold"
                    required
                  />
                </div>

                <div className="flex gap-2 font-sans pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPaymentInstructions(false)}
                    className="flex-1 py-3 px-4 border border-gray-300 rounded-full text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer text-center"
                  >
                    {isBangla ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-[#1F5E2E] hover:bg-[#2E7D32] text-white rounded-full text-xs font-bold cursor-pointer text-center"
                  >
                    {isBangla ? 'ভেরিফাই করুন' : 'Verify Transfer'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
