/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Heart, CheckCircle, Info, Lock, ArrowRight, User, Mail, Phone, Calendar, MapPin, Clipboard, Briefcase, Clock, Droplet, Users } from 'lucide-react';

interface InvolvedProps {
  isBangla: boolean;
  onFormSuccess: (title: string, message: string) => void;
  settings?: any;
}

export default function Involved({ isBangla, onFormSuccess, settings }: InvolvedProps) {
  // Volunteer Form State
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

  // Donation State
  const [selectedTier, setSelectedTier] = useState<number | 'custom'>(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'card' | 'bank'>('bkash');
  const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donationError, setDonationError] = useState('');

  // Handle volunteer submission
  const handleVolunteerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!volName.trim()) {
      errors.name = isBangla ? 'আপনার নাম দিন' : 'Please enter your name';
    }
    if (!volEmail.trim()) {
      errors.email = isBangla ? 'আপনার ইমেইল দিন' : 'Please enter your email';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(volEmail)) {
        errors.email = isBangla ? 'সঠিক ইমেইল ঠিকানা দিন' : 'Please enter a valid email';
      }
    }
    if (!volPhone.trim()) {
      errors.phone = isBangla ? 'আপনার মোবাইল নম্বর দিন' : 'Please enter your phone number';
    } else {
      const bdPhoneRegex = /^(?:\+88|01)?\d{11}$/;
      if (!bdPhoneRegex.test(volPhone.replace(/\s+/g, ''))) {
        errors.phone = isBangla ? 'সঠিক ১১-ডিজিটের মোবাইল নম্বর দিন' : 'Please enter a valid 11-digit phone number';
      }
    }
    if (!volLocation.trim()) {
      errors.location = isBangla ? 'আপনার এলাকা বা জেলার নাম লিখুন' : 'Please enter your district/area';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

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
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    const executeClientFallbackVolunteer = () => {
      try {
        const savedVols = localStorage.getItem('volunteers');
        const currentVols = savedVols ? JSON.parse(savedVols) : [];
        
        const fallbackVol = {
          ...payload,
          id: `VOL-LOCAL-${Date.now()}`,
          status: 'pending'
        };

        const updatedVols = [...currentVols, fallbackVol];
        localStorage.setItem('volunteers', JSON.stringify(updatedVols));

        setVolName('');
        setVolEmail('');
        setVolPhone('');
        setVolMessage('');
        setVolLocation('');
        setVolMembership('no_intent');
        setVolProfession('student');
        setVolBloodGroup('Unknown');
        setVolAvailability('flexible');

        onFormSuccess(
          isBangla ? 'আবেদন সম্পন্ন হয়েছে!' : 'Application Submitted!',
          isBangla 
            ? 'স্বেচ্ছাসেবী হিসেবে আপনার পেশাদার আবেদনটি সফলভাবে সম্পন্ন হয়েছে। আমাদের টিম খুব শীঘ্রই আপনার সাথে যোগাযোগ করবে!' 
            : 'Your professional volunteer application has been successfully submitted! Our coordinator team will review your details and connect with you shortly.'
        );
      } catch (fallbackErr) {
        console.error("Volunteer fallback failed:", fallbackErr);
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
        setVolName('');
        setVolEmail('');
        setVolPhone('');
        setVolMessage('');
        setVolLocation('');
        setVolMembership('no_intent');
        setVolProfession('student');
        setVolBloodGroup('Unknown');
        setVolAvailability('flexible');

        onFormSuccess(
          isBangla ? 'আবেদন সম্পন্ন হয়েছে!' : 'Application Submitted!',
          isBangla 
            ? 'স্বেচ্ছাসেবী হিসেবে আপনার পেশাদার আবেদনটি সফলভাবে সম্পন্ন হয়েছে। আমাদের টিম খুব শীঘ্রই আপনার সাথে যোগাযোগ করবে!' 
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
        date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
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
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
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
        
        {/* Left Col: Volunteer Signup Form */}
        <div className="lg:col-span-6 bg-white border border-gray-200/60 rounded-3xl p-6 sm:p-10 shadow-sm flex flex-col justify-between text-left" id="volunteer-form-container">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-[#6BBF3A]/10 text-[#1F5E2E] rounded-2xl">
                {volMembership === 'no_intent' ? <Users size={24} className="text-[#1F5E2E]" /> : <Award size={24} className="text-[#1F5E2E]" />}
              </div>
              <div>
                <h2 className="font-sans text-2xl font-extrabold text-[#1F5E2E]">
                  {volMembership === 'no_intent'
                    ? (isBangla ? '১. ফিল্ড ভলান্টিয়ার নিবন্ধন' : '1. Field Volunteer Registration')
                    : (isBangla ? '২. আজীবন সদস্য নিবন্ধন' : '2. Lifetime Member Registration')}
                </h2>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider font-mono mt-0.5">
                  {volMembership === 'no_intent'
                    ? (isBangla ? 'মাঠ পর্যায়ে পরিবর্তন আনুন' : 'Join our grassroots crew')
                    : (isBangla ? 'গুগল ফরম সাবমিটের পর তথ্য লিংক করুন' : 'Link your submitted Google form profile')}
                </p>
              </div>
            </div>

            <p className="font-sans text-sm text-gray-600 leading-relaxed mb-6">
              {volMembership === 'no_intent'
                ? (isBangla
                    ? 'সুন্দরবনে ম্যানগ্রোভ রোপণ, উত্তরাঞ্চলের চরে স্কুলগুলোতে সৌরবিদ্যুৎ স্থাপন, অথবা বুড়িগঙ্গায় প্লাস্টিক পরিষ্কারের অভিযানে সরাসরি অংশ নিতে নিচের দ্রুত ফর্মটি পূরণ করুন।'
                    : 'Join our planting drives in Satkhira, build clean solar systems in Kurigram chars, or participate in urban recycling projects. No prior expertise required.')
                : (isBangla
                    ? 'আজীবন সদস্যপদের সকল সুযোগ-সুবিধা এবং অফিশিয়াল আইডি কার্ড পেতে প্রথমে ১ নম্বর ধাপে গুগল ফর্মটি পূরণ করুন, তারপর ২ নম্বর ধাপে আপনার আইডি লিংক করতে নিচের তথ্যগুলো সাবমিট করুন।'
                    : 'To claim your Lifetime Member benefits and print your ID card, please fill out the official Google form first (Step 1), then submit the registration below to link your account (Step 2).')
              }
            </p>

            {/* Path Selection Tabs */}
            <div className="bg-gray-100 p-1.5 rounded-2xl grid grid-cols-2 gap-1.5 mb-6 border border-gray-200/50">
              <button
                type="button"
                onClick={() => {
                  setVolMembership('no_intent');
                }}
                className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-sans font-black transition-all duration-200 cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                  volMembership === 'no_intent'
                    ? 'bg-[#1F5E2E] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                }`}
              >
                <Users size={16} />
                <span>{isBangla ? 'ভলান্টিয়ার' : 'Volunteer'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setVolMembership('submitted_pending');
                }}
                className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-sans font-black transition-all duration-200 cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                  volMembership !== 'no_intent'
                    ? 'bg-[#1F5E2E] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                }`}
              >
                <Award size={16} />
                <span>{isBangla ? 'আজীবন সদস্য' : 'Lifetime Member'}</span>
              </button>
            </div>

            {/* Interactive Step / Instruction Guides */}
            <AnimatePresence mode="wait">
              {volMembership === 'no_intent' ? (
                <motion.div
                  key="volunteer-info"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-[#6BBF3A]/5 border border-[#6BBF3A]/20 rounded-2xl p-4 mb-6 flex gap-3 text-left animate-fade-in"
                >
                  <Info size={18} className="text-[#1F5E2E] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-[#1F5E2E] uppercase tracking-wider">
                      {isBangla ? 'মাঠপর্যায়ের ভলান্টিয়ারিং নির্দেশিকা' : 'Field Volunteering Instructions'}
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {isBangla
                        ? 'এটি সম্পূর্ণ বিনামূল্যে এবং কোনো অতিরিক্ত ফরম পূরণ করতে হবে না। আমাদের পরবর্তী বৃক্ষরোপণ বা মাঠপর্যায়ের কর্মসূচির পূর্বে আমরা আপনার সাথে সরাসরি যোগাযোগ করব।'
                        : 'Completely free to join. No extra paperwork required. We will contact you directly before our next field plantation, solar microgrid, or clean water deployment.'}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="membership-info"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-[#1F5E2E]/5 border border-[#1F5E2E]/20 rounded-2xl p-5 mb-6 space-y-4 text-left animate-fade-in"
                >
                  <div className="flex gap-3">
                    <Award size={20} className="text-[#1F5E2E] shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-[#1F5E2E] uppercase tracking-wider">
                        {isBangla ? 'আজীবন সদস্যপদ পাওয়ার ২ টি সহজ ধাপ' : '2 Easy Steps for Lifetime Membership'}
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {isBangla
                          ? 'গ্রিন আর্থ-এর একজন অফিশিয়াল আজীবন সদস্য (আইডি কার্ড, ভোটাধিকার এবং সার্টিফিকেট সহ) হতে নিচে উল্লেখিত ২টি ধাপ সম্পন্ন করুন:'
                          : 'To become an official approved Lifetime Member of Green Earth (including ID Card, Certificate, and voting rights), complete both steps below:'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3.5 pl-6 border-l-2 border-[#1F5E2E]/20">
                    {/* Step 1 */}
                    <div className="space-y-1 relative">
                      <span className="absolute -left-[33px] top-0 bg-[#1F5E2E] text-white text-[10px] font-mono font-black h-5 w-5 rounded-full flex items-center justify-center">1</span>
                      <h5 className="text-xs font-bold text-gray-800">
                        {isBangla ? 'অফিশিয়াল গুগল ফর্মটি পূরণ করুন' : 'Fill out the Google Membership Form'}
                      </h5>
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        {isBangla
                          ? 'আপনার সার্টিফিকেট এবং আইডি কার্ডের জন্য প্রয়োজনীয় তথ্য ও ছবি প্রদান করতে গুগল ফর্মটি সাবমিট করুন।'
                          : 'Submit your formal details, documents, and profile photo for printing the physical and digital membership ID card.'}
                      </p>
                      <div className="pt-1.5">
                        <motion.a
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          href={settings?.membershipFormUrl || 'https://forms.gle/51Kt57CfRuAnAGy88'}
                          target="_blank"
                          referrerPolicy="no-referrer"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 bg-[#1F5E2E] hover:bg-[#2E7D32] text-white font-sans font-black text-xs py-2 px-4 rounded-xl shadow-sm transition-colors cursor-pointer"
                        >
                          <span>{isBangla ? 'মেম্বারশিপ গুগল ফর্মটি খুলুন' : 'Open Google Form'}</span>
                          <ArrowRight size={12} />
                        </motion.a>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="space-y-1 relative">
                      <span className="absolute -left-[33px] top-0 bg-[#1F5E2E] text-white text-[10px] font-mono font-black h-5 w-5 rounded-full flex items-center justify-center">2</span>
                      <h5 className="text-xs font-bold text-gray-800">
                        {isBangla ? 'নিচের ডাটাবেজ ফর্মটি সাবমিট করুন' : 'Submit the Database Profile below'}
                      </h5>
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        {isBangla
                          ? 'নিচের ফর্মটিতে আপনার নাম, ফোন ও ইমেইল দিয়ে সাবমিট করুন যাতে আমাদের ডাটাবেজে আপনার সদস্যপদ লিংক করা যায়।'
                          : 'Fill out and submit your profile details below to link your account. This registers your record in our system so admins can review and approve.'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#1F5E2E]/10">
                    <label className="text-[10px] font-bold text-[#1F5E2E] uppercase tracking-wider block mb-1">
                      {isBangla ? 'আপনার মেম্বারশিপ স্ট্যাটাস নির্ধারণ করুন' : 'Select your Membership Status'}
                    </label>
                    <select
                      value={volMembership}
                      onChange={(e) => setVolMembership(e.target.value)}
                      className="w-full bg-white border border-[#1F5E2E]/20 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#1F5E2E] text-xs text-gray-700 font-bold transition-all"
                    >
                      <option value="submitted_pending">
                        {isBangla 
                          ? 'হ্যাঁ, আমি আজ গুগল ফর্মটি পূরণ করেছি (নতুন সদস্য)' 
                          : 'Yes, I filled out the Google Form (New Member)'}
                      </option>
                      <option value="already_member">
                        {isBangla 
                          ? 'আমি ইতিমধ্যে গ্রিন আর্থ-এর একজন সক্রিয় সদস্য' 
                          : 'I am already an active approved Lifetime Member'}
                      </option>
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleVolunteerSubmit} className="space-y-5 font-sans">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                  <User size={12} className="text-[#6BBF3A]" />
                  <span>{isBangla ? 'আপনার পূর্ণ নাম' : 'Full Name'} *</span>
                </label>
                <input
                  type="text"
                  value={volName}
                  onChange={(e) => setVolName(e.target.value)}
                  placeholder={isBangla ? 'যেমন: তানভীর আহমেদ' : 'e.g. Tanvir Ahmed'}
                  className={`w-full bg-gray-50 border ${formErrors.name ? 'border-red-500' : 'border-gray-200'} rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#6BBF3A] text-sm text-gray-800 transition-all`}
                />
                {formErrors.name && <p className="text-red-500 text-xs font-bold pl-1">{formErrors.name}</p>}
              </div>

              {/* Email & Phone side by side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <Mail size={12} className="text-[#6BBF3A]" />
                    <span>{isBangla ? 'ইমেইল ঠিকানা' : 'Email Address'} *</span>
                  </label>
                  <input
                    type="email"
                    value={volEmail}
                    onChange={(e) => setVolEmail(e.target.value)}
                    placeholder="name@example.com"
                    className={`w-full bg-gray-50 border ${formErrors.email ? 'border-red-500' : 'border-gray-200'} rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#6BBF3A] text-sm text-gray-800 transition-all`}
                  />
                  {formErrors.email && <p className="text-red-500 text-xs font-bold pl-1">{formErrors.email}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <Phone size={12} className="text-[#6BBF3A]" />
                    <span>{isBangla ? 'মোবাইল নম্বর' : 'Phone Number'} *</span>
                  </label>
                  <input
                    type="tel"
                    value={volPhone}
                    onChange={(e) => setVolPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className={`w-full bg-gray-50 border ${formErrors.phone ? 'border-red-500' : 'border-gray-200'} rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#6BBF3A] text-sm text-gray-800 transition-all`}
                  />
                  {formErrors.phone && <p className="text-red-500 text-xs font-bold pl-1">{formErrors.phone}</p>}
                </div>
              </div>

              {/* District/Location & Blood Group side by side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <MapPin size={12} className="text-[#6BBF3A]" />
                    <span>{isBangla ? 'বাসস্থান / জেলা' : 'District / Area'} *</span>
                  </label>
                  <input
                    type="text"
                    value={volLocation}
                    onChange={(e) => setVolLocation(e.target.value)}
                    placeholder={isBangla ? 'যেমন: ঢাকা, সাতক্ষীরা' : 'e.g. Dhaka, Satkhira'}
                    className={`w-full bg-gray-50 border ${formErrors.location ? 'border-red-500' : 'border-gray-200'} rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#6BBF3A] text-sm text-gray-800 transition-all`}
                  />
                  {formErrors.location && <p className="text-red-500 text-xs font-bold pl-1">{formErrors.location}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <Droplet size={12} className="text-red-500" />
                    <span>{isBangla ? 'রক্তের গ্রুপ (জরুরি কাজের জন্য)' : 'Blood Group (For fieldwork)'}</span>
                  </label>
                  <select
                    value={volBloodGroup}
                    onChange={(e) => setVolBloodGroup(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#6BBF3A] text-sm text-gray-700 transition-all"
                  >
                    <option value="Unknown">{isBangla ? 'জানিনা / পরে জানাবো' : 'Do not know / Select'}</option>
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

              {/* Profession & Availability side by side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <Briefcase size={12} className="text-[#6BBF3A]" />
                    <span>{isBangla ? 'পেশা / কার্যক্রম' : 'Profession / Student'} *</span>
                  </label>
                  <select
                    value={volProfession}
                    onChange={(e) => setVolProfession(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#6BBF3A] text-sm text-gray-700 transition-all"
                  >
                    <option value="student">{isBangla ? 'শিক্ষার্থী' : 'Student'}</option>
                    <option value="job_holder">{isBangla ? 'চাকরিজীবী / পেশাজীবী' : 'Job Holder / Professional'}</option>
                    <option value="academician">{isBangla ? 'শিক্ষক / গবেষক' : 'Teacher / Researcher'}</option>
                    <option value="business">{isBangla ? 'ব্যবসায়ী' : 'Business Owner'}</option>
                    <option value="other">{isBangla ? 'অন্যান্য' : 'Other'}</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <Clock size={12} className="text-[#6BBF3A]" />
                    <span>{isBangla ? 'কাজের সময়সীমা' : 'Availability'} *</span>
                  </label>
                  <select
                    value={volAvailability}
                    onChange={(e) => setVolAvailability(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#6BBF3A] text-sm text-gray-700 transition-all"
                  >
                    <option value="flexible">{isBangla ? 'প্রকল্প ভিত্তিক / নমনীয়' : 'Flexible / Project-based'}</option>
                    <option value="weekends">{isBangla ? 'শুধু ছুটির দিনে (শুক্র-শনিবার)' : 'Weekends Only'}</option>
                    <option value="weekdays">{isBangla ? 'শুধু কর্মদিবসে (রবি-বৃহস্পতিবার)' : 'Weekdays Only'}</option>
                    <option value="fulltime">{isBangla ? 'পূর্ণকালীন মাঠপর্যায়ে' : 'Full-time Dedication'}</option>
                  </select>
                </div>
              </div>

              {/* Area of Interest */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                  <Award size={12} className="text-[#6BBF3A]" />
                  <span>{isBangla ? 'আগ্রহের ক্ষেত্র' : 'Area of Interest'} *</span>
                </label>
                <select
                  value={volInterest}
                  onChange={(e) => setVolInterest(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#6BBF3A] text-sm text-gray-700 transition-all"
                >
                  <option value="plantation">{isBangla ? 'বৃক্ষরোপণ কর্মসূচি (ম্যানগ্রোভ বনায়ন)' : 'Tree Plantation (Mangrove Belts)'}</option>
                  <option value="renewable">{isBangla ? 'সৌর ও নবায়নযোগ্য জ্বালানি সরবরাহ' : 'Solar Micro-Grid Electrification'}</option>
                  <option value="water">{isBangla ? 'বিশুদ্ধ পানি ও আর্সেনিকমুক্তকরণ প্ল্যান্ট' : 'Arsenic Mitigation & Safe Wells'}</option>
                  <option value="waste">{isBangla ? 'নদী পরিচ্ছন্নতা ও বর্জ্য রিসাইক্লিং' : 'River Cleanup & Waste Management'}</option>
                  <option value="awareness">{isBangla ? 'স্কুল-কলেজে পরিবেশ সচেতনতা ক্যাম্পেইন' : 'Environmental School Campaigns'}</option>
                </select>
              </div>



              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {isBangla ? 'আপনার আগ্রহ সম্পর্কে লিখুন (ঐচ্ছিক)' : 'Tell us about yourself (Optional)'}
                </label>
                <textarea
                  rows={3}
                  value={volMessage}
                  onChange={(e) => setVolMessage(e.target.value)}
                  placeholder={isBangla ? 'আপনি কেন আমাদের সাথে যুক্ত হতে চান...' : 'Why do you want to join Green Earth?'}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#6BBF3A] text-sm text-gray-800 transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-[#1F5E2E] hover:bg-[#2E7D32] text-white font-sans font-bold py-4 rounded-full shadow transition-colors cursor-pointer text-center flex items-center justify-center gap-1"
                id="volunteer-form-submit"
              >
                <span>{isBangla ? 'আবেদন জমা দিন' : 'Submit Application'}</span>
                <ArrowRight size={16} />
              </motion.button>
            </form>
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
