'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { createClient } from '@/lib/supabase/client';
import { Heart, Award, CheckCircle2, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react';

export default function GetInvolvedPage() {
  const searchParams = useSearchParams();
  const { isBangla, t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'volunteer' | 'donate'>('volunteer');

  // Volunteer state
  const [volName, setVolName] = useState('');
  const [volEmail, setVolEmail] = useState('');
  const [volPhone, setVolPhone] = useState('');
  const [volInterest, setVolInterest] = useState('tree_plantation');
  const [volMessage, setVolMessage] = useState('');
  const [volStatus, setVolStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // Donation state
  const [donName, setDonName] = useState('');
  const [donEmail, setDonEmail] = useState('');
  const [donAmount, setDonAmount] = useState('');
  const [donMethod, setDonMethod] = useState<'bkash' | 'nagad' | 'bank_transfer' | 'card'>('bkash');
  const [donTrx, setDonTrx] = useState('');
  const [donStatus, setDonStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.from('site_settings').select('key, value');
        if (data) {
          const map: Record<string, string> = {};
          data.forEach(s => {
            map[s.key] = s.value;
          });
          setSettings(map);
        }
      } catch (err) {
        console.warn('Failed to load settings', err);
      }
    };
    fetchSettings();
  }, []);

  // Watch query params to auto-activate Donate tab (e.g. from Donate button in header)
  useEffect(() => {
    if (searchParams.get('donate') === 'true') {
      setActiveTab('donate');
    }
  }, [searchParams]);

  const handleVolunteerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVolStatus('submitting');

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('volunteers')
        .insert([{
          name: volName,
          email: volEmail,
          phone: volPhone,
          area_of_interest: volInterest,
          message: volMessage,
          status: 'new'
        }]);

      if (error) throw error;

      setVolStatus('success');
      // Clear
      setVolName('');
      setVolEmail('');
      setVolPhone('');
      setVolMessage('');
    } catch (err) {
      console.error(err);
      setVolStatus('error');
    }
  };

  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDonStatus('submitting');

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('donations')
        .insert([{
          donor_name: donName,
          email: donEmail,
          amount: parseFloat(donAmount),
          method: donMethod,
          transaction_id: donTrx,
          status: 'pending'
        }]);

      if (error) throw error;

      setDonStatus('success');
      setDonName('');
      setDonEmail('');
      setDonAmount('');
      setDonTrx('');
    } catch (err) {
      console.error(err);
      setDonStatus('error');
    }
  };

  return (
    <div className="py-12 md:py-16">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-[#EBF5EC] to-[#FAFAF7] border-b border-gray-200/50 py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-xs font-mono font-black text-forest-green uppercase tracking-widest bg-forest-green/10 px-3 py-1.5 rounded-full inline-block mb-3">
            Join the Movement
          </span>
          <h1 className="text-4xl md:text-5xl font-sans font-extrabold tracking-tight text-neutral-900">
            {t('Get Involved with Green Earth', 'আমাদের কার্যক্রমে অংশ নিন')}
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto mt-4 leading-relaxed">
            {isBangla
              ? (settings.get_involved_intro_bn || 'চারাগাছ রোপণের জন্য তহবিল প্রদান হোক বা সরাসরি মাঠে এসে কাজ করা—আপনার অবদান আমাদের পরিবেশ রক্ষায় গুরুত্বপূর্ণ ভূমিকা রাখবে।')
              : (settings.get_involved_intro_en || 'Whether you donate funds to plant saplings or dedicate your time in the field, your contribution drives active environmental survival.')
            }
          </p>
        </div>
      </section>

      {/* Main Split Section */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        {/* Toggle tabs */}
        <div className="flex border-b border-gray-200 mb-12 max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('volunteer')}
            className={`flex-1 py-4 text-center font-sans font-extrabold text-base border-b-4 transition-all cursor-pointer ${
              activeTab === 'volunteer'
                ? 'border-forest-green text-forest-green'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Award size={18} />
              <span>{t('Apply as Volunteer', 'ভলান্টিয়ার আবেদন')}</span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab('donate')}
            className={`flex-1 py-4 text-center font-sans font-extrabold text-base border-b-4 transition-all cursor-pointer ${
              activeTab === 'donate'
                ? 'border-forest-green text-forest-green'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Heart size={18} />
              <span>{t('Send Donation', 'তহবিল অনুদান')}</span>
            </span>
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-12 shadow-sm max-w-2xl mx-auto">
          {/* TAB 1: VOLUNTEER REGISTRATION FORM */}
          {activeTab === 'volunteer' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-sans font-extrabold text-neutral-900">
                  {t('Volunteer Application Form', 'ভলান্টিয়ার রেজিস্ট্রেশন ফরম')}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {t(
                    'Register to join coastal tree plantations, river cleanups, and local environmental workshops.',
                    'সুন্দরবনে বৃক্ষরোপণ, বুড়িগঙ্গা পরিচ্ছন্নতা এবং সামাজিক সচেতনতা প্রচারণায় অংশ নিতে ফরমটি পূরণ করুন।'
                  )}
                </p>
              </div>

              {volStatus === 'success' ? (
                <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-2xl text-center space-y-4">
                  <CheckCircle2 size={48} className="text-emerald-600 mx-auto" />
                  <h3 className="font-sans font-extrabold text-xl text-neutral-950">
                    {t('Application Submitted!', 'আবেদনটি সফলভাবে জমা হয়েছে!')}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {t(
                      'Thank you for joining Green Earth. Our community managers will contact you within 3 days via phone or email.',
                      'গ্রিন আর্থে যুক্ত হওয়ার জন্য ধন্যবাদ। আমাদের প্রতিনিধি আগামী ৩ দিনের মধ্যে আপনার সাথে যোগাযোগ করবেন।'
                    )}
                  </p>
                  <button
                    onClick={() => setVolStatus('idle')}
                    className="mt-4 px-6 py-2.5 bg-forest-green text-white rounded-full font-bold text-sm hover:bg-deep-forest cursor-pointer"
                  >
                    {t('Register Another', 'অন্য আবেদন')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleVolunteerSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">
                      {t('Full Name', 'সম্পূর্ণ নাম')}
                    </label>
                    <input
                      type="text"
                      value={volName}
                      onChange={(e) => setVolName(e.target.value)}
                      required
                      placeholder="e.g. Faisal Ahmed"
                      className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">
                        {t('Email Address', 'ইমেইল')}
                      </label>
                      <input
                        type="email"
                        value={volEmail}
                        onChange={(e) => setVolEmail(e.target.value)}
                        required
                        placeholder="faisal@example.com"
                        className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">
                        {t('Phone Number', 'মোবাইল নম্বর')}
                      </label>
                      <input
                        type="tel"
                        value={volPhone}
                        onChange={(e) => setVolPhone(e.target.value)}
                        required
                        placeholder="e.g. 017XXXXXXXX"
                        className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">
                      {t('Primary Interest Area', 'আগ্রহের ক্ষেত্রসমূহ')}
                    </label>
                    <select
                      value={volInterest}
                      onChange={(e) => setVolInterest(e.target.value)}
                      className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green cursor-pointer"
                    >
                      <option value="tree_plantation">{t('Tree Plantation & Mangrove Conservation', 'বৃক্ষরোপণ ও উপকূলীয় বনায়ন')}</option>
                      <option value="renewable_energy">{t('Solar Electrification', 'চরাঞ্চলে সৌর বিদ্যুতায়ন')}</option>
                      <option value="water_sanitation">{t('Safe Drinking Water Solutions', 'নিরাপদ পানি ও স্যানিটেশন')}</option>
                      <option value="waste_management">{t('Canal & River Cleaning Drive', 'নদী ও খাল পরিচ্ছন্নতা')}</option>
                      <option value="awareness_campaign">{t('Community Awareness Education', 'পরিবেশগত সচেতনতা প্রচারণা')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">
                      {t('Short Statement / Message (Optional)', 'আপনার বক্তব্য (ঐচ্ছিক)')}
                    </label>
                    <textarea
                      rows={4}
                      value={volMessage}
                      onChange={(e) => setVolMessage(e.target.value)}
                      placeholder={t('Tell us why you want to join and any previous experience.', 'কেন যুক্ত হতে চান বা পূর্ব অভিজ্ঞতা জানিয়ে বার্তা লিখুন।')}
                      className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green resize-none"
                    />
                  </div>

                  {volStatus === 'error' && (
                    <div className="flex items-center gap-1.5 text-rose-500 text-xs font-semibold">
                      <AlertCircle size={14} />
                      <span>{t('Submission failed. Please try again later.', 'আবেদন ব্যর্থ হয়েছে। অনুগ্রহ করে পরে চেষ্টা করুন।')}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={volStatus === 'submitting'}
                    className="w-full py-3.5 bg-forest-green hover:bg-deep-forest text-white rounded-full font-bold text-sm tracking-wide shadow flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {volStatus === 'submitting' && <RefreshCw size={14} className="animate-spin" />}
                    <span>{volStatus === 'submitting' ? t('Registering...', 'রেজিস্ট্রেশন হচ্ছে...') : t('Submit Application', 'আবেদনপত্র জমা দিন')}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: DONATION FORM & GATEWAY LOGIC */}
          {activeTab === 'donate' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-sans font-extrabold text-neutral-900 flex items-center gap-2">
                  <Heart className="text-rose-500 fill-rose-500 animate-pulse" size={24} />
                  <span>{t('Support Field Campaigns', 'পরিবেশ কার্যক্রমে অনুদান দিন')}</span>
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {t(
                    'Donate funds securely. 100% of proceeds buy saplings, gravity water filters, and solar grids across Bangladesh.',
                    'আপনার সাহায্য উপকূলীয় এলাকায় চারাগাছ রোপণ, আর্সেনিক ফিল্টার ও চরের স্কুলে সৌর বিদ্যুৎ প্যানেল ক্রয়ে সাহায্য করে।'
                  )}
                </p>
              </div>

              {/* Bangladesh Mobile Payment Instructions Panel */}
              <div className="bg-neutral-50 border border-gray-200 p-6 rounded-2xl space-y-4">
                <span className="text-[10px] font-mono font-black text-forest-green uppercase tracking-wider block">
                  {t('Payment Instructions', 'টাকা পাঠানোর নিয়মাবলি')}
                </span>
                <div className="space-y-2 text-xs md:text-sm text-gray-600 leading-relaxed">
                  <p>
                    <strong>bKash / Nagad (Personal):</strong> <span className="text-forest-green font-bold">01712-345678</span>
                  </p>
                  <p className="text-xs text-gray-400">
                    {t(
                      '1. Go to Send Money option. 2. Enter the number above. 3. Enter amount. 4. Complete transaction and copy the Transaction ID.',
                      '১. সেন্ড মানি (Send Money) অপশনে যান। ২. উপরের নম্বরটি দিন। ৩. টাকার পরিমাণ লিখুন। ৪. পিন নম্বর দিয়ে সফল হওয়ার পর ট্রানজেকশন আইডি (Transaction ID) কপি করুন।'
                    )}
                  </p>
                </div>
              </div>

              {donStatus === 'success' ? (
                <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-2xl text-center space-y-4">
                  <CheckCircle2 size={48} className="text-emerald-600 mx-auto animate-bounce" />
                  <h3 className="font-sans font-extrabold text-xl text-neutral-950">
                    {t('Donation Logged!', 'অনুদানের তথ্য নথিভুক্ত হয়েছে!')}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {t(
                      'Thank you for your generosity! Our finance team is auditing the transaction ID. You will receive an official receipts by email.',
                      'আপনার সদয় অনুদানের জন্য ধন্যবাদ! আমাদের অর্থ দল ট্রানজেকশন আইডি-টি যাচাই করে শিগগিরই আপনার ইমেইলে রশিদ পাঠাবেন।'
                    )}
                  </p>
                  <button
                    onClick={() => setDonStatus('idle')}
                    className="mt-4 px-6 py-2.5 bg-forest-green text-white rounded-full font-bold text-sm hover:bg-deep-forest cursor-pointer"
                  >
                    {t('New Donation', 'নতুন অনুদান')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleDonationSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">
                        {t('Your Name', 'দাতা হিসেবে নাম')}
                      </label>
                      <input
                        type="text"
                        value={donName}
                        onChange={(e) => setDonName(e.target.value)}
                        required
                        placeholder="e.g. Tanvir Ahmed"
                        className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">
                        {t('Email Address', 'ইমেইল')}
                      </label>
                      <input
                        type="email"
                        value={donEmail}
                        onChange={(e) => setDonEmail(e.target.value)}
                        required
                        placeholder="tanvir@example.com"
                        className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">
                        {t('Amount (BDT / Taka)', 'টাকার পরিমাণ (টাকা)')}
                      </label>
                      <input
                        type="number"
                        min="10"
                        value={donAmount}
                        onChange={(e) => setDonAmount(e.target.value)}
                        required
                        placeholder="e.g. 1000"
                        className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">
                        {t('Payment Gateway', 'পেমেন্ট মাধ্যম')}
                      </label>
                      <select
                        value={donMethod}
                        onChange={(e: any) => setDonMethod(e.target.value)}
                        className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green cursor-pointer"
                      >
                        <option value="bkash">bKash (বিকাশ)</option>
                        <option value="nagad">Nagad (নগদ)</option>
                        <option value="bank_transfer">Bank Transfer (ব্যাংক ট্রান্সফার)</option>
                        <option value="card">Credit Card (ক্রেডিট কার্ড)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">
                      {t('Transaction ID (TrxID)', 'ট্রানজেকশন আইডি (TrxID)')}
                    </label>
                    <input
                      type="text"
                      value={donTrx}
                      onChange={(e) => setDonTrx(e.target.value)}
                      required
                      placeholder="e.g. BKX92841AD"
                      className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                    />
                  </div>

                  {donStatus === 'error' && (
                    <div className="flex items-center gap-1.5 text-rose-500 text-xs font-semibold">
                      <AlertCircle size={14} />
                      <span>{t('Logging failed. Please check inputs and try again.', 'জমা ব্যর্থ হয়েছে। ট্রানজেকশন আইডি পুনরায় পরীক্ষা করুন।')}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={donStatus === 'submitting'}
                    className="w-full py-3.5 bg-forest-green hover:bg-deep-forest text-white rounded-full font-bold text-sm tracking-wide shadow flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {donStatus === 'submitting' && <RefreshCw size={14} className="animate-spin" />}
                    <span>{donStatus === 'submitting' ? t('Submitting...', 'জমা হচ্ছে...') : t('Submit Donation Record', 'অনুদানের তথ্য নিশ্চিত করুন')}</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
