/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Leaf, CheckCircle, AlertTriangle, Plus, Trash2, Camera, User, Lock, 
  Calendar, MapPin, Activity, Award, Search, FileText, Download, LogOut, 
  Info, Users, Check, X, ChevronRight, HelpCircle
} from 'lucide-react';

// Suggested species list
export const SUGGESTED_SPECIES = {
  fruit: [
    { en: 'Mango', bn: 'আম' },
    { en: 'Jackfruit', bn: 'কাঁঠাল' },
    { en: 'Blackberry', bn: 'জাম' },
    { en: 'Litchi', bn: 'লিচু' },
    { en: 'Papaya', bn: 'পেঁপে' },
    { en: 'Guava', bn: 'পেয়ারা' },
    { en: 'Plum/Boroi', bn: 'বরই' },
    { en: 'Sapodilla', bn: 'সফেদা' },
    { en: 'Pomelo', bn: 'জাম্বুরা' },
    { en: 'Chalta', bn: 'চালতা' },
    { en: 'Olive', bn: 'জলপাই' },
    { en: 'Latkan', bn: 'লটকন' },
    { en: 'Carambola/Kamranga', bn: 'কামরাঙ্গা' }
  ],
  forest: [
    { en: 'Banyan', bn: 'বট' },
    { en: 'Pakur', bn: 'পাকুড়' },
    { en: 'Palm Tree', bn: 'তাল' }
  ],
  medicinal: [
    { en: 'Neem', bn: 'নিম' },
    { en: 'Amla', bn: 'আমলকী' },
    { en: 'Arjun', bn: 'অর্জুন' }
  ],
  indoor: [
    { en: 'Monstera', bn: 'মনস্টেরা' },
    { en: 'Peace Lily', bn: 'পিস লিলি' },
    { en: 'Snake Plant', bn: 'স্নেক প্ল্যান্ট' },
    { en: 'Pothos/Money Plant', bn: 'মানি প্ল্যান্ট' }
  ],
  flower: [
    { en: 'Rose', bn: 'গোলাপ' },
    { en: 'Marigold', bn: 'গেন্দা' },
    { en: 'Jasmine', bn: 'জুঁই' },
    { en: 'Hibiscus', bn: 'জবা' },
    { en: 'Shiuli / Coral Jasmine', bn: 'শিউলি' },
    { en: 'Bougainvillea / Baganbilash', bn: 'বাগানবিলাস' },
    { en: 'Champa / Golden Champa', bn: 'চাঁপা' },
    { en: 'Kamini / Orange Jasmine', bn: 'কামিনী' }
  ]
};

// Help helper to get flat list for autocomplete
const FLAT_SPECIES = [
  ...SUGGESTED_SPECIES.fruit,
  ...SUGGESTED_SPECIES.forest,
  ...SUGGESTED_SPECIES.medicinal,
  ...SUGGESTED_SPECIES.indoor,
  ...SUGGESTED_SPECIES.flower
];

interface GreenHeroProps {
  isBangla?: boolean;
  settings?: any;
}

export default function GreenHero({ isBangla = false, settings }: GreenHeroProps) {
  // Inner Active Section tab
  // Options: 'home', 'rules', 'species', 'impact', 'portal'
  const [activeSubTab, setActiveSubTab] = useState<'home' | 'rules' | 'species' | 'impact' | 'portal'>('home');

  // --- LOCAL PERSISTENCE AND STATE ENGING ---
  const [participants, setParticipants] = useState<any[]>([]);
  const [trees, setTrees] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [overview, setOverview] = useState<any>({
    titleEn: "Green Hero Initiative (Adapt a Tree)",
    titleBn: "গ্রিন হিরো ইনিশিয়েティブ - একটি গাছ দত্তক নিন",
    subtitleEn: "Plant Trees Today, Protect Tomorrow",
    subtitleBn: "আজই বৃক্ষরোপণ করুন, আগামীকে সুরক্ষিত রাখুন",
    descriptionEn: "Become a proud 'Green Hero' by planting and nurturing trees in your local community. Join our collective movement to combat rising heatwaves, increase urban green canopy, and foster climate resilience across Bangladesh. Register your trees, upload monthly growth logs, and earn your official certificate and badge.",
    descriptionBn: "নিজের এলাকায় গাছ রোপণ ও পরিচর্যা করে একজন গর্বিত 'গ্রিন হিরো' হয়ে উঠুন। ক্রমবর্ধমান দাবদাহ মোকাবিলা, শহরের সবুজ আচ্ছাদন বৃদ্ধি এবং জলবায়ু সহনশীল বাংলাদেশ গড়তে আমাদের সম্মিলিত আন্দোলনে যোগ দিন। আপনার রোপণ করা গাছের নিবন্ধন করুন, প্রতিমাসে বৃদ্ধির ছবি আপলোড করুন এবং অর্জন করুন অফিশিয়াল সার্টিফিকেট ও ব্যাজ।"
  });

  // Active Logged-In Participant state
  const [loggedInUser, setLoggedInUser] = useState<any | null>(null);

  // Core Seed Data helper
  useEffect(() => {
    // 1. Load Overview Settings
    const savedOverview = localStorage.getItem('ge_gh_overview');
    if (savedOverview) {
      try {
        setOverview(JSON.parse(savedOverview));
      } catch (e) {}
    } else if (settings?.greenHeroOverview) {
      setOverview(settings.greenHeroOverview);
    }

    // 2. Pre-seed Participant list if empty
    const savedParts = localStorage.getItem('ge_gh_participants');
    let preseedParticipants = [];
    if (savedParts) {
      try {
        preseedParticipants = JSON.parse(savedParts);
        setParticipants(preseedParticipants);
      } catch (e) {}
    } else {
      preseedParticipants = [
        {
          id: 'GE-AT-000001',
          name: 'Sumaiya Akter (সুমাইয়া আক্তার)',
          type: 'student',
          institution: 'Bogura Zilla School (বগুড়া জিলা স্কুল)',
          grade: 'Class 8 (শ্রেণি ৮)',
          mobile: '01712345678',
          district: 'Bogura (বগুড়া)',
          upazila: 'Adamdighi (আদমদীঘি)',
          regDate: '2026-06-15',
          status: 'Approved',
          password: 'password123'
        },
        {
          id: 'GE-AT-000002',
          name: 'Sajjad Rahman (সাজ্জাদ রহমান)',
          type: 'student',
          institution: 'Adamdighi Pilot High School (আদমদীঘি পাইলট উচ্চ বিদ্যালয়)',
          grade: 'Class 10 (শ্রেণি ১০)',
          mobile: '01912345678',
          district: 'Bogura (বগুড়া)',
          upazila: 'Adamdighi (আদমদীঘি)',
          regDate: '2026-06-16',
          status: 'Approved',
          password: 'password123'
        },
        {
          id: 'GE-AT-000003',
          name: 'Tasnim Ahmed (তাসনিম আহমেদ)',
          type: 'volunteer',
          institution: 'Bogura Govt College (বগুড়া সরকারি কলেজ)',
          grade: '',
          mobile: '01812345678',
          district: 'Bogura (বগুড়া)',
          upazila: 'Adamdighi (আদমদীঘি)',
          regDate: '2026-06-17',
          status: 'Approved',
          password: 'password123'
        },
        {
          id: 'GE-AT-000004',
          name: 'Tanvir Islam (তানভীর ইসলাম)',
          type: 'student',
          institution: 'Adamdighi Girls High School (আদমদীঘি বালিকা উচ্চ বিদ্যালয়)',
          grade: 'Class 9 (শ্রেণি ৯)',
          mobile: '01512345678',
          district: 'Bogura (বগুড়া)',
          upazila: 'Adamdighi (আদমদীঘি)',
          regDate: '2026-06-18',
          status: 'Approved',
          password: 'password123'
        },
        {
          id: 'GE-AT-000005',
          name: 'Farhana Yesmin (ফারহানা ইয়াসমিন)',
          type: 'volunteer',
          institution: 'Adamdighi College (আদমদীঘি কলেজ)',
          grade: '',
          mobile: '01612345678',
          district: 'Bogura (বগুড়া)',
          upazila: 'Adamdighi (আদমদীঘি)',
          regDate: '2026-06-19',
          status: 'Approved',
          password: 'password123'
        }
      ];
      localStorage.setItem('ge_gh_participants', JSON.stringify(preseedParticipants));
      setParticipants(preseedParticipants);
    }

    // 3. Pre-seed Trees list if empty
    const savedTrees = localStorage.getItem('ge_gh_trees');
    let preseedTrees = [];
    if (savedTrees) {
      try {
        preseedTrees = JSON.parse(savedTrees);
        setTrees(preseedTrees);
      } catch (e) {}
    } else {
      // Preseed 5 trees for each of the 5 preseeded participants
      const speciesList = [
        { name: 'Mango (আম)', type: 'Fruit Tree (ফলজ বৃক্ষ)' },
        { name: 'Guava (পেয়ারা)', type: 'Fruit Tree (ফলজ বৃক্ষ)' },
        { name: 'Neem (নিম)', type: 'Medicinal Tree (ঔষধি বৃক্ষ)' },
        { name: 'Amla (আমলকী)', type: 'Medicinal Tree (ঔষধি বৃক্ষ)' },
        { name: 'Jackfruit (কাঁঠাল)', type: 'Fruit Tree (ফলজ বৃক্ষ)' }
      ];
      
      const locations = [
        'School Yard (স্কুল মাঠ)',
        'Home Garden (বাড়ির বাগান)',
        'Roadside Space (রাস্তার পার্শ্ববর্তী জায়গা)',
        'Village Yard (গ্রামের উঠান)',
        'School Yard (স্কুল মাঠ)'
      ];

      const images = [
        'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=400&q=80',
        'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&q=80',
        'https://images.unsplash.com/photo-1525498122383-30000721e1bf?w=400&q=80',
        'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400&q=80',
        'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80'
      ];

      let treeIdCounter = 1;
      preseedParticipants.forEach((p, pIdx) => {
        speciesList.forEach((sp, sIdx) => {
          preseedTrees.push({
            id: `tree-${treeIdCounter++}`,
            participantId: p.id,
            participantName: p.name,
            institutionName: p.institution,
            mobile: p.mobile,
            treeName: sp.name,
            quantity: 1,
            treeType: sp.type,
            location: locations[(pIdx + sIdx) % locations.length],
            plantingDate: '2026-06-15',
            photo: images[sIdx % images.length],
            status: 'Approved'
          });
        });
      });
      localStorage.setItem('ge_gh_trees', JSON.stringify(preseedTrees));
      setTrees(preseedTrees);
    }

    // 4. Pre-seed Logs if empty
    const savedLogs = localStorage.getItem('ge_gh_logs');
    if (savedLogs) {
      try {
        setLogs(JSON.parse(savedLogs));
      } catch (e) {}
    } else {
      const preseedLogs: any[] = [];
      const images = [
        'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=400&q=80',
        'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&q=80',
        'https://images.unsplash.com/photo-1525498122383-30000721e1bf?w=400&q=80'
      ];

      // GE-AT-000001: Month 1, Month 2, Month 3 Completed & Approved (Eligible for certificate!)
      preseedLogs.push(
        { id: 'log-1', participantId: 'GE-AT-000001', month: 1, health: 'Growing Well (ভালোভাবে বেড়ে উঠছে)', photo: images[0], comments: 'Watered daily. New leaves growing.', status: 'Approved', remarks: 'Good job!', date: '2026-06-30' },
        { id: 'log-2', participantId: 'GE-AT-000001', month: 2, health: 'Growing Well (ভালোভাবে বেড়ে উঠছে)', photo: images[1], comments: 'Fertilized. Tall stem.', status: 'Approved', remarks: 'Very nice progression.', date: '2026-07-15' },
        { id: 'log-3', participantId: 'GE-AT-000001', month: 3, health: 'Growing Well (ভালোভাবে বেড়ে উঠছে)', photo: images[2], comments: 'Nurtured beautifully. It is now stable!', status: 'Approved', remarks: 'Outstanding Green Hero!', date: '2026-07-17' }
      );

      // GE-AT-000002: Month 1 & 2 Approved, Month 3 is Submitted (Pending admin approval!)
      preseedLogs.push(
        { id: 'log-4', participantId: 'GE-AT-000002', month: 1, health: 'Growing Well (ভালোভাবে বেড়ে উঠছে)', photo: images[1], comments: 'Watered morning and night.', status: 'Approved', remarks: 'Good.', date: '2026-06-29' },
        { id: 'log-5', participantId: 'GE-AT-000002', month: 2, health: 'Alive (বেঁচে আছে)', photo: images[2], comments: 'Attacked by bugs, but treated with neem extract.', status: 'Approved', remarks: 'Great care using organic methods!', date: '2026-07-14' },
        { id: 'log-6', participantId: 'GE-AT-000002', month: 3, health: 'Growing Well (ভালোভাবে বেড়ে উঠছে)', photo: images[0], comments: 'Completely recovered and thriving!', status: 'Pending', remarks: '', date: '2026-07-17' }
      );

      // GE-AT-000003: Month 1 Approved, Month 2 Due/Pending resubmission
      preseedLogs.push(
        { id: 'log-7', participantId: 'GE-AT-000003', month: 1, health: 'Alive (বেঁচে আছে)', photo: images[2], comments: 'Healthy plant.', status: 'Approved', remarks: 'Approved.', date: '2026-07-02' }
      );

      localStorage.setItem('ge_gh_logs', JSON.stringify(preseedLogs));
      setLogs(preseedLogs);
    }

    // 5. Recover session if logged in
    const currentSession = sessionStorage.getItem('ge_gh_logged_in');
    if (currentSession) {
      try {
        setLoggedInUser(JSON.parse(currentSession));
        setActiveSubTab('portal');
      } catch (e) {}
    }
  }, [settings]);

  // Handle reload data from local storage
  const reloadData = () => {
    const savedParts = localStorage.getItem('ge_gh_participants');
    if (savedParts) setParticipants(JSON.parse(savedParts));
    const savedTrees = localStorage.getItem('ge_gh_trees');
    if (savedTrees) setTrees(JSON.parse(savedTrees));
    const savedLogs = localStorage.getItem('ge_gh_logs');
    if (savedLogs) setLogs(JSON.parse(savedLogs));
    const savedOverview = localStorage.getItem('ge_gh_overview');
    if (savedOverview) setOverview(JSON.parse(savedOverview));
  };

  // --- DYNAMIC COUNTERS & METRICS ---
  const totalParticipants = participants.length;
  // Count total registered trees
  const totalTreesPlanted = trees.reduce((sum, t) => sum + t.quantity, 0);
  
  // Calculate verified surviving trees (Verified trees - dead ones, or we can look at latest logs)
  // Let's count all trees as surviving unless their latest log says they are 'Dead (নষ্ট হয়ে গেছে)' or rejected
  const deadTreeParticipants = logs.filter(l => l.health?.startsWith('Dead') && l.status === 'Approved').map(l => l.participantId);
  const totalSurvivingTrees = trees.reduce((sum, t) => {
    if (deadTreeParticipants.includes(t.participantId)) {
      return sum; // Skip if participant reported a dead tree
    }
    return sum + t.quantity;
  }, 0);

  const survivalRate = totalTreesPlanted > 0 ? Math.round((totalSurvivingTrees / totalTreesPlanted) * 100) : 100;

  // Registered Schools
  const distinctSchools = Array.from(new Set(participants.filter(p => p.type === 'student').map(p => p.institution)));
  const totalSchools = distinctSchools.length || 3; // Fallback to 3 preseeded schools if none

  // Covered Districts
  const distinctDistricts = Array.from(new Set(participants.map(p => p.district)));
  const totalDistricts = distinctDistricts.length || 1;

  // --- PARTICIPANT REGISTER & LOGIN FORM STATES ---
  const [regName, setRegName] = useState('');
  const [regInstType, setRegInstType] = useState('student');
  const [regInstName, setRegInstName] = useState('');
  const [regGrade, setRegGrade] = useState('Class 8 (শ্রেণি ৮)');
  const [regMobile, setRegMobile] = useState('');
  const [isOtherDistrict, setIsOtherDistrict] = useState(false);
  const [customDistrict, setCustomDistrict] = useState('');
  const [customUpazila, setCustomUpazila] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regError, setRegError] = useState('');
  const [showRegSuccess, setShowRegSuccess] = useState<any | null>(null);

  // Login states
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // --- ACTIVE TREE REGISTRATION REPEATER STATES ---
  const [treeRows, setTreeRows] = useState<any[]>([
    { id: 1, name: '', quantity: 1, type: 'Fruit Tree (ফলজ বৃক্ষ)', suggestions: [] }
  ]);
  const [plantingDate, setPlantingDate] = useState('2026-07-17');
  const [plantingAddress, setPlantingAddress] = useState('');
  const [treePhoto, setTreePhoto] = useState('');
  const [treeRegError, setTreeRegError] = useState('');
  const [treeRegSuccess, setTreeRegSuccess] = useState('');
  const [editTreeParticipant, setEditTreeParticipant] = useState<any | null>(null);

  // Helper for actual local image uploads to convert file to base64 Data URL
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- MONTHLY MONITORING SUBMISSIONS ---
  const [activeMonthTab, setActiveMonthTab] = useState<number>(1);
  const [logPhoto, setLogPhoto] = useState('');
  const [logHealth, setLogHealth] = useState('Growing Well / Alive (বেঁচে আছে ও বেড়ে উঠছে)');
  const [logComments, setLogComments] = useState('');
  const [logError, setLogError] = useState('');
  const [logSuccess, setLogSuccess] = useState('');

  // --- POPUP / ERROR BANNERS ---
  const [bannedSpeciesAlert, setBannedSpeciesAlert] = useState<string | null>(null);

  // --- ACTIONS ---

  // Check species string for banned Eucalyptus / Akashmoni
  const isBannedSpecies = (name: string): boolean => {
    const clean = name.toLowerCase().trim();
    return (
      clean.includes('eucalyptus') || 
      clean.includes('akashmoni') || 
      clean.includes('ইউক্যালিপটাস') || 
      clean.includes('আকাশমনি')
    );
  };

  // Participant Registration handler
  const handleRegisterParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    // Validations
    if (!regName.trim()) {
      setRegError('Full Name is required (পূর্ণ নাম আবশ্যক)');
      return;
    }
    if (!regInstName.trim()) {
      setRegError('Institution Name is required (প্রতিষ্ঠানের নাম আবশ্যক)');
      return;
    }

    // Mobile Validation
    // Must be exactly 11 digits and start with valid local prefix (e.g. 017, 018, 019, 015, 016, 013, 014)
    const phoneClean = regMobile.trim().replace(/[^0-9]/g, '');
    const validPrefixes = ['013', '014', '015', '016', '017', '018', '019'];
    const hasValidPrefix = validPrefixes.some(prefix => phoneClean.startsWith(prefix));

    if (phoneClean.length !== 11 || !hasValidPrefix) {
      setRegError('Mobile number must be exactly 11 digits and start with valid prefix (013-019) / মোবাইল নম্বরটি অবশ্যই ১১ ডিজিটের এবং সঠিক অপারেটর কোড (০১৩-০১৯) দিয়ে শুরু হতে হবে।');
      return;
    }

    // Password length
    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters (পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে)');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match (পাসওয়ার্ড দুটি মেলেনি)');
      return;
    }

    // Determine location
    const districtName = isOtherDistrict ? customDistrict.trim() : 'Bogura (বগুড়া)';
    const upazilaName = isOtherDistrict ? customUpazila.trim() : 'Adamdighi (আদমদীঘি)';

    if (!districtName || !upazilaName) {
      setRegError('Please provide your District and Upazila (জেলা এবং উপজেলা প্রদান করুন)');
      return;
    }

    // Save
    const savedParts = localStorage.getItem('ge_gh_participants');
    let currentParts = savedParts ? JSON.parse(savedParts) : [];
    
    // Generate unique ID Format: GE-AT-000001
    const nextIdNum = currentParts.length + 1;
    const formattedId = `GE-AT-${String(nextIdNum).padStart(6, '0')}`;

    const newParticipant = {
      id: formattedId,
      name: regName.trim(),
      type: regInstType,
      institution: regInstName.trim(),
      grade: regInstType === 'student' ? regGrade : '',
      mobile: phoneClean,
      district: districtName,
      upazila: upazilaName,
      regDate: new Date().toISOString().split('T')[0],
      status: 'Approved', // Default approved for easy demo Flow!
      password: regPassword
    };

    currentParts.push(newParticipant);
    localStorage.setItem('ge_gh_participants', JSON.stringify(currentParts));
    setParticipants(currentParts);

    // Show success details modal
    setShowRegSuccess(newParticipant);

    // Clear form
    setRegName('');
    setRegInstName('');
    setRegMobile('');
    setRegPassword('');
    setRegConfirmPassword('');
    setCustomDistrict('');
    setCustomUpazila('');
    setIsOtherDistrict(false);
  };

  // Participant Login handler
  const handleLoginParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const savedParts = localStorage.getItem('ge_gh_participants');
    const currentParts = savedParts ? JSON.parse(savedParts) : [];

    const found = currentParts.find(
      (p: any) => p.id.toUpperCase() === loginId.trim().toUpperCase() && p.password === loginPassword
    );

    if (found) {
      setLoggedInUser(found);
      sessionStorage.setItem('ge_gh_logged_in', JSON.stringify(found));
      // Reset form
      setLoginId('');
      setLoginPassword('');
    } else {
      setLoginError('Invalid Participant ID or Password (অকার্যকর অংশগ্রহণকারী আইডি অথবা পাসওয়ার্ড)');
    }
  };

  const handleLogoutParticipant = () => {
    setLoggedInUser(null);
    sessionStorage.removeItem('ge_gh_logged_in');
  };

  // Repeater controls for registering trees
  const handleAddTreeRow = () => {
    const nextId = treeRows.length > 0 ? Math.max(...treeRows.map(r => r.id)) + 1 : 1;
    setTreeRows([...treeRows, { id: nextId, name: '', quantity: 1, type: 'Fruit Tree (ফলজ বৃক্ষ)', suggestions: [] }]);
  };

  const handleRemoveTreeRow = (id: number) => {
    if (treeRows.length === 1) return;
    setTreeRows(treeRows.filter(r => r.id !== id));
  };

  const handleTreeRowChange = (id: number, field: string, value: any) => {
    setTreeRows(treeRows.map(row => {
      if (row.id === id) {
        let updated = { ...row, [field]: value };
        if (field === 'name') {
          // Autocomplete suggestions
          if (value.trim().length > 0) {
            const matches = FLAT_SPECIES.filter(
              sp => sp.en.toLowerCase().includes(value.toLowerCase()) || sp.bn.includes(value)
            ).slice(0, 5);
            updated.suggestions = matches;
          } else {
            updated.suggestions = [];
          }
        }
        return updated;
      }
      return row;
    }));
  };

  // Handle tree registration submit
  const handleRegisterTrees = (e: React.FormEvent) => {
    e.preventDefault();
    setTreeRegError('');
    setTreeRegSuccess('');

    // Min 5 trees validation: let's sum total tree rows quantity
    const totalQuantity = treeRows.reduce((sum, row) => sum + Number(row.quantity), 0);
    if (totalQuantity < 5) {
      setTreeRegError('You must register a minimum of 5 trees to complete the registration (নিবন্ধন সম্পন্ন করতে আপনাকে নূযনতম ৫টি গাছ নিবন্ধন করতে হবে)');
      return;
    }

    // Eucalyptus/Akashmoni Banned filter validation
    let hasBanned = false;
    let bannedName = '';
    for (let row of treeRows) {
      if (isBannedSpecies(row.name)) {
        hasBanned = true;
        bannedName = row.name;
        break;
      }
    }

    if (hasBanned) {
      setBannedSpeciesAlert(`This species is banned by Government regulations: "${bannedName}" (এই প্রজাতিটি সরকারি নিয়ম অনুযায়ী নিষিদ্ধ: "${bannedName}")`);
      return;
    }

    // Verify planting date & photo
    if (!plantingDate) {
      setTreeRegError('Planting Date is required (রোপণের তারিখ আবশ্যক)');
      return;
    }
    if (!plantingAddress.trim()) {
      setTreeRegError('Address/Location is required (গাছ রোপণের ঠিকানা/অবস্থান আবশ্যক)');
      return;
    }

    // Default photo if empty
    const finalPhoto = treePhoto || 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=400';

    // Save registered trees
    const savedTrees = localStorage.getItem('ge_gh_trees');
    let currentTrees = savedTrees ? JSON.parse(savedTrees) : [];

    treeRows.forEach((row, rIdx) => {
      currentTrees.push({
        id: `tree-${Date.now()}-${rIdx}`,
        participantId: loggedInUser.id,
        participantName: loggedInUser.name,
        institutionName: loggedInUser.institution,
        mobile: loggedInUser.mobile,
        treeName: row.name.trim() || 'Custom Species (অন্যান্য প্রজাতি)',
        quantity: Number(row.quantity),
        treeType: row.type,
        location: plantingAddress.trim(),
        plantingDate: plantingDate,
        photo: row.photo || finalPhoto,
        status: 'Approved' // auto-approved for client-demo flow!
      });
    });

    localStorage.setItem('ge_gh_trees', JSON.stringify(currentTrees));
    setTrees(currentTrees);

    // Update state to trigger counters instantly
    setTreeRegSuccess('Trees registered successfully! (গাছগুলো সফলভাবে নিবন্ধিত হয়েছে!)');
    
    // Reset repeater
    setTreeRows([{ id: 1, name: '', quantity: 1, type: 'Fruit Tree (ফলজ বৃক্ষ)', suggestions: [] }]);
    setPlantingAddress('');
    setTreePhoto('');
    
    // Refresh parent datasets
    reloadData();
  };

  // Update registered tree details by participant
  const handleUpdateTreeParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTreeParticipant) return;

    if (isBannedSpecies(editTreeParticipant.treeName)) {
      setBannedSpeciesAlert(`This species is banned by Government regulations: "${editTreeParticipant.treeName}" (এই প্রজাতিটি সরকারি নিয়ম অনুযায়ী নিষিদ্ধ: "${editTreeParticipant.treeName}")`);
      return;
    }

    const savedTrees = localStorage.getItem('ge_gh_trees');
    if (savedTrees) {
      let currentTrees = JSON.parse(savedTrees);
      currentTrees = currentTrees.map((t: any) => {
        if (t.id === editTreeParticipant.id) {
          return {
            ...t,
            treeName: editTreeParticipant.treeName.trim() || t.treeName,
            treeType: editTreeParticipant.treeType || t.treeType,
            quantity: Number(editTreeParticipant.quantity) || t.quantity,
            plantingDate: editTreeParticipant.plantingDate || t.plantingDate,
            location: editTreeParticipant.location.trim() || t.location,
            photo: editTreeParticipant.photo || t.photo
          };
        }
        return t;
      });
      localStorage.setItem('ge_gh_trees', JSON.stringify(currentTrees));
      setTrees(currentTrees);
      setEditTreeParticipant(null);
      reloadData();
    }
  };

  // Submit monthly log
  const handleSubmitMonthlyLog = (e: React.FormEvent) => {
    e.preventDefault();
    setLogError('');
    setLogSuccess('');

    // Photo validation
    const finalLogPhoto = logPhoto || 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=400';

    // Check if a log is already submitted/approved for this month
    const savedLogs = localStorage.getItem('ge_gh_logs') ? JSON.parse(localStorage.getItem('ge_gh_logs')!) : [];
    const existing = savedLogs.find((l: any) => l.participantId === loggedInUser.id && l.month === activeMonthTab);

    if (existing && (existing.status === 'Approved' || existing.status === 'Pending')) {
      setLogError(`Log for Month ${activeMonthTab} is already ${existing.status} (${activeMonthTab} মাসের লগ ইতোমধ্যে ${existing.status === 'Approved' ? 'অনুমোদিত' : 'পর্যালোচনার অপেক্ষায়'} আছে)`);
      return;
    }

    // Add new log
    const newLog = {
      id: `log-${Date.now()}`,
      participantId: loggedInUser.id,
      month: activeMonthTab,
      health: logHealth,
      photo: finalLogPhoto,
      comments: logComments.trim(),
      status: 'Pending', // Sent to Admin
      remarks: '',
      date: new Date().toISOString().split('T')[0]
    };

    // Filter out old rejected logs for same month if resubmitting
    const filteredLogs = savedLogs.filter((l: any) => !(l.participantId === loggedInUser.id && l.month === activeMonthTab));
    filteredLogs.push(newLog);

    localStorage.setItem('ge_gh_logs', JSON.stringify(filteredLogs));
    setLogs(filteredLogs);

    setLogSuccess(`Monthly progress log submitted successfully for Month ${activeMonthTab}! It will be reviewed by administrators. (${activeMonthTab} মাসের প্রগতি লগ সফলভাবে জমা দেওয়া হয়েছে! অ্যাডমিন এটি পর্যালোচনা করবেন।)`);
    setLogComments('');
    setLogPhoto('');

    // Sync views
    reloadData();
  };

  // Get current participant's log status for a specific month
  const getMonthLogStatus = (partId: string, month: number): 'Locked' | 'Due' | 'Pending' | 'Approved' | 'Rejected' => {
    const savedLogs = logs.filter(l => l.participantId === partId);
    
    // Month 1 rules: always available unless approved
    // Month 2 rules: requires Month 1 Approved
    // Month 3 rules: requires Month 2 Approved
    
    if (month === 2) {
      const month1Approved = savedLogs.some(l => l.month === 1 && l.status === 'Approved');
      if (!month1Approved) return 'Locked';
    }
    if (month === 3) {
      const month2Approved = savedLogs.some(l => l.month === 2 && l.status === 'Approved');
      if (!month2Approved) return 'Locked';
    }

    const log = savedLogs.find(l => l.month === month);
    if (!log) return 'Due';
    if (log.status === 'Pending') return 'Pending';
    if (log.status === 'Approved') return 'Approved';
    return 'Rejected';
  };

  // Calculate high school and student leaderboards from storage
  // 1. School Leaderboard
  const schoolStats = distinctSchools.map(school => {
    const schoolParts = participants.filter(p => p.type === 'student' && p.institution === school);
    const partIds = schoolParts.map(p => p.id);
    const schoolTrees = trees.filter(t => partIds.includes(t.participantId));
    const totalReg = schoolTrees.reduce((sum, t) => sum + t.quantity, 0);
    
    // Surviving calculations
    const deadPartIds = logs.filter(l => partIds.includes(l.participantId) && l.health?.startsWith('Dead') && l.status === 'Approved').map(l => l.participantId);
    const totalSurv = schoolTrees.reduce((sum, t) => {
      if (deadPartIds.includes(t.participantId)) return sum;
      return sum + t.quantity;
    }, 0);

    const sRate = totalReg > 0 ? Math.round((totalSurv / totalReg) * 100) : 100;

    return {
      school,
      participantsCount: schoolParts.length,
      treesRegistered: totalReg || 5,
      treesSurviving: totalSurv || 5,
      rate: sRate
    };
  }).sort((a, b) => b.treesSurviving - a.treesSurviving || b.rate - a.rate);

  // 2. Student Leaderboard
  const studentStats = participants.map(p => {
    const pTrees = trees.filter(t => t.participantId === p.id);
    const totalReg = pTrees.reduce((sum, t) => sum + t.quantity, 0);

    const isDead = logs.some(l => l.participantId === p.id && l.health?.startsWith('Dead') && l.status === 'Approved');
    const totalSurv = isDead ? 0 : totalReg;
    const sRate = totalReg > 0 ? Math.round((totalSurv / totalReg) * 100) : 100;

    return {
      id: p.id,
      name: p.name,
      institution: p.institution || 'Volunteer',
      treesRegistered: totalReg || 5,
      treesSurviving: totalSurv || 5,
      rate: sRate
    };
  }).sort((a, b) => b.treesSurviving - a.treesSurviving || b.rate - a.rate);

  // Is logged in participant eligible for certificate?
  // Eligible if Month 3 status is 'Approved'
  const isEligibleForCertificate = loggedInUser && getMonthLogStatus(loggedInUser.id, 3) === 'Approved';

  // State to show the live bilingual certificate display
  const [showCertificatePreview, setShowCertificatePreview] = useState(false);

  // Custom certificate template selection state
  const [certType, setCertType] = useState<'custom' | 'classic'>(() => 
    localStorage.getItem('ge_gh_custom_cert_image') ? 'custom' : 'classic'
  );

  // Dynamically load the correct default mode if settings changed
  useEffect(() => {
    if (showCertificatePreview) {
      setCertType(localStorage.getItem('ge_gh_custom_cert_image') ? 'custom' : 'classic');
    }
  }, [showCertificatePreview]);

  const downloadCustomCertImage = () => {
    if (!loggedInUser) return;
    const customImgBase64 = localStorage.getItem('ge_gh_custom_cert_image');
    if (!customImgBase64) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = customImgBase64;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const nameYPercent = Number(localStorage.getItem('ge_gh_custom_cert_name_y')) || 53;
      const customFontSize = Number(localStorage.getItem('ge_gh_custom_cert_font_size')) || 36;
      const customColor = localStorage.getItem('ge_gh_custom_cert_color') || '#1b5e20';

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const scaleFactor = img.width / 800;
      const finalFontSize = Math.round(customFontSize * scaleFactor);
      
      ctx.font = `bold ${finalFontSize}px "Anek Bangla", "Inter", sans-serif`;
      ctx.fillStyle = customColor;

      const posX = img.width / 2;
      const posY = (nameYPercent / 100) * img.height;

      ctx.fillText(loggedInUser.name, posX, posY);

      const link = document.createElement('a');
      link.download = `${loggedInUser.name.replace(/\s+/g, '_')}_Green_Hero_Certificate.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.click();
    };
  };

  return (
    <div className="bg-[#FAFBF7] py-12" id="green-hero-initiative-panel">
      {/* Dynamic Alert Banner for government banned species */}
      <AnimatePresence>
        {bannedSpeciesAlert && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 font-sans"
            id="banned-species-popup-notice"
          >
            <div className="bg-white max-w-lg w-full rounded-3xl p-8 border-4 border-red-500 shadow-2xl relative text-center space-y-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mx-auto">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-black text-red-800">
                Government Banned Species Detected (নিষিদ্ধ গাছের প্রজাতি শনাক্ত করা হয়েছে)
              </h3>
              <p className="text-sm font-semibold text-gray-700 leading-relaxed bg-red-50 p-4 rounded-2xl border border-red-100">
                {bannedSpeciesAlert}
              </p>
              <div className="text-xs text-gray-500 font-medium">
                Species like Eucalyptus (ইউক্যালিপটাস) and Akashmoni (আকাশমনি) are strictly prohibited due to soil damage and water depletion. (ইউক্যালিপটাস এবং আকাশমনি পরিবেশের ক্ষতি ও জলস্তর হ্রাসের কারণে সরকারিভাবে নিষিদ্ধ করা হয়েছে।)
              </div>
              <button
                onClick={() => setBannedSpeciesAlert(null)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full text-sm cursor-pointer transition-colors shadow-lg"
              >
                Close (বন্ধ করুন)
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        {/* --- PAGE HEADER & TITLE (BILINGUAL) --- */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/50 text-[#1B5E20] text-xs font-mono font-bold tracking-wider uppercase shadow-sm">
            <Leaf size={14} fill="currentColor" />
            <span>Green Earth Campaign (গ্রিন আর্থ সচেতনতা অভিযান)</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight font-sans">
            {overview.titleEn || 'Green Hero Initiative (Adapt a Tree)'}
            <span className="block text-emerald-700 text-2xl md:text-3xl mt-1.5 font-bold font-sans">
              ({overview.titleBn || 'গ্রিন হিরো ইনিশিয়েティブ - একটি গাছ দত্তক নিন'})
            </span>
          </h1>
          <p className="text-sm md:text-base text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
            {overview.subtitleEn || 'Plant Trees Today, Protect Tomorrow'} —{' '}
            <span className="text-emerald-800">
              {overview.subtitleBn || 'আজই বৃক্ষরোপণ করুন, আগামীকে সুরক্ষিত রাখুন'}
            </span>
          </p>
        </div>

        {/* --- MAIN PAGE TAB NAVIGATION (BILINGUAL) --- */}
        <div className="flex flex-wrap justify-center items-center gap-3 border-b border-gray-200 pb-4">
          {[
            { id: 'home', en: 'Objectives & Overview', bn: 'উদ্দেশ্য ও ওভারভিউ' },
            { id: 'rules', en: 'Rules & Warnings', bn: 'নিয়ম ও সতর্কবার্তা' },
            { id: 'species', en: 'Eligible Tree Species', bn: 'যোগ্য গাছের প্রজাতি' },
            { id: 'impact', en: 'Impact & Leaderboard', bn: 'প্রভাব ও লিডারবোর্ড' },
            { id: 'portal', en: 'Participate Here', bn: 'এখানে অংশ নিন' }
          ].map((tab) => {
            const isPortal = tab.id === 'portal';
            if (isPortal) {
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab('portal')}
                  className={`py-2.5 px-6 rounded-full text-xs font-black font-sans transition-all cursor-pointer border-2 shadow-md flex items-center gap-1.5 ${
                    activeSubTab === 'portal'
                      ? 'bg-gradient-to-r from-emerald-600 to-green-700 border-emerald-500 text-white scale-105 shadow-emerald-200'
                      : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100 hover:text-emerald-950 animate-pulse'
                  }`}
                  id="participate-here-tab-button"
                >
                  <Award size={14} className="text-amber-400 fill-amber-400 animate-bounce" />
                  <span>{tab.en} ({tab.bn})</span>
                </button>
              );
            }
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`py-2 px-4 rounded-full text-xs font-bold font-sans transition-all cursor-pointer border ${
                  activeSubTab === tab.id
                    ? 'bg-[#1B5E20] border-[#1B5E20] text-white shadow'
                    : 'bg-white border-gray-200 text-gray-600 hover:text-[#1B5E20] hover:bg-emerald-50/50'
                }`}
              >
                {tab.en} ({tab.bn})
              </button>
            );
          })}
        </div>

        {/* --- VIEW DECIDER --- */}
        <div className="space-y-12">
          
          {/* TAB 1: OBJECTIVES & OVERVIEW */}
          {activeSubTab === 'home' && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
              id="subtab-overview-view"
            >
              {/* Left Column: Text & Structured Objectives */}
              <div className="lg:col-span-7 space-y-6 text-left">
                
                {/* Hero Mission Card */}
                <div className="bg-gradient-to-br from-emerald-800 to-[#1B5E20] text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-8 -mt-8" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -ml-16 -mb-16" />
                  
                  <div className="relative space-y-4">
                    <div className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase font-bold text-emerald-100">
                      Our Goal & Mission
                    </div>
                    <h3 className="text-xl md:text-2xl font-black">
                      The Mission <span className="text-emerald-200 font-anek font-normal">(আমাদের লক্ষ্য)</span>
                    </h3>
                    <p className="text-xs md:text-sm font-medium leading-relaxed text-emerald-50">
                      {overview.descriptionEn}
                    </p>
                    <div className="border-t border-emerald-700/60 pt-4 mt-2">
                      <p className="text-xs md:text-sm font-medium leading-relaxed font-anek text-emerald-100">
                        {overview.descriptionBn}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Core Objectives Header */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-emerald-600 rounded-full" />
                    <h3 className="text-lg font-black text-gray-900 font-sans">
                      Core Objectives <span className="font-anek text-emerald-700 font-bold text-base">(মূল উদ্দেশ্যসমূহ)</span>
                    </h3>
                  </div>

                  {/* Core Objectives List */}
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      {
                        titleEn: 'Local Greening',
                        titleBn: 'স্থানীয় পর্যায়ে সবুজায়ন',
                        descEn: 'Establishing climate-resilient green belts in schools, unused community spaces, and village yards.',
                        descBn: 'স্কুল, অব্যবহৃত সামাজিক স্থান এবং গ্রামীণ উঠানে জলবায়ু সহনশীল সবুজ বলয় তৈরি করা।',
                        color: 'from-emerald-500 to-teal-600',
                        badgeEn: 'Eco Belt',
                        badgeBn: 'সবুজ বেষ্টনী'
                      },
                      {
                        titleEn: 'Environmental Stewardship',
                        titleBn: 'পরিবেশ সচেতনতা সৃষ্টি',
                        descEn: 'Involving young minds in direct environmental preservation.',
                        descBn: 'নতুন প্রজন্মকে সরাসরি পরিবেশ সংরক্ষণের মূলধারার কার্যক্রমে সম্পৃক্ত করা।',
                        color: 'from-amber-500 to-orange-600',
                        badgeEn: 'Stewardship',
                        badgeBn: 'সচেতনতা'
                      },
                      {
                        titleEn: 'Long-term Survival',
                        titleBn: 'দীর্ঘমেয়াদী টিকে থাকার হার',
                        descEn: 'Aiming for an 80% to 90% survival rate of planted trees through systematic, documented care for three months.',
                        descBn: '৩ মাস ধরে সুনির্দিষ্ট এবং সুসংগঠিত পরিচর্যার মাধ্যমে গাছেদের ৮০% থেকে ৯০% বেঁচে থাকার হার নিশ্চিত করা।',
                        color: 'from-blue-500 to-indigo-600',
                        badgeEn: 'Sustainability',
                        badgeBn: 'স্থায়িত্ব'
                      }
                    ].map((obj, idx) => (
                      <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 items-start relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className={`w-10 h-10 bg-gradient-to-br ${obj.color} text-white rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-sm`}>
                          0{idx + 1}
                        </div>
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-bold text-gray-900 text-sm">
                              {obj.titleEn}
                            </h4>
                            <span className="bg-emerald-50 text-[#1B5E20] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                              {obj.badgeEn}
                            </span>
                            <span className="bg-emerald-100 text-[#1B5E20] text-[9px] font-anek font-bold px-2 py-0.5 rounded-full">
                              {obj.badgeBn}
                            </span>
                          </div>
                          
                          <p className="text-xs text-gray-500 font-medium leading-relaxed">
                            {obj.descEn}
                          </p>
                          <p className="text-xs font-anek text-emerald-800 font-semibold border-t border-gray-50 pt-1.5 mt-1">
                            {obj.descBn}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Flow & Graphic banner */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* How it Works Visual Timeline */}
                <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-sm space-y-4 text-left">
                  <div className="border-b border-gray-100 pb-3">
                    <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-emerald-600">Dynamic Campaign System</span>
                    <h4 className="font-black text-gray-900 text-sm">
                      How It Works <span className="font-anek text-emerald-700 font-bold">({overview.titleBn ? 'যেভাবে কাজ করে' : 'যেভাবে কাজ করে'})</span>
                    </h4>
                  </div>

                  <div className="space-y-4 relative">
                    {/* Vertical connecting line */}
                    <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gradient-to-b from-emerald-500 via-emerald-300 to-gray-200" />

                    {[
                      {
                        step: '01',
                        titleEn: 'Plant and Adapt',
                        titleBn: 'চারা রোপণ ও দত্তক',
                        descEn: 'Plant trees in school, yard, or local community spots.',
                        descBn: 'আপনার স্কুল, বাড়ির আঙিনা বা স্থানীয় সামাজিক স্থানে চারা রোপণ করুন।'
                      },
                      {
                        step: '02',
                        titleEn: 'Register Online',
                        titleBn: 'অনলাইন নিবন্ধন',
                        descEn: 'Register details and upload an initial planting photo.',
                        descBn: 'গাছের বিস্তারিত তথ্য লিখে প্রথম রোপণের ছবিসহ আমাদের পোর্টালে নিবন্ধন করুন।'
                      },
                      {
                        step: '03',
                        titleEn: 'Nurture & Log Progress',
                        titleBn: 'পরিচর্যা ও প্রগতি ডায়েরি',
                        descEn: 'Provide water and log monthly growth for 3 consecutive months.',
                        descBn: '৩ মাস ধরে নিয়মিত পানি দিন এবং প্রতিমাসে বৃদ্ধির ছবি আপলোড করুন।'
                      },
                      {
                        step: '04',
                        titleEn: 'Earn Green Hero Awards',
                        titleBn: 'গ্রিন হিরো পুরস্কার অর্জন',
                        descEn: 'Get your verified certificate & profile digital badge.',
                        descBn: 'অ্যাডমিন কর্তৃক ডায়েরি অনুমোদিত হওয়ার পর সার্টিফিকেট ও ব্যাজ অর্জন করুন।'
                      }
                    ].map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-start relative">
                        <div className="w-10 h-10 bg-emerald-50 border border-emerald-300 text-[#1B5E20] font-mono font-black text-xs rounded-full flex items-center justify-center shrink-0 z-10 shadow-xs">
                          {item.step}
                        </div>
                        <div className="bg-gray-50/50 hover:bg-emerald-50/10 border border-gray-100 p-3 rounded-2xl flex-1 text-xs">
                          <h5 className="font-black text-gray-950 flex flex-wrap items-center gap-1.5">
                            <span>{item.titleEn}</span>
                            <span className="text-[#1B5E20] font-anek font-semibold">({item.titleBn})</span>
                          </h5>
                          <p className="text-gray-500 font-medium mt-1">
                            {item.descEn}
                          </p>
                          <p className="font-anek text-emerald-800 font-medium mt-0.5">
                            {item.descBn}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gradient-to-r from-emerald-600 to-[#1B5E20] text-white p-3 rounded-2xl shadow-xs font-black text-xs text-center font-anek">
                    গ্রিন হিরো হিসেবে বিশ্বমঞ্চে নিজেকে পুরস্কৃত করুন! 🌟
                  </div>
                </div>

                {/* Graphic Banner Panel */}
                <div className="relative">
                  <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-[#1B5E20] to-[#4CAF50] opacity-20 blur-md" />
                  <div className="relative bg-white rounded-3xl p-3 shadow-md border border-gray-100 overflow-hidden text-left">
                    <img 
                      src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80"
                      alt="Planting trees"
                      referrerPolicy="no-referrer"
                      className="rounded-2xl w-full object-cover h-[240px] shadow-sm brightness-90"
                    />
                    <div className="absolute bottom-6 left-6 right-6 bg-[#1B5E20]/95 backdrop-blur-md p-4 rounded-xl border border-white/10 text-white space-y-1">
                      <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-300 block uppercase">Adamdighi Climate Action</span>
                      <h4 className="text-xs md:text-sm font-black leading-snug font-anek">
                        আদমদীঘিতে তাপমাত্রা বৃদ্ধি রোধ ও জলবায়ু সহনশীল পরিবেশ গড়ে তুলতে প্রতিটি শিক্ষার্থীর অবদান হোক একেকটি বৃক্ষ! 🌱
                      </h4>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 2: RULES & GUIDELINES */}
          {activeSubTab === 'rules' && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
              id="subtab-rules-view"
            >
              {/* Title Header with beautiful border accent */}
              <div className="text-center max-w-xl mx-auto space-y-3">
                <span className="bg-amber-100 text-amber-800 text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Campaign Compliance
                </span>
                <h3 className="text-2xl font-black text-gray-900 font-sans">
                  Rules & Guidelines <span className="font-anek text-emerald-700 font-bold">(নিয়মাবলী ও নির্দেশিকা)</span>
                </h3>
                <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                  Follow these strict guidelines to maintain the integrity of our environmental registry. 
                  <span className="block text-emerald-800 font-anek font-normal mt-1">(আমাদের পরিবেশ রেজিস্ট্রি অক্ষুণ্ণ রাখতে অবশ্যই এই নিয়মগুলো কঠোরভাবে মেনে চলুন।)</span>
                </p>
              </div>

              {/* Rules Cards Grid with Custom Color Coding */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                {/* Rule 1: Emerald Theme */}
                <div className="bg-white border-l-4 border-emerald-500 rounded-2xl p-6 shadow-sm flex gap-4 text-left items-start relative overflow-hidden hover:shadow-md transition-shadow">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-bl-full" />
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center font-bold font-mono text-sm shrink-0">
                    01
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <span className="text-[10px] font-mono font-bold text-emerald-600 block uppercase">Minimum Entry Count</span>
                    <h4 className="font-black text-emerald-900 text-sm">
                      Minimum 5 Trees <span className="font-anek text-emerald-700 font-bold">(নূযনতম ৫টি গাছ)</span>
                    </h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">
                      Each participant must register and plant at least 5 or more trees to complete registration and qualify for awards.
                    </p>
                    <p className="text-xs font-anek text-emerald-850 font-medium leading-relaxed bg-emerald-50/40 p-2 rounded-xl border border-emerald-100/50 mt-1">
                      অংশগ্রহণ সম্পন্ন করতে এবং পুরস্কার অর্জন করতে প্রত্যেক অংশগ্রহণকারীকে অবশ্যই নূযনতম ৫টি বা তার বেশি গাছ রোপণ ও নিবন্ধন করতে হবে।
                    </p>
                  </div>
                </div>

                {/* Rule 2: Amber Theme */}
                <div className="bg-white border-l-4 border-amber-500 rounded-2xl p-6 shadow-sm flex gap-4 text-left items-start relative overflow-hidden hover:shadow-md transition-shadow">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-bl-full" />
                  <div className="w-10 h-10 bg-amber-100 text-amber-850 rounded-xl flex items-center justify-center font-bold font-mono text-sm shrink-0">
                    02
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <span className="text-[10px] font-mono font-bold text-amber-600 block uppercase">Lifelong Protection</span>
                    <h4 className="font-black text-amber-950 text-sm">
                      Participant's Responsibility <span className="font-anek text-amber-800 font-bold">(অংশগ্রহণকারীর দায়িত্ব)</span>
                    </h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">
                      The participant must take full lifelong responsibility for the care, watering, and protection of their trees.
                    </p>
                    <p className="text-xs font-anek text-amber-900 font-medium leading-relaxed bg-amber-50/40 p-2 rounded-xl border border-amber-100/50 mt-1">
                      অংশগ্রহণকারীকে গাছের দীর্ঘমেয়াদী যত্ন, পানি দেওয়া এবং সুরক্ষার জন্য সম্পূর্ণ নিজ দায়িত্ব বহন করতে হবে।
                    </p>
                  </div>
                </div>

                {/* Rule 3: Sky Blue Theme */}
                <div className="bg-white border-l-4 border-blue-500 rounded-2xl p-6 shadow-sm flex gap-4 text-left items-start relative overflow-hidden hover:shadow-md transition-shadow">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-bl-full" />
                  <div className="w-10 h-10 bg-blue-100 text-blue-800 rounded-xl flex items-center justify-center font-bold font-mono text-sm shrink-0">
                    03
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <span className="text-[10px] font-mono font-bold text-blue-600 block uppercase">Care Verification</span>
                    <h4 className="font-black text-blue-950 text-sm">
                      3-Month Monitoring <span className="font-anek text-blue-800 font-bold">(৩ মাসের মনিটরিং)</span>
                    </h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">
                      Regular submission of photos/videos tracking growth at Month 1, Month 2, and Month 3 is mandatory to get approved.
                    </p>
                    <p className="text-xs font-anek text-blue-900 font-medium leading-relaxed bg-blue-50/40 p-2 rounded-xl border border-blue-100/50 mt-1">
                      গাছের সঠিক বৃদ্ধি ট্র্যাক করতে ১ম মাস, ২য় মাস এবং ৩য় মাসে ছবি/ভিডিও আপলোড ও লগ জমা দেওয়া বাধ্যতামূলক।
                    </p>
                  </div>
                </div>

                {/* Rule 4: Red/Rose Theme */}
                <div className="bg-white border-l-4 border-rose-500 rounded-2xl p-6 shadow-sm flex gap-4 text-left items-start relative overflow-hidden hover:shadow-md transition-shadow">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/5 rounded-bl-full" />
                  <div className="w-10 h-10 bg-rose-100 text-rose-800 rounded-xl flex items-center justify-center font-bold font-mono text-sm shrink-0">
                    04
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <span className="text-[10px] font-mono font-bold text-rose-600 block uppercase">No Cheat Protocol</span>
                    <h4 className="font-black text-rose-950 text-sm">
                      Valid Information Only <span className="font-anek text-rose-800 font-bold">(শুধুমাত্র সত্য তথ্য)</span>
                    </h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">
                      Submitting false information or fake photos will result in immediate profile suspension and rejection of status.
                    </p>
                    <p className="text-xs font-anek text-rose-900 font-medium leading-relaxed bg-rose-50/40 p-2 rounded-xl border border-rose-100/50 mt-1">
                      ভুল তথ্য বা নকল ছবি সাবমিট করলে তাৎক্ষণিকভাবে অংশগ্রহণকারীর প্রোফাইল স্থগিত এবং নিবন্ধন বাতিল করা হবে।
                    </p>
                  </div>
                </div>
              </div>

              {/* CRITICAL GOVERNMENT BAN CARD - Highly Striking and Attention Grabbing */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-500 rounded-3xl p-6 md:p-8 max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-6 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 w-16 h-16 bg-red-500/10 rounded-br-full" />
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center text-red-600 shrink-0 shadow-sm border border-red-200">
                  <AlertTriangle size={28} />
                </div>
                <div className="space-y-2 text-left flex-1">
                  <span className="bg-red-600 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    Banned List Warning
                  </span>
                  <h4 className="text-red-900 text-base font-black uppercase tracking-wide">
                    CRITICAL BAN WARNING <span className="font-anek text-red-700 font-bold">(কঠোর নিষেধাজ্ঞা সতর্কবার্তা)</span>
                  </h4>
                  <p className="text-xs md:text-sm font-semibold text-gray-800 leading-relaxed">
                    Government banned species <strong className="text-red-600">Eucalyptus (ইউক্যালিপটাস)</strong> and <strong className="text-red-600">Akashmoni (আকাশমনি)</strong> are <strong className="underline decoration-red-500">STRICTLY PROHIBITED</strong>. Any registration containing these will be automatically rejected.
                  </p>
                  <p className="text-xs font-anek text-red-800 font-medium leading-relaxed bg-red-150/50 p-2.5 rounded-xl border border-red-200 mt-2">
                    (সরকারিভাবে নিষিদ্ধ পরিবেশের জন্য চরম ক্ষতিকারক গাছ ইউক্যালিপটাস এবং আকাশমনি রোপণ করা কঠোরভাবে নিষেধ। এই ধরনের গাছের নিবন্ধন করা হলে তা কোনো পূর্ব নোটিশ ছাড়াই সরাসরি বাতিল হয়ে যাবে।)
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: ELIGIBLE SPECIES */}
          {activeSubTab === 'species' && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
              id="subtab-species-view"
            >
              {/* Flexible guidelines note */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-500/20 rounded-3xl p-6 text-left max-w-4xl mx-auto space-y-3 shadow-xs">
                <div className="flex items-center gap-2 text-[#1B5E20] font-black text-sm">
                  <Info size={20} className="text-emerald-600 shrink-0" />
                  <span>CRITICAL IMPLEMENTATION NOTE <span className="font-anek text-emerald-700 font-bold">(গুরুত্বপূর্ণ বাস্তবায়নের নোট)</span></span>
                </div>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed font-sans font-medium">
                  The species listed below are <strong>ONLY SUGGESTIONS AND EXAMPLES</strong> (এটি শুধুমাত্র উদাহরণের জন্য, বাধ্যতামূলক বা চূড়ান্ত নয়). Participants can manually register <strong>ANY</strong> tree species suitable for their region, as long as it is not Eucalyptus or Akashmoni.
                </p>
                <div className="border-t border-emerald-100 pt-3 mt-1 text-xs font-anek text-emerald-800 font-semibold leading-relaxed">
                  (নিচের তালিকাটি কেবল চারা রোপণের ধারণা দেওয়ার জন্য। অংশগ্রহণকারী তার নিজের এলাকায় উপযুক্ত যেকোনো দেশীয় ফলজ, বনজ বা ঔষধি গাছ নিজে লিখেও নিবন্ধন করতে পারবেন, শুধুমাত্র তা ইউক্যালিপটাস বা আকাশমনি হওয়া যাবে না।)
                </div>
              </div>

              {/* Bento Grid Categories - Highly Colorful and Clean */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
                {/* 1. Fruit Trees: Amber Yellow Theme */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs hover:shadow-md transition-shadow text-left flex flex-col h-full border-t-4 border-amber-500 relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-500/5 rounded-full" />
                  <h4 className="font-black text-amber-950 text-sm mb-4 border-b border-gray-100 pb-2 flex items-center gap-1.5">
                    <span className="text-base">🍎</span>
                    <span>Fruit Trees <span className="font-anek text-amber-700 font-bold block text-xs mt-0.5">(ফলজ বৃক্ষ)</span></span>
                  </h4>
                  <ul className="text-xs font-semibold text-gray-600 space-y-2 flex-1 relative">
                    {SUGGESTED_SPECIES.fruit.slice(0, 9).map((sp, idx) => (
                      <li key={idx} className="flex items-center gap-2 py-1.5 border-b border-gray-50/50 hover:bg-amber-50/20 px-1 rounded-lg transition-colors">
                        <Check size={12} className="text-amber-500 shrink-0" />
                        <span className="text-gray-800">{sp.en} <span className="font-anek text-[11px] text-amber-800">({sp.bn})</span></span>
                      </li>
                    ))}
                    <li className="text-[10px] text-amber-600 font-bold italic pt-2 flex items-center gap-1">
                      <span>✦</span>
                      <span>And 5+ more species (আরও ৫টি প্রজাতি)</span>
                    </li>
                  </ul>
                </div>

                {/* 2. Forest Trees: Deep Green Theme */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs hover:shadow-md transition-shadow text-left flex flex-col h-full border-t-4 border-emerald-600 relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-600/5 rounded-full" />
                  <h4 className="font-black text-emerald-950 text-sm mb-4 border-b border-gray-100 pb-2 flex items-center gap-1.5">
                    <span className="text-base">🌲</span>
                    <span>Forest Trees <span className="font-anek text-emerald-700 font-bold block text-xs mt-0.5">(বনজ বৃক্ষ)</span></span>
                  </h4>
                  <ul className="text-xs font-semibold text-gray-600 space-y-2 flex-1 relative">
                    {SUGGESTED_SPECIES.forest.map((sp, idx) => (
                      <li key={idx} className="flex items-center gap-2 py-1.5 border-b border-gray-50/50 hover:bg-emerald-50/20 px-1 rounded-lg transition-colors">
                        <Check size={12} className="text-emerald-600 shrink-0" />
                        <span className="text-gray-800">{sp.en} <span className="font-anek text-[11px] text-emerald-800">({sp.bn})</span></span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 3. Medicinal Trees: Teal Theme */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs hover:shadow-md transition-shadow text-left flex flex-col h-full border-t-4 border-teal-600 relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-teal-600/5 rounded-full" />
                  <h4 className="font-black text-teal-950 text-sm mb-4 border-b border-gray-100 pb-2 flex items-center gap-1.5">
                    <span className="text-base">🌿</span>
                    <span>Medicinal <span className="font-anek text-teal-700 font-bold block text-xs mt-0.5">(ঔষধি বৃক্ষ)</span></span>
                  </h4>
                  <ul className="text-xs font-semibold text-gray-600 space-y-2 flex-1 relative">
                    {SUGGESTED_SPECIES.medicinal.map((sp, idx) => (
                      <li key={idx} className="flex items-center gap-2 py-1.5 border-b border-gray-50/50 hover:bg-teal-50/20 px-1 rounded-lg transition-colors">
                        <Check size={12} className="text-teal-600 shrink-0" />
                        <span className="text-gray-800">{sp.en} <span className="font-anek text-[11px] text-teal-800">({sp.bn})</span></span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 4. Indoor Plants: Purple Theme */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs hover:shadow-md transition-shadow text-left flex flex-col h-full border-t-4 border-purple-500 relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-500/5 rounded-full" />
                  <h4 className="font-black text-purple-950 text-sm mb-4 border-b border-gray-100 pb-2 flex items-center gap-1.5">
                    <span className="text-base">🪴</span>
                    <span>Indoor Plants <span className="font-anek text-purple-700 font-bold block text-xs mt-0.5">(ইনডোর প্ল্যান্ট)</span></span>
                  </h4>
                  <ul className="text-xs font-semibold text-gray-600 space-y-2 flex-1 relative">
                    {SUGGESTED_SPECIES.indoor.map((sp, idx) => (
                      <li key={idx} className="flex items-center gap-2 py-1.5 border-b border-gray-50/50 hover:bg-purple-50/20 px-1 rounded-lg transition-colors">
                        <Check size={12} className="text-purple-500 shrink-0" />
                        <span className="text-gray-800">{sp.en} <span className="font-anek text-[11px] text-purple-800">({sp.bn})</span></span>
                      </li>
                    ))}
                    <li className="text-[10px] text-purple-600 font-bold italic pt-2 flex items-center gap-1 border-t border-gray-50 mt-1">
                      <span>✧</span>
                      <span>Allowed for indoors (ইনডোর সাজসজ্জার জন্য অনুমোদিত)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}



          {/* TAB 4: IMPACT DASHBOARD & LEADERBOARDS */}
          {activeSubTab === 'impact' && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
              id="subtab-impact-view"
            >
              {/* Heading and Brief */}
              <div className="text-center max-w-xl mx-auto space-y-2">
                <span className="bg-emerald-100 text-[#1B5E20] text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Live Ecological Statistics
                </span>
                <h3 className="text-2xl font-black text-gray-900 font-sans">
                  Impact & Leaderboard <span className="font-anek text-emerald-700 font-bold">(প্রভাব ও লিডারবোর্ড)</span>
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  Behold the real-time contributions of our environmental heroes. Every tree helps ADAMDIGHI breathe easier!
                  <span className="block mt-1 text-emerald-800 font-anek font-normal">(আমাদের পরিবেশ বীরদের রিয়েল-টাইম অবদান। প্রতিটি গাছ আদমদীঘিকে এনে দিচ্ছে নির্মল বাতাস!)</span>
                </p>
              </div>

              {/* Counters Widget Grid - Highly Stylish */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
                {[
                  {
                    titleEn: 'Registered Heroes',
                    titleBn: 'নিবন্ধিত বীর',
                    value: totalParticipants,
                    color: 'from-emerald-500 to-emerald-700 shadow-emerald-100',
                    icon: '👥'
                  },
                  {
                    titleEn: 'Trees Planted',
                    titleBn: 'রোপিত গাছ',
                    value: totalTreesPlanted,
                    color: 'from-green-500 to-green-700 shadow-green-100',
                    icon: '🌱'
                  },
                  {
                    titleEn: 'Verified Surviving',
                    titleBn: 'টিকে থাকা গাছ',
                    value: totalSurvivingTrees,
                    color: 'from-teal-500 to-teal-700 shadow-teal-100',
                    icon: '💖'
                  },
                  {
                    titleEn: 'Survival Rate',
                    titleBn: 'টিকে থাকার হার',
                    value: `${survivalRate}%`,
                    color: 'from-blue-500 to-indigo-600 shadow-blue-100',
                    icon: '📈'
                  },
                  {
                    titleEn: 'Schools Connected',
                    titleBn: 'সংযুক্ত স্কুল',
                    value: totalSchools,
                    color: 'from-amber-500 to-orange-600 shadow-amber-100',
                    icon: '🏫'
                  },
                  {
                    titleEn: 'Active Districts',
                    titleBn: 'সক্রিয় জেলা',
                    value: totalDistricts,
                    color: 'from-purple-500 to-purple-700 shadow-purple-100',
                    icon: '📍'
                  }
                ].map((stat, sIdx) => (
                  <div key={sIdx} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between items-center text-center space-y-2 relative overflow-hidden group hover:scale-[1.03] transition-all border-b-4 border-emerald-600">
                    <div className="absolute top-0 right-0 w-10 h-10 bg-gray-50 rounded-bl-full flex items-center justify-center font-bold text-xs">
                      {stat.icon}
                    </div>
                    <div className="space-y-1 flex-1">
                      <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider leading-tight">
                        {stat.titleEn}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-800 font-anek block leading-none">
                        ({stat.titleBn})
                      </span>
                    </div>
                    <div className="text-3xl font-black text-gray-900 pt-2 font-sans">
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Leaderboards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-sans">
                {/* School Leaderboard */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-5">
                  <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 text-lg shadow-xs">
                      🏆
                    </div>
                    <div className="text-left">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-600">Top Performing Academic Bodies</span>
                      <h4 className="text-base font-black text-gray-900 leading-tight">
                        School Leaderboard <span className="font-anek text-emerald-700 font-bold text-sm block sm:inline">({schoolStats.length > 0 ? 'স্কুল লিডারবোর্ড' : 'স্কুল লিডারবোর্ড'})</span>
                      </h4>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-gray-50/70 text-gray-500 font-bold border-b border-gray-100 uppercase">
                          <th className="py-3 px-3 rounded-l-lg">Rank</th>
                          <th className="py-3 px-3">School Name</th>
                          <th className="py-3 px-3 text-center">Members</th>
                          <th className="py-3 px-3 text-center">Total Trees</th>
                          <th className="py-3 px-3 text-center">Surviving</th>
                          <th className="py-3 px-3 text-center rounded-r-lg">Survival %</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 font-semibold text-gray-700">
                        {schoolStats.map((item, idx) => (
                          <tr key={idx} className="hover:bg-emerald-50/10 transition-colors">
                            <td className="py-3 px-3">
                              <span className={`inline-flex items-center justify-center w-6 h-6 rounded-lg font-black text-[10px] ${
                                idx === 0 ? 'bg-amber-100 text-amber-800 border border-amber-200' : 
                                idx === 1 ? 'bg-slate-100 text-slate-800 border border-slate-200' : 
                                idx === 2 ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-gray-150 text-gray-600'
                              }`}>
                                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-bold text-gray-900 text-xs text-left max-w-[180px] truncate">{item.school}</td>
                            <td className="py-3 px-3 text-center text-gray-600">{item.participantsCount}</td>
                            <td className="py-3 px-3 text-center text-gray-600">{item.treesRegistered}</td>
                            <td className="py-3 px-3 text-center text-emerald-700 font-bold">{item.treesSurviving}</td>
                            <td className="py-3 px-3 text-center">
                              <span className="bg-emerald-50 text-emerald-800 py-1 px-2.5 rounded-full font-bold text-[10px] border border-emerald-100">
                                {item.rate}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Student / Volunteer Leaderboard */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-5">
                  <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 text-lg shadow-xs">
                      🌟
                    </div>
                    <div className="text-left">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-600">Top Individual Tree Protectors</span>
                      <h4 className="text-base font-black text-gray-900 leading-tight">
                        Student/Volunteer Board <span className="font-anek text-emerald-700 font-bold text-sm block sm:inline">({studentStats.length > 0 ? 'শিক্ষার্থী ও স্বেচ্ছাসেবী তালিকা' : 'স্বেচ্ছাসেবী তালিকা'})</span>
                      </h4>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-gray-50/70 text-gray-500 font-bold border-b border-gray-100 uppercase">
                          <th className="py-3 px-3 rounded-l-lg">Rank</th>
                          <th className="py-3 px-3">Name</th>
                          <th className="py-3 px-3">Institution</th>
                          <th className="py-3 px-3 text-center">Trees</th>
                          <th className="py-3 px-3 text-center">Surviving</th>
                          <th className="py-3 px-3 text-center rounded-r-lg">Survival %</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 font-semibold text-gray-700">
                        {studentStats.map((item, idx) => (
                          <tr key={idx} className="hover:bg-emerald-50/10 transition-colors">
                            <td className="py-3 px-3">
                              <span className={`inline-flex items-center justify-center w-6 h-6 rounded-lg font-black text-[10px] ${
                                idx === 0 ? 'bg-amber-100 text-amber-800 border border-amber-200' : 
                                idx === 1 ? 'bg-slate-100 text-slate-800 border border-slate-200' : 
                                idx === 2 ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-gray-150 text-gray-600'
                              }`}>
                                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-bold text-gray-950 text-xs text-left max-w-[120px] truncate">{item.name}</td>
                            <td className="py-3 px-3 text-gray-500 truncate max-w-[150px] text-left">{item.institution}</td>
                            <td className="py-3 px-3 text-center text-gray-600">{item.treesRegistered}</td>
                            <td className="py-3 px-3 text-center text-emerald-700 font-bold">{item.treesSurviving}</td>
                            <td className="py-3 px-3 text-center">
                              <span className="bg-emerald-50 text-emerald-800 py-1 px-2.5 rounded-full font-bold text-[10px] border border-emerald-100">
                                {item.rate}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 5: PARTICIPANT PORTAL */}
          {activeSubTab === 'portal' && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
              id="subtab-portal-view"
            >
              
              {/* Case 1: Participant NOT logged in */}
              {!loggedInUser ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 font-sans text-left">
                  
                  {/* Participant Login Form */}
                  <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-6">
                    <div className="border-b border-gray-100 pb-3 space-y-1">
                      <h4 className="text-xl font-black text-gray-900">
                        Login (লগইন)
                      </h4>
                      <p className="text-xs text-gray-400 font-semibold">
                        Enter your Participant ID and password to access your tree registry. (আপনার গাছ রেজিস্ট্রি এবং মনিটরিং ডাটা অ্যাক্সেস করতে আইডি এবং পাসওয়ার্ড দিয়ে লগইন করুন।)
                      </p>
                    </div>

                    {loginError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 text-xs py-3 px-4 rounded-xl font-semibold">
                        {loginError}
                      </div>
                    )}

                    <form onSubmit={handleLoginParticipant} className="space-y-4 font-sans text-xs">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-gray-500 uppercase tracking-wider">Participant ID (অংশগ্রহণকারী আইডি)</label>
                        <input 
                          type="text" 
                          placeholder="e.g. GE-AT-000001"
                          value={loginId}
                          onChange={(e) => setLoginId(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#1B5E20] focus:outline-none"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-gray-500 uppercase tracking-wider">Password (পাসওয়ার্ড)</label>
                        <input 
                          type="password" 
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#1B5E20] focus:outline-none"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#1B5E20] hover:bg-emerald-800 text-white font-black py-3.5 rounded-xl shadow-md cursor-pointer transition-colors text-center text-xs"
                      >
                        Login (লগইন করুন)
                      </button>
                    </form>
                  </div>

                  {/* Participant Registration Form */}
                  <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-6">
                    <div className="border-b border-gray-100 pb-3 space-y-1">
                      <h4 className="text-xl font-black text-gray-900">
                        Join Now (এখনই যোগ দিন)
                      </h4>
                      <p className="text-xs text-gray-400 font-semibold">
                        Become a Green Hero! Complete this form to plant and adapt your trees. (গ্রিন হিরো হয়ে উঠুন! ৫টি গাছ রোপণ ও নিবন্ধন করতে ফরমটি পূরণ করুন।)
                      </p>
                    </div>

                    {regError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 text-xs py-3 px-4 rounded-xl font-semibold">
                        {regError}
                      </div>
                    )}

                    <form onSubmit={handleRegisterParticipant} className="space-y-4 font-sans text-xs">
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="font-bold text-gray-500 uppercase tracking-wider">Full Name (পূর্ণ নাম)</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Sumaiya Akter"
                            value={regName}
                            onChange={(e) => setRegName(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#1B5E20]"
                            required
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="font-bold text-gray-500 uppercase tracking-wider">Institution Type (প্রতিষ্ঠানের ধরন)</label>
                          <select
                            value={regInstType}
                            onChange={(e) => setRegInstType(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#1B5E20]"
                          >
                            <option value="student">School Student (বিদ্যালয়ের শিক্ষার্থী)</option>
                            <option value="member">Community Member (কমিউনিটি সদস্য)</option>
                            <option value="volunteer">Local Volunteer (স্থানীয় স্বেচ্ছাসেবী)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="font-bold text-gray-500 uppercase tracking-wider">Institution Name (প্রতিষ্ঠানের নাম)</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Bogura Zilla School"
                            value={regInstName}
                            onChange={(e) => setRegInstName(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#1B5E20]"
                            required
                          />
                        </div>

                        {regInstType === 'student' && (
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-500 uppercase tracking-wider">Class/Grade (শ্রেণি)</label>
                            <select
                              value={regGrade}
                              onChange={(e) => setRegGrade(e.target.value)}
                              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#1B5E20]"
                            >
                              {Array.from({ length: 8 }, (_, i) => i + 5).map(grade => (
                                <option key={grade} value={`Class ${grade} (শ্রেণি ${grade})`}>
                                  Class {grade} (শ্রেণি {grade})
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-gray-500 uppercase tracking-wider">Mobile Number (মোবাইল নম্বর)</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 01712345678"
                          value={regMobile}
                          onChange={(e) => setRegMobile(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#1B5E20]"
                          required
                        />
                      </div>

                      {/* Locked Location Fields */}
                      <div className="space-y-3 p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            id="other-dist-check" 
                            checked={isOtherDistrict} 
                            onChange={(e) => setIsOtherDistrict(e.target.checked)}
                            className="rounded text-[#1B5E20] focus:ring-[#1B5E20] w-4 h-4"
                          />
                          <label htmlFor="other-dist-check" className="font-bold text-emerald-900 cursor-pointer">
                            I am participating from another district (আমি অন্য জেলা থেকে অংশগ্রহণ করছি)
                          </label>
                        </div>

                        {!isOtherDistrict ? (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                              <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">District (জেলা)</span>
                              <span className="bg-gray-100 border border-gray-200 text-gray-500 py-2 px-3 rounded-xl font-bold">
                                Bogura (বগুড়া)
                              </span>
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">Upazila (উপজেলা)</span>
                              <span className="bg-gray-100 border border-gray-200 text-gray-500 py-2 px-3 rounded-xl font-bold">
                                Adamdighi (আদমদীঘি)
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                              <label className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Enter District (জেলা লিখুন)</label>
                              <input 
                                type="text" 
                                placeholder="e.g. Dhaka"
                                value={customDistrict}
                                onChange={(e) => setCustomDistrict(e.target.value)}
                                className="bg-white border border-gray-200 text-gray-800 py-2 px-3 rounded-xl focus:ring-2 focus:ring-[#1B5E20]"
                                required
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Enter Upazila (উপজেলা লিখুন)</label>
                              <input 
                                type="text" 
                                placeholder="e.g. Mirpur"
                                value={customUpazila}
                                onChange={(e) => setCustomUpazila(e.target.value)}
                                className="bg-white border border-gray-200 text-gray-800 py-2 px-3 rounded-xl focus:ring-2 focus:ring-[#1B5E20]"
                                required
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Password setup */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="font-bold text-gray-500 uppercase tracking-wider">Password (পাসওয়ার্ড)</label>
                          <input 
                            type="password" 
                            placeholder="••••••••"
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#1B5E20]"
                            required
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="font-bold text-gray-500 uppercase tracking-wider">Confirm Password (পাসওয়ার্ড নিশ্চিত করুন)</label>
                          <input 
                            type="password" 
                            placeholder="••••••••"
                            value={regConfirmPassword}
                            onChange={(e) => setRegConfirmPassword(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#1B5E20]"
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-emerald-700 hover:bg-[#1B5E20] text-white font-black py-3.5 rounded-xl shadow-md cursor-pointer transition-colors text-center text-xs"
                      >
                        Register (নিবন্ধন করুন)
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                
                // Case 2: Participant IS LOGGED IN (Dashboard / Portal view!)
                <div className="space-y-12 text-left font-sans">
                  
                  {/* Participant Dashboard Top Panel */}
                  <div className="bg-[#1B5E20] text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-lg border border-[#4CAF50]/20">
                    <div className="space-y-2 text-center md:text-left">
                      <span className="text-xs font-mono font-bold tracking-widest text-[#4CAF50] uppercase block">
                        Official Participant Dashboard (অফিসিয়াল অংশগ্রহণকারী ড্যাশবোর্ড)
                      </span>
                      <h4 className="text-2xl font-black font-sans leading-tight">
                        Welcome, {loggedInUser.name}!
                      </h4>
                      <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-semibold text-emerald-100">
                        <span className="flex items-center gap-1.5 bg-black/20 py-1 px-2.5 rounded-full">
                          <User size={12} /> ID: {loggedInUser.id}
                        </span>
                        <span className="flex items-center gap-1.5 bg-black/20 py-1 px-2.5 rounded-full">
                          <MapPin size={12} /> {loggedInUser.upazila}, {loggedInUser.district}
                        </span>
                        {loggedInUser.institution && (
                          <span className="flex items-center gap-1.5 bg-black/20 py-1 px-2.5 rounded-full">
                            <Users size={12} /> {loggedInUser.institution}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3 shrink-0">
                      {isEligibleForCertificate && (
                        <button
                          onClick={() => setShowCertificatePreview(true)}
                          className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-5 rounded-full text-xs shadow cursor-pointer transition-colors flex items-center gap-1.5"
                        >
                          <Award size={14} />
                          <span>Get Certificate (সার্টিফিকেট অর্জন করুন)</span>
                        </button>
                      )}
                      
                      <button
                        onClick={handleLogoutParticipant}
                        className="bg-black/30 hover:bg-red-700/80 text-white font-bold py-2.5 px-5 rounded-full text-xs cursor-pointer transition-colors flex items-center gap-1.5"
                      >
                        <LogOut size={14} />
                        <span>Log Out (লগ আউট)</span>
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Certificate Preview Modal */}
                  <AnimatePresence>
                    {showCertificatePreview && loggedInUser && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4"
                        id="bilingual-certificate-modal"
                      >
                        <motion.div 
                          initial={{ scale: 0.95 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0.95 }}
                          className="bg-white max-w-4xl w-full rounded-3xl p-8 border-8 border-[#1B5E20] shadow-2xl relative space-y-6 overflow-hidden max-h-[90vh] overflow-y-auto"
                        >
                          {/* Close */}
                          <button
                            onClick={() => setShowCertificatePreview(false)}
                            className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500"
                          >
                            <X size={18} />
                          </button>

                          {/* Certificate Boundary */}
                          <div className="border-4 border-double border-[#4CAF50] p-8 space-y-6 text-center relative" id="printable-certificate-container">
                            <div className="absolute top-2 left-2 text-[10px] font-mono text-gray-300 font-bold">GREEN EARTH CERTIFICATION</div>
                            
                            {/* Logo */}
                            <div className="w-16 h-16 bg-[#1B5E20]/10 text-[#1B5E20] rounded-full flex items-center justify-center mx-auto mb-2 border border-[#4CAF50]/30 shadow-xs">
                              <Award size={36} />
                            </div>

                            <span className="text-xs font-mono font-bold tracking-widest text-[#1B5E20] uppercase block">
                              Certificate of Green Hero Award (গ্রিন হিরো স্বীকৃতি সনদপত্র)
                            </span>

                            <div className="h-0.5 bg-emerald-600/20 w-32 mx-auto rounded-full" />

                            <p className="text-xs text-gray-500 italic">
                              This official certificate is proudly presented to (এই সনদপত্রটি অত্যন্ত গর্বের সাথে প্রদান করা হলো)
                            </p>

                            <h3 className="text-2xl md:text-3xl font-black text-[#1B5E20] font-sans">
                              {loggedInUser.name}
                            </h3>

                            <p className="text-xs text-gray-600 font-semibold max-w-xl mx-auto leading-relaxed">
                              For their outstanding performance, civic responsibility, and active climate action in our community. Under the <strong>Green Hero Initiative (গ্রিন হিরো ইনিশিয়েটিভ)</strong>, they successfully planted, adapted, and diligently nurtured a diverse forest canopy.
                            </p>

                            <p className="text-xs text-gray-600 font-semibold max-w-xl mx-auto leading-relaxed mt-2 border-t border-gray-100 pt-3">
                              (আমাদের কমিউনিটিতে অসাধারণ ভূমিকা, নাগরিক দায়িত্ব পালন এবং সক্রিয় জলবায়ু সুরক্ষার জন্য। গ্রিন হিরো ইনিশিয়েটিভের আওতায় তিনি সফলভাবে বেশ কিছু পরিবেশ বান্ধব গাছ রোপণ করেছেন এবং ৩ মাস ধরে সফলভাবে তার সঠিক বৃদ্ধি নিশ্চিত করেছেন।)
                            </p>

                            {/* Verification Data Fields */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 text-left text-[11px] bg-gray-50 p-4 rounded-xl border border-gray-200/50 max-w-2xl mx-auto font-mono">
                              <div>
                                <span className="block text-gray-400 uppercase font-bold text-[9px]">Participant ID (আইডি):</span>
                                <span className="font-bold text-gray-900">{loggedInUser.id}</span>
                              </div>
                              <div>
                                <span className="block text-gray-400 uppercase font-bold text-[9px]">School Name (স্কুলের নাম):</span>
                                <span className="font-bold text-gray-900 truncate block" title={loggedInUser.institution}>{loggedInUser.institution || 'Volunteer'}</span>
                              </div>
                              <div>
                                <span className="block text-gray-400 uppercase font-bold text-[9px]">Surviving Trees (টিকে থাকা গাছ):</span>
                                <span className="font-bold text-emerald-700">
                                  {trees.filter(t => t.participantId === loggedInUser.id).reduce((sum, t) => sum + t.quantity, 0)} Nos (টি)
                                </span>
                              </div>
                              <div>
                                <span className="block text-gray-400 uppercase font-bold text-[9px]">Issue Date (ইস্যু তারিখ):</span>
                                <span className="font-bold text-gray-900">2026-07-17</span>
                              </div>
                            </div>

                            {/* Signatures */}
                            <div className="flex justify-between items-center pt-8 max-w-xl mx-auto text-xs font-bold text-gray-600">
                              <div className="text-center">
                                <div className="border-t border-gray-300 pt-1.5 w-32 text-center mx-auto">
                                  Dr. Anisur Rahman
                                  <span className="block text-[9px] text-gray-400 font-medium">Founder, Green Earth</span>
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="border-t border-gray-300 pt-1.5 w-32 text-center mx-auto">
                                  Green Earth Seal
                                  <span className="block text-[10px] text-emerald-600">● VERIFIED ●</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-center gap-3 pt-2">
                            <button
                              onClick={() => window.print()}
                              className="bg-emerald-700 hover:bg-[#1B5E20] text-white font-bold py-2.5 px-6 rounded-full text-xs shadow transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <Download size={14} />
                              <span>Print / Download PDF (প্রিন্ট / ডাউনলোড পিডিএফ)</span>
                            </button>
                            <button
                              onClick={() => setShowCertificatePreview(false)}
                              className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-2.5 px-5 rounded-full text-xs transition-colors"
                            >
                              Close (বন্ধ করুন)
                            </button>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* LEFT PANEL: TREE REGISTRATION FORM (DYNAMIC REPEATER) */}
                    <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                      
                      {/* Warning Card at top */}
                      <div className="bg-amber-50 border-l-4 border-amber-500 rounded-2xl p-4 flex gap-3 text-amber-800">
                        <AlertTriangle size={20} className="shrink-0 text-amber-600" />
                        <div className="text-xs font-semibold leading-relaxed">
                          You must register a minimum of 5 trees to complete the registration (নিবন্ধন সম্পন্ন করতে আপনাকে নূযনতম ৫টি গাছ নিবন্ধন করতে হবে)।
                        </div>
                      </div>

                      <div className="border-b border-gray-100 pb-3">
                        <h4 className="text-lg font-black text-gray-900">
                          Tree Registration (গাছ নিবন্ধন)
                        </h4>
                        <p className="text-xs text-gray-400 font-semibold mt-0.5">
                          Add the tree species you are planting. (আপনার রোপণ করা গাছগুলো এখানে যোগ করুন।)
                        </p>
                      </div>

                      {treeRegError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-xs py-3 px-4 rounded-xl font-semibold">
                          {treeRegError}
                        </div>
                      )}
                      {treeRegSuccess && (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs py-3 px-4 rounded-xl font-semibold">
                          {treeRegSuccess}
                        </div>
                      )}

                      <form onSubmit={handleRegisterTrees} className="space-y-6 text-xs">
                        
                        {/* Dynamic Row Repeater */}
                        <div className="space-y-4">
                          {treeRows.map((row, idx) => (
                            <div key={row.id} className="p-4 bg-gray-50 border border-gray-200/60 rounded-2xl relative space-y-3">
                              {treeRows.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTreeRow(row.id)}
                                  className="absolute top-3 right-3 text-red-500 hover:text-red-700 cursor-pointer"
                                  title="Remove Tree Row (মুছে ফেলুন)"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Tree Name autocomplete */}
                                <div className="flex flex-col gap-1.5 relative">
                                  <label className="font-bold text-gray-500 uppercase tracking-wider">Tree Name (গাছের নাম)</label>
                                  <input 
                                    type="text" 
                                    placeholder="e.g. Mango / আম"
                                    value={row.name}
                                    onChange={(e) => handleTreeRowChange(row.id, 'name', e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1B5E20]"
                                    required
                                  />
                                  {/* Autocomplete Popup */}
                                  {row.suggestions && row.suggestions.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl mt-1 shadow-lg z-20 font-sans divide-y divide-gray-50 overflow-hidden">
                                      {row.suggestions.map((s: any, sIdx: number) => (
                                        <button
                                          key={sIdx}
                                          type="button"
                                          onClick={() => {
                                            handleTreeRowChange(row.id, 'name', `${s.en} (${s.bn})`);
                                            // Clear suggestions
                                            setTreeRows(treeRows.map(r => r.id === row.id ? { ...r, suggestions: [] } : r));
                                          }}
                                          className="w-full text-left py-2 px-3 hover:bg-emerald-50 hover:text-[#1B5E20] text-xs font-semibold cursor-pointer transition-colors"
                                        >
                                          {s.en} ({s.bn})
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* Tree Quantity dropdown */}
                                <div className="flex flex-col gap-1.5">
                                  <label className="font-bold text-gray-500 uppercase tracking-wider">Tree Quantity (গাছের পরিমাণ)</label>
                                  <select
                                    value={row.quantity}
                                    onChange={(e) => handleTreeRowChange(row.id, 'quantity', Number(e.target.value))}
                                    className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1B5E20]"
                                  >
                                    {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                                      <option key={num} value={num}>{num}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Tree Type dropdown */}
                                <div className="flex flex-col gap-1.5">
                                  <label className="font-bold text-gray-500 uppercase tracking-wider">Tree Type (গাছের ধরন)</label>
                                  <select
                                    value={row.type}
                                    onChange={(e) => handleTreeRowChange(row.id, 'type', e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1B5E20]"
                                  >
                                    <option value="Fruit Tree (ফলজ বৃক্ষ)">Fruit Tree (ফলজ বৃক্ষ)</option>
                                    <option value="Forest Tree (বনজ বৃক্ষ)">Forest Tree (বনজ বৃক্ষ)</option>
                                    <option value="Medicinal Tree (ঔষধি বৃক্ষ)">Medicinal Tree (ঔষধি বৃক্ষ)</option>
                                    <option value="Indoor Plant (ইনডোর প্ল্যান্ট)">Indoor Plant (ইনডোর প্ল্যান্ট)</option>
                                  </select>
                                </div>

                                {/* Row-level Tree Photo Upload */}
                                <div className="flex flex-col gap-1.5">
                                  <label className="font-bold text-gray-500 uppercase tracking-wider">Tree Photo (গাছের ছবি আপলোড) - Optional</label>
                                  <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-2 relative hover:bg-emerald-50/10 transition-colors">
                                    {row.photo ? (
                                      <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-100 shrink-0">
                                        <img src={row.photo} alt="Row Sapling" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                                        <button
                                          type="button"
                                          onClick={() => handleTreeRowChange(row.id, 'photo', '')}
                                          className="absolute inset-0 bg-black/60 text-white font-bold text-[9px] flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                                        >
                                          ✕ Remove
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-lg flex items-center justify-center border border-dashed border-gray-200 shrink-0">
                                        <Camera size={18} />
                                      </div>
                                    )}
                                    <div className="flex-1 text-left relative overflow-hidden">
                                      <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">UPLOAD ROW PHOTO</span>
                                      <span className="text-[11px] text-[#1B5E20] font-black truncate block font-sans">
                                        {row.photo ? 'Image Selected' : 'Choose Photo (ছবি আপলোড)'}
                                      </span>
                                      <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                              handleTreeRowChange(row.id, 'photo', reader.result as string);
                                            };
                                            reader.readAsDataURL(file);
                                          }
                                        }}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Button to Add Row */}
                        <button
                          type="button"
                          onClick={handleAddTreeRow}
                          className="w-full border-2 border-dashed border-emerald-300/60 hover:border-emerald-500 hover:bg-emerald-50/20 text-[#1B5E20] font-bold py-3 rounded-2xl cursor-pointer transition-all flex items-center justify-center gap-1.5"
                        >
                          <Plus size={14} />
                          <span>Add Another Tree ((+) আরও একটি গাছ যোগ করুন)</span>
                        </button>

                        {/* Common Fields */}
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                              <label className="font-bold text-gray-500 uppercase tracking-wider">Planting Date (রোপণের তারিখ)</label>
                              <input 
                                type="date" 
                                value={plantingDate}
                                onChange={(e) => setPlantingDate(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1B5E20]"
                                required
                              />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="font-bold text-gray-500 uppercase tracking-wider">Tree Photo Upload (গাছের ছবি আপলোড)</label>
                              <div className="flex flex-col items-center justify-center border-2 border-dashed border-emerald-300 rounded-2xl p-4 bg-white hover:bg-emerald-50/20 transition-all relative">
                                <Camera size={24} className="text-[#1B5E20] mb-1.5" />
                                <span className="text-xs text-gray-500 font-medium">Click to select or drag photo here</span>
                                <span className="text-[10px] text-gray-400 mt-0.5">(JPG, PNG max 5MB)</span>
                                <input 
                                  type="file" 
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(e, setTreePhoto)}
                                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                  id="tree-photo-file-input"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-500 uppercase tracking-wider">Address/Location of Planted Trees (গাছ রোপণের ঠিকানা/অবস্থান)</label>
                            <textarea
                              rows={3}
                              placeholder="e.g. Village: Santahar, School: Bogura Zilla School yard"
                              value={plantingAddress}
                              onChange={(e) => setPlantingAddress(e.target.value)}
                              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1B5E20]"
                              required
                            />
                          </div>

                          {treePhoto && (
                            <div className="space-y-1">
                              <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px] block">Photo Preview (গাছের ছবি প্রাকদর্শন)</span>
                              <div className="w-full h-36 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
                                <img src={treePhoto} alt="Preview" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                              </div>
                            </div>
                          )}
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-[#1B5E20] hover:bg-emerald-800 text-white font-black py-3.5 rounded-xl shadow cursor-pointer transition-colors text-center text-xs"
                        >
                          Save & Register Trees (সংরক্ষণ ও গাছ নিবন্ধন করুন)
                        </button>
                      </form>
                    </div>

                    {/* RIGHT PANEL: THREE-MONTH MONITORING INTERFACE */}
                    <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                      <div className="border-b border-gray-100 pb-3">
                        <h4 className="text-lg font-black text-gray-900">
                          Monthly Monitoring Portal (মাসিক মনিটরিং পোর্টাল)
                        </h4>
                        <p className="text-xs text-gray-400 font-semibold mt-0.5">
                          Upload monthly logs of your trees to get certified. (সনদপত্র পেতে প্রতি মাসে আপনার গাছেদের প্রগতির তথ্য ও ছবি জমা দিন।)
                        </p>
                      </div>

                      {/* Month subtabs */}
                      <div className="grid grid-cols-3 gap-2 bg-gray-100 p-1.5 rounded-2xl font-sans">
                        {[1, 2, 3].map(m => {
                          const status = getMonthLogStatus(loggedInUser.id, m);
                          return (
                            <button
                              key={m}
                              type="button"
                              onClick={() => {
                                if (status !== 'Locked') setActiveMonthTab(m);
                              }}
                              className={`py-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                                activeMonthTab === m
                                  ? 'bg-[#1B5E20] text-white shadow'
                                  : status === 'Locked'
                                    ? 'opacity-40 cursor-not-allowed text-gray-400'
                                    : 'text-gray-600 hover:bg-gray-200/50'
                              }`}
                              disabled={status === 'Locked'}
                            >
                              <span>Month {m} ({m}ম মাস)</span>
                              <span className="text-[9px] font-bold uppercase tracking-wider">
                                {status === 'Locked' ? 'Locked (তালাবদ্ধ)' : 
                                 status === 'Due' ? 'Due (সময় হয়েছে)' : 
                                 status === 'Pending' ? 'Pending (পর্যালোচনায়)' : 
                                 status === 'Approved' ? 'Approved (অনুমোদিত)' : 'Rejected (বাতিল)'}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* active month review details & logger */}
                      <div className="p-5 bg-gray-50 border border-gray-200/50 rounded-2xl text-xs space-y-6">
                        <div className="flex items-center gap-2 text-[#1B5E20] font-black border-b border-gray-200 pb-2.5">
                          <Activity size={16} />
                          <span>
                            Month {activeMonthTab} Monitoring Container (মাস {activeMonthTab} ট্র্যাকিং কন্টেইনার)
                          </span>
                        </div>

                        {logError && (
                          <div className="bg-red-50 border border-red-200 text-red-700 text-[11px] py-2 px-3 rounded-xl font-semibold">
                            {logError}
                          </div>
                        )}
                        {logSuccess && (
                          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] py-2 px-3 rounded-xl font-semibold">
                            {logSuccess}
                          </div>
                        )}

                        {/* Logger Form */}
                        <form onSubmit={handleSubmitMonthlyLog} className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                              <label className="font-bold text-gray-500 uppercase tracking-wider">
                                Upload Progress Photo (অগ্রগতির ছবি আপলোড)
                              </label>
                              <div className="flex flex-col items-center justify-center border-2 border-dashed border-emerald-300 rounded-2xl p-4 bg-white hover:bg-emerald-50/20 transition-all relative">
                                <Camera size={24} className="text-[#1B5E20] mb-1.5" />
                                <span className="text-xs text-gray-500 font-medium">Click to select or drag photo here</span>
                                <span className="text-[10px] text-gray-400 mt-0.5">(JPG, PNG max 5MB)</span>
                                <input 
                                  type="file" 
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(e, setLogPhoto)}
                                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                  id="log-photo-file-input"
                                />
                              </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="font-bold text-gray-500 uppercase tracking-wider">
                                Current Health Status (গাছের বর্তমান অবস্থা)
                              </label>
                              <select
                                value={logHealth}
                                onChange={(e) => setLogHealth(e.target.value)}
                                className="bg-white border border-gray-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1B5E20]"
                              >
                                <option value="Growing Well / Alive (বেঁচে আছে ও বেড়ে উঠছে)">Growing Well / Alive (বেঁচে আছে ও বেড়ে উঠছে)</option>
                                <option value="Damaged (ক্ষতিগ্রস্ত)">Damaged (ক্ষতিগ্রস্ত)</option>
                                <option value="Dead (নষ্ট হয়ে গেছে)">Dead (নষ্ট হয়ে গেছে)</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-500 uppercase tracking-wider">
                              Comments/Observations (মন্তব্য/পর্যবেক্ষণ) - Optional
                            </label>
                            <textarea
                              rows={2}
                              placeholder="e.g. Tree height increased by 5 cm, daily watering is on."
                              value={logComments}
                              onChange={(e) => setLogComments(e.target.value)}
                              className="bg-white border border-gray-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1B5E20]"
                            />
                          </div>

                          {logPhoto && (
                            <div className="space-y-1">
                              <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px] block">Progress Photo Preview (অগ্রগতির ছবি প্রাকদর্শন)</span>
                              <div className="w-full h-32 bg-white rounded-xl overflow-hidden border border-gray-200">
                                <img src={logPhoto} alt="Progress Preview" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                              </div>
                            </div>
                          )}

                          <button
                            type="submit"
                            className="w-full bg-[#1B5E20] hover:bg-emerald-800 text-white font-black py-3 rounded-xl cursor-pointer transition-colors text-center text-xs shadow-sm"
                          >
                            Submit Log (লগ জমা দিন)
                          </button>
                        </form>
                      </div>

                      {/* Display historic logs for this user */}
                      <div className="space-y-3 font-sans text-xs">
                        <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px] block">Log History (লগের ইতিহাস)</span>
                        {logs.filter(l => l.participantId === loggedInUser.id).length === 0 ? (
                          <div className="text-gray-400 font-bold text-center py-4 bg-gray-50 rounded-2xl border border-gray-100">
                            No logs submitted yet. (কোনো লগ এখনও সাবমিট করা হয়নি।)
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {logs.filter(l => l.participantId === loggedInUser.id).map((log, idx) => (
                              <div key={idx} className="flex gap-4 items-center p-3 bg-gray-50 border border-gray-200/50 rounded-xl">
                                <img src={log.photo} alt="log" referrerPolicy="no-referrer" className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                                <div className="flex-grow text-left">
                                  <h5 className="font-bold text-gray-900">Month {log.month} ({log.month}ম মাস)</h5>
                                  <p className="text-[10px] text-gray-400 font-medium">Status: {log.health} • Submitted on {log.date}</p>
                                  {log.remarks && (
                                    <p className="text-[10px] text-[#1B5E20] font-semibold mt-0.5">Admin Remarks: {log.remarks}</p>
                                  )}
                                </div>
                                <span className={`py-1 px-2.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                                  log.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                                  log.status === 'Pending' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {log.status === 'Approved' ? 'Approved (অনুমোদিত)' : 
                                   log.status === 'Pending' ? 'Pending (পর্যালোচনায়)' : 'Rejected (বাতিল)'}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Participant Registered Tree Registry Inventory (গাছ রেজিস্ট্রি তালিকা) */}
                  <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-left mt-8">
                    <div className="border-b border-gray-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-lg md:text-xl font-black text-gray-900 font-sans flex items-center gap-2">
                          <Leaf className="text-[#1B5E20] shrink-0" size={20} />
                          <span>My Registered Tree Registry Inventory <span className="font-anek text-emerald-700 font-bold text-sm block sm:inline">(আমার গাছ রেজিস্ট্রি তালিকা)</span></span>
                        </h4>
                        <p className="text-xs md:text-sm text-gray-500 font-semibold mt-0.5 font-anek leading-relaxed">
                          View, edit, or update details of your registered trees here. (আপনার নিবন্ধিত গাছের তথ্য ও ছবি এখান থেকে এডিট ও আপডেট করতে পারবেন।)
                        </p>
                      </div>
                      <span className="bg-emerald-50 text-emerald-800 text-xs font-bold py-1.5 px-3 rounded-full border border-emerald-100 font-mono self-start sm:self-center">
                        Total: {trees.filter(t => t.participantId === loggedInUser.id).reduce((sum, t) => sum + t.quantity, 0)} Trees (টি গাছ)
                      </span>
                    </div>

                    {trees.filter(t => t.participantId === loggedInUser.id).length === 0 ? (
                      <div className="text-gray-400 font-bold text-center py-10 bg-gray-50 rounded-2xl border border-gray-150 font-anek text-sm">
                        No trees registered yet. (এখনও কোনো গাছ নিবন্ধন করা হয়নি।)
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-gray-50/70 text-gray-500 font-bold border-b border-gray-100 uppercase">
                              <th className="py-3 px-4 font-bold text-xs">Photo (ছবি)</th>
                              <th className="py-3 px-4 font-bold text-xs">Tree Name (গাছের নাম)</th>
                              <th className="py-3 px-4 font-bold text-xs">Tree Type (গাছের ধরন)</th>
                              <th className="py-3 px-4 font-bold text-center text-xs">Quantity (পরিমাণ)</th>
                              <th className="py-3 px-4 font-bold text-xs">Planting Date (তারিখ)</th>
                              <th className="py-3 px-4 font-bold text-xs">Location (অবস্থান)</th>
                              <th className="py-3 px-4 font-bold text-center text-xs">Actions (অ্যাকশন)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 font-semibold text-gray-700 text-sm">
                            {trees.filter(t => t.participantId === loggedInUser.id).map((t, idx) => (
                              <tr key={t.id || idx} className="hover:bg-emerald-50/10 transition-colors">
                                <td className="py-3 px-4">
                                  <img 
                                    src={t.photo} 
                                    alt="Sapling" 
                                    referrerPolicy="no-referrer"
                                    className="w-12 h-12 rounded-xl object-cover border border-gray-200" 
                                  />
                                </td>
                                <td className="py-3 px-4 font-black text-gray-950 font-anek text-sm">{t.treeName}</td>
                                <td className="py-3 px-4 text-gray-500 text-xs font-anek">{t.treeType}</td>
                                <td className="py-3 px-4 text-center font-black text-[#1B5E20] font-mono text-sm">{t.quantity}</td>
                                <td className="py-3 px-4 text-gray-500 text-xs font-mono">{t.plantingDate}</td>
                                <td className="py-3 px-4 text-gray-600 font-medium text-xs max-w-[150px] truncate font-anek" title={t.location}>{t.location}</td>
                                <td className="py-3 px-4 text-center">
                                  <button
                                    onClick={() => setEditTreeParticipant(t)}
                                    className="bg-emerald-50 hover:bg-[#1B5E20] hover:text-white text-[#1B5E20] font-black py-1.5 px-3.5 rounded-xl text-xs transition-all cursor-pointer inline-flex items-center gap-1 font-anek shadow-sm"
                                  >
                                    ✏️ Edit (সম্পাদনা)
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Participant Tree Edit Popup Modal */}
                  <AnimatePresence>
                    {editTreeParticipant && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 font-sans text-xs"
                        id="edit-tree-participant-modal"
                      >
                        <motion.div 
                          initial={{ scale: 0.95 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0.95 }}
                          className="bg-white max-w-lg w-full rounded-3xl p-6 border-4 border-[#1B5E20] shadow-2xl relative text-left space-y-4"
                        >
                          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                            <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                              <Leaf size={18} className="text-[#1B5E20]" />
                              <span>Edit Tree Details (গাছের তথ্য সংশোধন)</span>
                            </h3>
                            <button 
                              onClick={() => setEditTreeParticipant(null)}
                              className="text-gray-400 hover:text-gray-600 font-bold"
                            >
                              ✕
                            </button>
                          </div>

                          <form onSubmit={handleUpdateTreeParticipant} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="flex flex-col gap-1.5">
                                <label className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Tree Name (গাছের নাম)</label>
                                <input 
                                  type="text" 
                                  required
                                  value={editTreeParticipant.treeName || ''}
                                  onChange={(e) => setEditTreeParticipant({ ...editTreeParticipant, treeName: e.target.value })}
                                  className="bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1B5E20] font-anek font-semibold text-xs"
                                />
                              </div>

                              <div className="flex flex-col gap-1.5">
                                <label className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Quantity (পরিমাণ)</label>
                                <select
                                  value={editTreeParticipant.quantity || 1}
                                  onChange={(e) => setEditTreeParticipant({ ...editTreeParticipant, quantity: Number(e.target.value) })}
                                  className="bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1B5E20] font-mono font-bold text-xs"
                                >
                                  {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                                    <option key={num} value={num}>{num}</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="flex flex-col gap-1.5">
                                <label className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Tree Type (গাছের ধরন)</label>
                                <select
                                  value={editTreeParticipant.treeType || 'Fruit Tree (ফলজ বৃক্ষ)'}
                                  onChange={(e) => setEditTreeParticipant({ ...editTreeParticipant, treeType: e.target.value })}
                                  className="bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1B5E20] font-semibold text-xs"
                                >
                                  <option value="Fruit Tree (ফলজ বৃক্ষ)">Fruit Tree (ফলজ বৃক্ষ)</option>
                                  <option value="Forest Tree (বনজ বৃক্ষ)">Forest Tree (বনজ বৃক্ষ)</option>
                                  <option value="Medicinal Tree (ঔষধি বৃক্ষ)">Medicinal Tree (ঔষধি বৃক্ষ)</option>
                                  <option value="Indoor Plant (ইনডোর প্ল্যান্ট)">Indoor Plant (ইনডোর প্ল্যান্ট)</option>
                                </select>
                              </div>

                              <div className="flex flex-col gap-1.5">
                                <label className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Planting Date (তারিখ)</label>
                                <input 
                                  type="date" 
                                  required
                                  value={editTreeParticipant.plantingDate || ''}
                                  onChange={(e) => setEditTreeParticipant({ ...editTreeParticipant, plantingDate: e.target.value })}
                                  className="bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1B5E20] font-mono font-bold text-xs"
                                />
                              </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Location/Address (অবস্থান/ঠিকানা)</label>
                              <textarea
                                required
                                rows={2}
                                value={editTreeParticipant.location || ''}
                                onChange={(e) => setEditTreeParticipant({ ...editTreeParticipant, location: e.target.value })}
                                className="bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1B5E20] font-anek text-xs"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="flex flex-col gap-1.5">
                                <label className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Update Tree Photo (ছবি আপলোড)</label>
                                <input 
                                  type="file" 
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        setEditTreeParticipant({ ...editTreeParticipant, photo: reader.result as string });
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                  className="bg-gray-50 border border-gray-200 rounded-xl py-1.5 px-3 focus:ring-2 focus:ring-[#1B5E20] text-[10px] font-bold"
                                />
                              </div>

                              {editTreeParticipant.photo && (
                                <div className="space-y-1">
                                  <span className="font-bold text-gray-400 uppercase tracking-wider text-[9px] block">Photo Preview (গাছের ছবি প্রাকদর্শন)</span>
                                  <div className="h-20 bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                                    <img src={editTreeParticipant.photo} alt="Preview" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="pt-4 flex gap-3">
                              <button
                                type="button"
                                onClick={() => setEditTreeParticipant(null)}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-bold cursor-pointer transition-colors text-center font-sans text-xs"
                              >
                                Cancel (বাতিল)
                              </button>
                              <button
                                type="submit"
                                className="flex-1 bg-[#1B5E20] hover:bg-emerald-800 text-white py-2.5 rounded-xl font-bold cursor-pointer transition-colors text-center font-sans text-xs shadow-md"
                              >
                                Save Changes (সংরক্ষণ করুন)
                              </button>
                            </div>
                          </form>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* SUCCESS MODAL FOR NEW REGISTRATIONS WITH RELEVANT PARTICIPANT ID */}
      <AnimatePresence>
        {showRegSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 font-sans"
            id="reg-success-details-popup"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white max-w-lg w-full rounded-3xl p-8 border-4 border-[#1B5E20] shadow-2xl relative text-center space-y-6"
            >
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-[#1B5E20] mx-auto border border-[#4CAF50]/30 shadow-xs">
                <CheckCircle size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-gray-900">
                  Registration Successful! (নিবন্ধন সফল হয়েছে!)
                </h3>
                <p className="text-xs text-gray-500 font-semibold">
                  Congratulations! You are officially registered in the Green Earth Tree monitoring system. (অভিনন্দন! আপনি সফলভাবে গ্রিন আর্থ ট্রি মনিটরিং সিস্টেমে নিবন্ধিত হয়েছেন।)
                </p>
              </div>

              {/* Box display with credentials */}
              <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 text-left space-y-2">
                <div className="flex justify-between border-b border-emerald-100 pb-2">
                  <span className="text-xs font-bold text-gray-500">Participant ID (অংশগ্রহণকারী আইডি):</span>
                  <span className="text-sm font-black text-[#1B5E20] font-mono">{showRegSuccess.id}</span>
                </div>
                <div className="flex justify-between border-b border-emerald-100 pb-2">
                  <span className="text-xs font-bold text-gray-500">Name (নাম):</span>
                  <span className="text-xs font-bold text-gray-800">{showRegSuccess.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs font-bold text-gray-500">Mobile (মোবাইল নম্বর):</span>
                  <span className="text-xs font-bold text-gray-800">{showRegSuccess.mobile}</span>
                </div>
              </div>

              <div className="text-[10px] text-amber-600 font-bold leading-relaxed bg-amber-50 p-3 rounded-xl border border-amber-100">
                ⚠️ CRITICAL: Please save your Participant ID! You will need it and your password to log in and register your trees. (গুরুত্বপূর্ণ: আপনার অংশগ্রহণকারী আইডিটি অবশ্যই সংরক্ষণ করুন! গাছেদের ছবি আপলোড এবং লগইন করতে এই আইডিটি প্রয়োজন হবে।)
              </div>

              <button
                onClick={() => {
                  setShowRegSuccess(null);
                  setActiveSubTab('portal');
                }}
                className="w-full bg-[#1B5E20] hover:bg-emerald-800 text-white font-black py-3 rounded-full text-xs shadow-lg transition-colors"
              >
                Proceed to Login (লগইন করতে এগিয়ে যান)
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
