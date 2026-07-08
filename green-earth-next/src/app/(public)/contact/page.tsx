'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { createClient } from '@/lib/supabase/client';
import { MapPin, Phone, Mail, Send, CheckCircle2, AlertCircle, RefreshCw, Facebook } from 'lucide-react';

export default function ContactPage() {
  const { isBangla, t } = useLanguage();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const [settings, setSettings] = useState<Record<string, string>>({});

  React.useEffect(() => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('contact_messages')
        .insert([{ name, email, subject, message }]);

      if (error) throw error;

      setStatus('success');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="py-12 md:py-16">
      {/* Banner */}
      <section className="bg-gradient-to-br from-[#EBF5EC] to-[#FAFAF7] border-b border-gray-200/50 py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-xs font-mono font-black text-forest-green uppercase tracking-widest bg-forest-green/10 px-3 py-1.5 rounded-full inline-block mb-3">
            Get in Touch
          </span>
          <h1 className="text-4xl md:text-5xl font-sans font-extrabold tracking-tight text-neutral-900">
            {t('Contact Green Earth', 'আমাদের সাথে যোগাযোগ')}
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto mt-4 leading-relaxed">
            {isBangla
              ? (settings.contact_intro_bn || 'আপনার কোনো অনুসন্ধান, কর্পোরেট অংশীদারিত্ব বা মতামত রয়েছে? আমাদের বার্তা পাঠান, আমাদের প্রতিনিধিরা শীঘ্রই যোগাযোগ করবেন।')
              : (settings.contact_intro_en || 'Have a campaign inquiry, CSR opportunity, or feedback? Send us a message and our officers will get back to you.')
            }
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          
          {/* Column 1: Contact Coordinates Card (2/5) */}
          <div className="lg:col-span-2 bg-[#2E7D32] text-white rounded-3xl p-8 md:p-10 shadow-lg space-y-8 relative overflow-hidden">
            {/* Background design accents */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-xl" />
            <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-[#6BBF3A]/20 rounded-full blur-xl" />

            <div className="relative z-10">
              <h2 className="text-2xl font-sans font-extrabold tracking-tight">
                {t('Head Office Coordinates', 'কার্যালয়ের ঠিকানা')}
              </h2>
              <p className="text-emerald-100 text-sm mt-2 leading-relaxed">
                {t(
                  'Reach us during office hours (Sun - Thu, 9 AM - 5 PM) or connect via social networks.',
                  'অফিস চলাকালীন (রবিবার - বৃহস্পতিবার, সকাল ৯টা - বিকাল ৫টা) যোগাযোগ করুন।'
                )}
              </p>
            </div>

            <div className="space-y-6 relative z-10 text-sm md:text-base">
              <div className="flex items-start gap-4">
                <MapPin className="text-[#6BBF3A] shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-200 mb-1">{t('Office Address', 'ঠিকানা')}</h4>
                  <p className="text-white leading-relaxed">
                    {settings.contact_address || '42, Road 11, Banani, Dhaka-1213, Bangladesh.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="text-[#6BBF3A] shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-200 mb-1">{t('Phone Number', 'মোবাইল')}</h4>
                  <p className="text-white ltr font-semibold">{settings.contact_phone || '+880 1712-345678'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="text-[#6BBF3A] shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-200 mb-1">{t('Official Email', 'ইমেইল')}</h4>
                  <p className="text-white font-semibold">{settings.contact_email || 'info@greenearth-bd.org'}</p>
                </div>
              </div>
            </div>

            {/* Social channels */}
            <div className="pt-6 border-t border-white/10 relative z-10 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-200">{t('Social Channels', 'সামাজিক মাধ্যম')}</h4>
              <a
                href={settings.facebook_url || 'https://www.facebook.com/greenearthbd.25/'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-xs font-bold transition-all"
              >
                <Facebook size={14} />
                <span>Green Earth Facebook Page</span>
              </a>
            </div>
          </div>

          {/* Column 2: Interactive message form (3/5) */}
          <div className="lg:col-span-3 bg-white border border-gray-200 rounded-3xl p-8 md:p-10 shadow-sm">
            {status === 'success' ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 size={54} className="text-emerald-600 mx-auto animate-bounce" />
                <h3 className="font-sans font-extrabold text-2xl text-neutral-900">
                  {t('Message Sent Successfully!', 'বার্তাটি পাঠানো হয়েছে!')}
                </h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto">
                  {t(
                    'Thank you for reaching out to Green Earth. Our communications officer will respond to your email within 48 hours.',
                    'আপনার বার্তার জন্য ধন্যবাদ। আমাদের প্রতিনিধি আগামী ৪৮ ঘণ্টার মধ্যে আপনার দেওয়া ইমেইলে যোগাযোগ করবেন।'
                  )}
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-6 px-8 py-3 bg-forest-green hover:bg-deep-forest text-white rounded-full font-bold text-sm transition-colors cursor-pointer"
                >
                  {t('Send Another Message', 'নতুন বার্তা পাঠান')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-sans font-extrabold text-neutral-900">
                    {t('Send a Secure Message', 'বার্তা পাঠান')}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {t('Fill out the form below and we will contact you.', 'নিচের ফরমটি পূরণ করুন এবং আমাদের পাঠান।')}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                      {t('Your Name', 'আপনার নাম')}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="e.g. Abir Chowdhury"
                      className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                      {t('Email Address', 'ইমেইল')}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="abir@example.com"
                      className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                    {t('Subject / Topic', 'বিষয়')}
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    placeholder={t('e.g. Campaign Volunteering, Sponsoring, CSR Inquiry', 'যেমন: বৃক্ষরোপণ প্রকল্প সম্পর্কে')}
                    className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                    {t('Your Detailed Message', 'বিস্তারিত বার্তা')}
                  </label>
                  <textarea
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    placeholder={t('Write your questions or notes here...', 'আপনার বার্তাটি এখানে লিখুন...')}
                    className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green resize-none"
                  />
                </div>

                {status === 'error' && (
                  <div className="flex items-center gap-1.5 text-rose-500 text-xs font-semibold">
                    <AlertCircle size={14} />
                    <span>{t('Message failed to transmit. Please check your internet or try again.', 'বার্তা পাঠাতে ব্যর্থ হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।')}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full py-3.5 bg-forest-green hover:bg-deep-forest text-white rounded-full font-bold text-sm tracking-wide shadow flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {status === 'submitting' && <RefreshCw size={14} className="animate-spin" />}
                  <span>{status === 'submitting' ? t('Sending Message...', 'পাঠানো হচ্ছে...') : t('Send Message', 'বার্তা পাঠান')}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
