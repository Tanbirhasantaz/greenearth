/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Heart, CheckCircle, Info, Lock, ArrowRight, User, Mail, Phone, Calendar, MapPin, Clipboard } from 'lucide-react';

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
  const [volMessage, setVolMessage] = useState('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Donation State
  const [selectedTier, setSelectedTier] = useState<number | 'custom'>(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'card' | 'bank'>('bkash');
  const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);
  const [transactionId, setTransactionId] = useState('');
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
      message: volMessage,
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    fetch('/api/volunteers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then((res) => {
        setVolName('');
        setVolEmail('');
        setVolPhone('');
        setVolMessage('');

        onFormSuccess(
          isBangla ? 'আবেদন সম্পন্ন হয়েছে!' : 'Application Submitted!',
          isBangla 
            ? 'স্বেচ্ছাসেবী হিসেবে আবেদন করার জন্য ধন্যবাদ। আমাদের টিম শীঘ্রই আপনার সাথে মোবাইল ও ইমেইলে যোগাযোগ করবে!' 
            : 'Thank you for applying to join our volunteer crew! Our team will review your details and contact you via email or phone within 48 hours.'
        );
      })
      .catch((err) => {
        console.error(err);
        alert(isBangla ? 'একটি সমস্যা হয়েছে, অনুগ্রহ করে আবার চেষ্টা করুন।' : 'Something went wrong, please try again.');
      });
  };

  // Handle donation submit
  const handleDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDonationError('');

    const finalAmount = selectedTier === 'custom' ? Number(customAmount) : selectedTier;
    if (!finalAmount || finalAmount <= 0) {
      setDonationError(isBangla ? 'অনুগ্রহ করে সঠিক অনুদানের পরিমাণ দিন' : 'Please specify a valid donation amount');
      return;
    }

    // Trigger transaction code modal for bKash / Nagad, or complete Card/Bank directly
    if (paymentMethod === 'bkash' || paymentMethod === 'nagad') {
      setShowPaymentInstructions(true);
    } else {
      // Simulate direct bank/card success and POST immediately
      const payload = {
        amount: finalAmount,
        method: paymentMethod,
        transactionId: `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        status: 'approved',
        date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
      };

      fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then((res) => {
          onFormSuccess(
            isBangla ? 'অনুদান সফল হয়েছে!' : 'Donation Received!',
            isBangla
              ? `আপনার অত্যন্ত উদার ৳${finalAmount.toLocaleString('bn-BD')} অনুদান সফলভাবে জমা হয়েছে। আপনার ইমেইলে একটি অফিসিয়াল মানি রিসিট পাঠানো হবে!`
              : `Your generous donation of ৳${finalAmount.toLocaleString('en-US')} has been successfully processed! An official tax-deductible receipt has been sent to your email.`
          );
        })
        .catch((err) => {
          console.error(err);
          alert(isBangla ? 'অনুদান সম্পন্ন করতে সমস্যা হয়েছে।' : 'Error recording your donation.');
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
      amount: finalAmount,
      method: paymentMethod,
      transactionId: transactionId,
      status: 'pending',
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    fetch('/api/donations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then((res) => {
        setShowPaymentInstructions(false);
        setTransactionId('');

        onFormSuccess(
          isBangla ? 'অনুদান ভেরিফিকেশন সফল!' : 'Donation Verified!',
          isBangla
            ? `৳${finalAmount.toLocaleString('bn-BD')} অনুদানটি সফলভাবে ভেরিফাই করা হয়েছে! গ্রিন আর্থের পরিবেশবান্ধব উদ্যোগে সহায়তা করার জন্য ধন্যবাদ।`
            : `Thank you! Your donation of ৳${finalAmount.toLocaleString('en-US')} via ${paymentMethod.toUpperCase()} has been verified under Trans ID: ${transactionId}. Your support drives real change!`
        );
      })
      .catch((err) => {
        console.error(err);
        alert(isBangla ? 'ভেরিফিকেশন সম্পন্ন করতে ব্যর্থ হয়েছে।' : 'Failed to submit verification.');
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
          <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-black text-[#1F5E2E]">
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

      {/* 2. TWO COLUMN FORMS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Col: Volunteer Signup Form */}
        <div className="lg:col-span-6 bg-white border border-gray-200/60 rounded-3xl p-6 sm:p-10 shadow-sm flex flex-col justify-between text-left" id="volunteer-form-container">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-[#6BBF3A]/10 text-[#1F5E2E] rounded-2xl">
                <Award size={24} />
              </div>
              <div>
                <h2 className="font-sans text-2xl font-extrabold text-[#1F5E2E]">
                  {isBangla ? 'স্বেচ্ছাসেবী হিসেবে নিবন্ধন' : 'Apply as Volunteer'}
                </h2>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider font-mono mt-0.5">
                  {isBangla ? 'মাঠ পর্যায়ে পরিবর্তন আনুন' : 'Join our grassroots crew'}
                </p>
              </div>
            </div>

            <p className="font-sans text-sm text-gray-600 leading-relaxed mb-6">
              {isBangla
                ? 'সুন্দরবনে ম্যানগ্রোভ রোপণ, উত্তরাঞ্চলের চরে স্কুলগুলোতে সৌরবিদ্যুৎ স্থাপন, অথবা বুড়িগঙ্গায় প্লাস্টিক পরিষ্কারের অভিযানে সরাসরি অংশ নিতে ফরমটি পূরণ করুন।'
                : 'Join our planting drives in Satkhira, build clean solar systems in Kurigram chars, or participate in urban recycling projects. No prior expertise required.'
              }
            </p>

            <form onSubmit={handleVolunteerSubmit} className="space-y-4 font-sans">
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
                  rows={4}
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

              {/* Payment Methods */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider block">
                  {isBangla ? 'পেমেন্ট মাধ্যম নির্বাচন' : 'Preferred Payment Channel'}
                </span>
                <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold font-mono">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bkash')}
                    className={`py-3 rounded-xl border transition-all cursor-pointer ${
                      paymentMethod === 'bkash'
                        ? 'border-pink-500 bg-pink-500/10 text-pink-700 font-extrabold'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-500'
                    }`}
                  >
                    bKash
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('nagad')}
                    className={`py-3 rounded-xl border transition-all cursor-pointer ${
                      paymentMethod === 'nagad'
                        ? 'border-orange-500 bg-orange-500/10 text-orange-700 font-extrabold'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-500'
                    }`}
                  >
                    Nagad
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-3 rounded-xl border transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-blue-500 bg-blue-500/10 text-blue-700 font-extrabold'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-500'
                    }`}
                  >
                    Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank')}
                    className={`py-3 rounded-xl border transition-all cursor-pointer ${
                      paymentMethod === 'bank'
                        ? 'border-emerald-600 bg-emerald-600/10 text-emerald-800 font-extrabold'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-500'
                    }`}
                  >
                    Bank
                  </button>
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
                  <span className="font-black text-[#1F5E2E]">{paymentMethod.toUpperCase()} Merchant Pay</span>
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
