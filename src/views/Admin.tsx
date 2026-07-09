import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, LayoutDashboard, Trees, BookOpen, Users, Heart, Image as ImageIcon, 
  Mail, Settings, Plus, Edit, Trash2, LogOut, Search, Check, X, Phone, MapPin, 
  Eye, FileText, Download, ShieldCheck, Globe
} from 'lucide-react';
import { Project, BlogPost, TeamMember, GalleryItem } from '../types';
import ImageUploadInput from '../components/ImageUploadInput';

interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  date: string;
}

interface Donation {
  id: string;
  name: string;
  email: string;
  amount: number;
  paymentMethod: string;
  status: string;
  transId: string;
  date: string;
}

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
}

interface OrgSettings {
  username?: string;
  orgName?: string;
  tagline?: string;
  taglineBn?: string;
  phone?: string;
  email?: string;
  address?: string;
  addressBn?: string;
  aboutText?: string;
  aboutTextBn?: string;
  heroImgUrl?: string;
  heroTagline?: string;
  heroTaglineBn?: string;
  heroTitle?: string;
  heroTitleBn?: string;
  heroBio?: string;
  heroBioBn?: string;
  statTreesTarget?: string;
  statVillagesTarget?: string;
  statVolunteersTarget?: string;
  statWaterTarget?: string;
  aboutStory1?: string;
  aboutStory1Bn?: string;
  aboutStory2?: string;
  aboutStory2Bn?: string;
  aboutMission?: string;
  aboutMissionBn?: string;
  aboutVision?: string;
  aboutVisionBn?: string;
  bkashNo?: string;
  nagadNo?: string;
}

type AdminTab = 'dashboard' | 'projects' | 'blogs' | 'volunteers' | 'donations' | 'team' | 'gallery' | 'subscribers' | 'contacts' | 'settings';

interface AdminProps {
  isBangla?: boolean;
  settings?: any;
  onSettingsSaved?: () => void;
}

export default function Admin({ isBangla = false, settings: parentSettings, onSettingsSaved }: AdminProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [signUpError, setSignUpError] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // Datasets loaded from server
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [subscribers, setSubscribers] = useState<string[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [settings, setSettings] = useState<OrgSettings | null>(null);

  // Search filter states
  const [searchTerm, setSearchTerm] = useState('');

  // Loading states
  const [loading, setLoading] = useState(false);

  // Form Modal States
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Individual Form Fields
  // 1. Projects Form Fields
  const [projTitle, setProjTitle] = useState('');
  const [projTitleBn, setProjTitleBn] = useState('');
  const [projCategory, setProjCategory] = useState<'plantation' | 'renewable' | 'water' | 'waste' | 'awareness'>('plantation');
  const [projLocation, setProjLocation] = useState('');
  const [projLocationBn, setProjLocationBn] = useState('');
  const [projStatus, setProjStatus] = useState<'ongoing' | 'completed'>('ongoing');
  const [projShortDesc, setProjShortDesc] = useState('');
  const [projShortDescBn, setProjShortDescBn] = useState('');
  const [projFullDesc, setProjFullDesc] = useState('');
  const [projFullDescBn, setProjFullDescBn] = useState('');
  const [projMetric, setProjMetric] = useState('');
  const [projMetricBn, setProjMetricBn] = useState('');
  const [projMetricLabel, setProjMetricLabel] = useState('');
  const [projMetricLabelBn, setProjMetricLabelBn] = useState('');
  const [projImage, setProjImage] = useState('');

  // 2. Blogs Form Fields
  const [blogTitle, setBlogTitle] = useState('');
  const [blogTitleBn, setBlogTitleBn] = useState('');
  const [blogCategory, setBlogCategory] = useState('');
  const [blogCategoryBn, setBlogCategoryBn] = useState('');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogExcerptBn, setBlogExcerptBn] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogContentBn, setBlogContentBn] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('');
  const [blogAuthorBn, setBlogAuthorBn] = useState('');
  const [blogImage, setBlogImage] = useState('');
  const [blogReadTime, setBlogReadTime] = useState('');
  const [blogReadTimeBn, setBlogReadTimeBn] = useState('');

  // 3. Team Form Fields
  const [teamName, setTeamName] = useState('');
  const [teamNameBn, setTeamNameBn] = useState('');
  const [teamRole, setTeamRole] = useState('');
  const [teamRoleBn, setTeamRoleBn] = useState('');
  const [teamBio, setTeamBio] = useState('');
  const [teamBioBn, setTeamBioBn] = useState('');
  const [teamImage, setTeamImage] = useState('');

  // 4. Gallery Form Fields
  const [galTitle, setGalTitle] = useState('');
  const [galTitleBn, setGalTitleBn] = useState('');
  const [galCategory, setGalCategory] = useState<'plantation' | 'renewable' | 'water' | 'waste' | 'campaign'>('plantation');
  const [galImage, setGalImage] = useState('');
  const [galDate, setGalDate] = useState('');

  // 5. Settings Form Fields
  const [setOrgName, setSetOrgName] = useState('');
  const [setTagline, setSetTagline] = useState('');
  const [setTaglineBn, setSetTaglineBn] = useState('');
  const [setPhone, setSetPhone] = useState('');
  const [setEmail, setSetEmail] = useState('');
  const [setAddress, setSetAddress] = useState('');
  const [setAddressBn, setSetAddressBn] = useState('');
  const [setNewPassword, setSetNewPassword] = useState('');

  // Additional dynamic page settings state variables
  const [setAboutText, setSetAboutText] = useState('');
  const [setAboutTextBn, setSetAboutTextBn] = useState('');
  const [setHeroImgUrl, setSetHeroImgUrl] = useState('');
  const [setHeroTagline, setSetHeroTagline] = useState('');
  const [setHeroTaglineBn, setSetHeroTaglineBn] = useState('');
  const [setHeroTitle, setSetHeroTitle] = useState('');
  const [setHeroTitleBn, setSetHeroTitleBn] = useState('');
  const [setHeroBio, setSetHeroBio] = useState('');
  const [setHeroBioBn, setSetHeroBioBn] = useState('');

  // Stat targets state variables
  const [setStatTreesTarget, setSetStatTreesTarget] = useState('');
  const [setStatVillagesTarget, setSetStatVillagesTarget] = useState('');
  const [setStatVolunteersTarget, setSetStatVolunteersTarget] = useState('');
  const [setStatWaterTarget, setSetStatWaterTarget] = useState('');

  // About story, mission, vision state variables
  const [setAboutStory1, setSetAboutStory1] = useState('');
  const [setAboutStory1Bn, setSetAboutStory1Bn] = useState('');
  const [setAboutStory2, setSetAboutStory2] = useState('');
  const [setAboutStory2Bn, setSetAboutStory2Bn] = useState('');
  const [setAboutMission, setSetAboutMission] = useState('');
  const [setAboutMissionBn, setSetAboutMissionBn] = useState('');
  const [setAboutVision, setSetAboutVision] = useState('');
  const [setAboutVisionBn, setSetAboutVisionBn] = useState('');

  // Payment details state variables
  const [setBkashNo, setSetBkashNo] = useState('');
  const [setNagadNo, setSetNagadNo] = useState('');

  // Auto check authentication
  useEffect(() => {
    const token = localStorage.getItem('green-earth-admin-token-2026');
    if (token) {
      setIsAuthenticated(true);
      fetchAllData();
    }
  }, []);

  // Fetch all datasets from Express server
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [
        resProj, resBlogs, resTeam, resGallery, 
        resVols, resDons, resSubs, resContacts, resSettings
      ] = await Promise.all([
        fetch('/api/projects').then((r) => r.json()),
        fetch('/api/blogs').then((r) => r.json()),
        fetch('/api/team').then((r) => r.json()),
        fetch('/api/gallery').then((r) => r.json()),
        fetch('/api/volunteers').then((r) => r.json()),
        fetch('/api/donations').then((r) => r.json()),
        fetch('/api/subscribers').then((r) => r.json()),
        fetch('/api/contacts').then((r) => r.json()),
        fetch('/api/settings').then((r) => r.json())
      ]);

      setProjects(resProj);
      setBlogs(resBlogs);
      setTeam(resTeam);
      setGallery(resGallery);
      setVolunteers(resVols);
      setDonations(resDons);
      setSubscribers(resSubs);
      setContacts(resContacts);
      setSettings(resSettings);

      // Seed settings inputs
      if (resSettings) {
        setSetOrgName(resSettings.orgName || 'Green Earth');
        setSetTagline(resSettings.tagline || 'Cleaner, Greener & Sustainable Future');
        setSetTaglineBn(resSettings.taglineBn || 'পরিচ্ছন্ন, সবুজ ও টেকসই ভবিষ্যৎ');
        setSetPhone(resSettings.phone || '+880 1712-345678');
        setSetEmail(resSettings.email || 'info@greenearth-bd.org');
        setSetAddress(resSettings.address || '42, Road 11, Banani, Dhaka-1213, Bangladesh.');
        setSetAddressBn(resSettings.addressBn || '৪২, রোড ১১, বনানী, ঢাকা-১২১৩, বাংলাদেশ।');
        setSetAboutText(resSettings.aboutText || 'Empowering communities across Bangladesh to restore coastal mangrove shield walls, light up remote rivers islands with clean solar power, and access safe drinking water.');
        setSetAboutTextBn(resSettings.aboutTextBn || 'আমরা বাংলাদেশের পরিবেশ সুরক্ষায় নিবেদিত একদল স্বেচ্ছাসেবী। উপকূলীয় ম্যানগ্রোভ বনায়ন, প্রত্যন্ত চরাঞ্চলে সৌরবিদ্যুৎ এবং বিশুদ্ধ খাবার পানির সংস্থানে আমরা কাজ করছি তৃণমূল পর্যায়ে।');
        setSetHeroImgUrl(resSettings.heroImgUrl || '/src/assets/images/hero_landscape_bangladesh_1783444495014.jpg');
        setSetHeroTagline(resSettings.heroTagline || 'For a sustainable tomorrow');
        setSetHeroTaglineBn(resSettings.heroTaglineBn || 'একটি সুন্দর ভবিষ্যৎ গড়তে');
        setSetHeroTitle(resSettings.heroTitle || 'Cleaner, Greener & Sustainable Future');
        setSetHeroTitleBn(resSettings.heroTitleBn || 'পরিচ্ছন্ন, সবুজ এবং টেকসই বাংলাদেশ');
        setSetHeroBio(resSettings.heroBio || 'Empowering communities across Bangladesh to restore coastal mangrove shield walls, light up remote rivers islands with clean solar power, and access safe drinking water.');
        setSetHeroBioBn(resSettings.heroBioBn || 'আমরা বাংলাদেশের পরিবেশ সুরক্ষায় নিবেদিত একদল স্বেচ্ছাসেবী। উপকূলীয় ম্যানগ্রোভ বনায়ন, প্রত্যন্ত চরাঞ্চলে সৌরবিদ্যুৎ এবং বিশুদ্ধ খাবার পানির সংস্থানে আমরা কাজ করছি তৃণমূল পর্যায়ে।');

        setSetStatTreesTarget(resSettings.statTreesTarget || '12450');
        setSetStatVillagesTarget(resSettings.statVillagesTarget || '68');
        setSetStatVolunteersTarget(resSettings.statVolunteersTarget || '850');
        setSetStatWaterTarget(resSettings.statWaterTarget || '35');

        setSetAboutStory1(resSettings.aboutStory1 || 'Bangladesh is on the immediate frontline of the global climate crisis. Rising sea levels, salinity in drinking water, and severe riverbanks erosion displacement are displacement risks that threaten millions of lives in this low-lying delta. Founded in early 2024 by a passionate group of university environmental scientists and student groups, Green Earth was born to create pragmatic, local ecological responses.');
        setSetAboutStory1Bn(resSettings.aboutStory1Bn || 'জলবায়ু পরিবর্তনের ঝুঁকিতে থাকা বাংলাদেশ বিশ্বের অন্যতম ঝুঁকিপূর্ণ অঞ্চলের একটি। বঙ্গোপসাগরের ঘূর্ণিঝড়, ক্রমাগত লবণাক্ত পানি প্রবেশ, আর উত্তরবঙ্গের নদীভাঙন ধ্বংস করছে মানুষের স্বপ্ন ও জীবন। ঠিক এই ক্রান্তিলগ্নে ২০২৪ সালে ঢাকা বিশ্ববিদ্যালয়ের একদল পরিবেশ বিজ্ঞানী ও ছাত্র স্বেচ্ছাসেবীদের হাত ধরে গ্রিন আর্থের বীজ রোপণ করা হয়।');
        setSetAboutStory2(resSettings.aboutStory2 || 'Our design philosophy is centered around bottom-up community action. We believe that true conservation happens when local villagers own and protect the projects. Over the past years, our projects have bridged scientific groundwater tests with grassroot plantation drives, setting a blueprint for localized delta conservation.');
        setSetAboutStory2Bn(resSettings.aboutStory2Bn || 'আমরা বিশ্বাস করি, ঠান্ডা কর্পোরেট অফিস বা সেমিনার কক্ষে পরিবেশ সুরক্ষা অসম্ভব। প্রকৃত পরিবেশবান্ধব বাংলাদেশ গড়তে আমাদের মাঠ পর্যায়ে মানুষের সাথে কাজ করতে হবে। তাই আমরা সুন্দরবন ও উত্তরের নদী চরাঞ্চলে সরাসরি মানুষের কাছে পৌঁছাই এবং তাদের সহায়তায় প্রকল্পসমূহ সচল রাখি।');
        setSetAboutMission(resSettings.aboutMission || 'To restore coastal eco-barriers, deliver clean solar energy grids, and guarantee safe, arsenic-free drinking water through community ownership.');
        setSetAboutMissionBn(resSettings.aboutMissionBn || 'স্থানীয় অংশীদারিত্বের মাধ্যমে বৃক্ষরোপণ, নবায়নযোগ্য জ্বালানির ব্যবহার এবং আর্সেনিকমুক্ত নিরাপদ পানির টেকসই সংস্থান নিশ্চিত করা।');
        setSetAboutVision(resSettings.aboutVision || 'A climate-resilient Bangladesh where every household shares clean air, pure drinking water, and infinite solar electricity.');
        setSetAboutVisionBn(resSettings.aboutVisionBn || 'এমন এক বাংলাদেশের সবুজ রূপান্তর, যেখানে প্রতিটি মানুষের জন্য থাকবে বিশুদ্ধ পানি, পরিচ্ছন্ন বায়ু এবং পরিবেশবান্ধব জ্বালানি।');

        setSetBkashNo(resSettings.bkashNo || '01712345678');
        setSetNagadNo(resSettings.nagadNo || '01712345678');
      }
    } catch (err) {
      console.error('Error loading admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail.trim().toLowerCase(), password })
      });
      let data;
      try {
        data = await response.json();
      } catch (jsonErr) {
        throw new Error(`Invalid response format from server (Status: ${response.status})`);
      }

      if (!data) {
        throw new Error("Server returned an empty or invalid response");
      }

      if (data.success) {
        localStorage.setItem('green-earth-admin-token-2026', data.token);
        setIsAuthenticated(true);
        fetchAllData();
      } else {
        setLoginError(data.error || 'Invalid credentials');
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setLoginError(isBangla ? `সার্ভার সংযোগ ব্যর্থ হয়েছে: ${err.message || err}` : `Server network connection failed: ${err.message || err}`);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError('');
    setSignUpSuccess('');

    const authorizedEmail = "greenearthbd.25@gmail.com";
    if (signUpEmail.trim().toLowerCase() !== authorizedEmail) {
      setSignUpError(
        isBangla
          ? 'শুধুমাত্র greenearthbd.25@gmail.com ইমেইলটি অ্যাডমিন হিসেবে নিবন্ধিত হতে পারবে।'
          : 'Only greenearthbd.25@gmail.com is authorized to register as administrator.'
      );
      return;
    }

    if (signUpPassword.length < 6) {
      setSignUpError(
        isBangla
          ? 'পাসওয়ার্ড অবশ্যই কমপক্ষে ৬ অক্ষরের হতে হবে।'
          : 'Password must be at least 6 characters long.'
      );
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      setSignUpError(
        isBangla
          ? 'পাসওয়ার্ড দুটি মেলেনি!'
          : 'Passwords do not match!'
      );
      return;
    }

    try {
      const response = await fetch('/api/admin/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signUpEmail.trim().toLowerCase(), password: signUpPassword })
      });
      
      let data;
      try {
        data = await response.json();
      } catch (jsonErr) {
        throw new Error(`Invalid response format from server (Status: ${response.status})`);
      }

      if (!data) {
        throw new Error("Server returned an empty or invalid response");
      }

      if (data.success) {
        setSignUpSuccess(
          isBangla
            ? 'অ্যাডমিন অ্যাকাউন্ট সফলভাবে নিবন্ধিত হয়েছে! এখন লগইন করুন।'
            : 'Administrator registered successfully! Please log in.'
        );
        // Clear sign up fields
        setSignUpEmail('');
        setSignUpPassword('');
        setSignUpConfirmPassword('');
        // Automatically switch to login after 3 seconds
        setTimeout(() => {
          setIsSignUp(false);
          setSignUpSuccess('');
        }, 3000);
      } else {
        setSignUpError(data.error || 'Registration failed');
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      setSignUpError(isBangla ? `সার্ভার সংযোগ ব্যর্থ হয়েছে: ${err.message || err}` : `Server network connection failed: ${err.message || err}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('green-earth-admin-token-2026');
    setIsAuthenticated(false);
  };

  /* ==============================================
     CRUD HANDLERS
     ============================================== */

  // 1. PROJECT CRUD
  const handleProjectSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const categories: { [key: string]: string } = {
      plantation: 'Tree Plantation',
      renewable: 'Renewable Energy',
      water: 'Water Conservation',
      waste: 'Waste & Recycling',
      awareness: 'Community Awareness'
    };
    const categoriesBn: { [key: string]: string } = {
      plantation: 'বৃক্ষরোপণ কর্মসূচি',
      renewable: 'নবায়নযোগ্য জ্বালানি',
      water: 'বিশুদ্ধ পানি সরবরাহ',
      waste: 'বর্জ্য ও রিসাইক্লিং',
      awareness: 'কমিউনিটি সচেতনতা'
    };

    const payload = {
      id: editingId || undefined,
      title: projTitle,
      titleBn: projTitleBn,
      category: projCategory,
      categoryLabel: categories[projCategory],
      categoryLabelBn: categoriesBn[projCategory],
      location: projLocation,
      locationBn: projLocationBn,
      status: projStatus,
      statusLabel: projStatus === 'ongoing' ? 'Ongoing' : 'Completed',
      statusLabelBn: projStatus === 'ongoing' ? 'চলমান' : 'সম্পন্ন',
      shortDescription: projShortDesc,
      shortDescriptionBn: projShortDescBn,
      fullDescription: projFullDesc,
      fullDescriptionBn: projFullDescBn,
      impactMetric: projMetric,
      impactMetricBn: projMetricBn,
      impactLabel: projMetricLabel,
      impactLabelBn: projMetricLabelBn,
      image: projImage || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600',
      gallery: [projImage || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600']
    };

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setIsEditing(false);
        setEditingId(null);
        clearProjectForm();
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleProjectEdit = (p: Project) => {
    setEditingId(p.id);
    setProjTitle(p.title);
    setProjTitleBn(p.titleBn);
    setProjCategory(p.category);
    setProjLocation(p.location);
    setProjLocationBn(p.locationBn);
    setProjStatus(p.status);
    setProjShortDesc(p.shortDescription);
    setProjShortDescBn(p.shortDescriptionBn);
    setProjFullDesc(p.fullDescription);
    setProjFullDescBn(p.fullDescriptionBn);
    setProjMetric(p.impactMetric);
    setProjMetricBn(p.impactMetricBn);
    setProjMetricLabel(p.impactLabel);
    setProjMetricLabelBn(p.impactLabelBn);
    setProjImage(p.image);
    setIsEditing(true);
  };

  const handleProjectDelete = (id: string) => {
    setConfirmModal({
      title: isBangla ? 'প্রকল্প মুছে ফেলা নিশ্চিত করুন' : 'Confirm Project Deletion',
      message: isBangla 
        ? 'আপনি কি নিশ্চিতভাবে এই প্রকল্পটি মুছে ফেলতে চান? এটি পুনরায় ফিরিয়ে আনা সম্ভব নয়।' 
        : 'Are you sure you want to delete this project? This action cannot be undone.',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
          if (res.ok) fetchAllData();
        } catch (err) {
          console.error(err);
        }
        setConfirmModal(null);
      }
    });
  };

  const clearProjectForm = () => {
    setProjTitle('');
    setProjTitleBn('');
    setProjCategory('plantation');
    setProjLocation('');
    setProjLocationBn('');
    setProjStatus('ongoing');
    setProjShortDesc('');
    setProjShortDescBn('');
    setProjFullDesc('');
    setProjFullDescBn('');
    setProjMetric('');
    setProjMetricBn('');
    setProjMetricLabel('');
    setProjMetricLabelBn('');
    setProjImage('');
  };

  // 2. BLOG CRUD
  const handleBlogSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      id: editingId || undefined,
      title: blogTitle,
      titleBn: blogTitleBn,
      category: blogCategory,
      categoryBn: blogCategoryBn,
      excerpt: blogExcerpt,
      excerptBn: blogExcerptBn,
      content: blogContent,
      contentBn: blogContentBn,
      author: blogAuthor,
      authorBn: blogAuthorBn,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      dateBn: new Date().toLocaleDateString('bn-BD', { month: 'long', day: 'numeric', year: 'numeric' }),
      readTime: blogReadTime || '5 min read',
      readTimeBn: blogReadTimeBn || '৫ মিনিট রিড',
      image: blogImage || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600'
    };

    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setIsEditing(false);
        setEditingId(null);
        clearBlogForm();
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBlogEdit = (b: BlogPost) => {
    setEditingId(b.id);
    setBlogTitle(b.title);
    setBlogTitleBn(b.titleBn);
    setBlogCategory(b.category);
    setBlogCategoryBn(b.categoryBn);
    setBlogExcerpt(b.excerpt);
    setBlogExcerptBn(b.excerptBn);
    setBlogContent(b.content);
    setBlogContentBn(b.contentBn);
    setBlogAuthor(b.author);
    setBlogAuthorBn(b.authorBn);
    setBlogImage(b.image);
    setBlogReadTime(b.readTime);
    setBlogReadTimeBn(b.readTimeBn);
    setIsEditing(true);
  };

  const handleBlogDelete = (id: string) => {
    setConfirmModal({
      title: isBangla ? 'নিবন্ধ মুছে ফেলা নিশ্চিত করুন' : 'Confirm Article Deletion',
      message: isBangla 
        ? 'আপনি কি নিশ্চিতভাবে এই নিবন্ধটি মুছে ফেলতে চান? এটি পুনরায় ফিরিয়ে আনা সম্ভব নয়।' 
        : 'Are you sure you want to delete this blog post? This action cannot be undone.',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
          if (res.ok) fetchAllData();
        } catch (err) {
          console.error(err);
        }
        setConfirmModal(null);
      }
    });
  };

  const clearBlogForm = () => {
    setBlogTitle('');
    setBlogTitleBn('');
    setBlogCategory('');
    setBlogCategoryBn('');
    setBlogExcerpt('');
    setBlogExcerptBn('');
    setBlogContent('');
    setBlogContentBn('');
    setBlogAuthor('');
    setBlogAuthorBn('');
    setBlogImage('');
    setBlogReadTime('');
    setBlogReadTimeBn('');
  };

  // 3. TEAM CRUD
  const handleTeamSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      id: editingId || undefined,
      name: teamName,
      nameBn: teamNameBn,
      role: teamRole,
      roleBn: teamRoleBn,
      bio: teamBio,
      bioBn: teamBioBn,
      image: teamImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    };

    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setIsEditing(false);
        setEditingId(null);
        clearTeamForm();
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTeamEdit = (t: TeamMember) => {
    setEditingId(t.id);
    setTeamName(t.name);
    setTeamNameBn(t.nameBn);
    setTeamRole(t.role);
    setTeamRoleBn(t.roleBn);
    setTeamBio(t.bio);
    setTeamBioBn(t.bioBn);
    setTeamImage(t.image);
    setIsEditing(true);
  };

  const handleTeamDelete = (id: string) => {
    setConfirmModal({
      title: isBangla ? 'টিম সদস্য মুছে ফেলা নিশ্চিত করুন' : 'Confirm Team Member Deletion',
      message: isBangla 
        ? 'আপনি কি নিশ্চিতভাবে এই টিম সদস্যকে মুছে ফেলতে চান? এটি পুনরায় ফিরিয়ে আনা সম্ভব নয়।' 
        : 'Are you sure you want to delete this team member? This action cannot be undone.',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/team/${id}`, { method: 'DELETE' });
          if (res.ok) fetchAllData();
        } catch (err) {
          console.error(err);
        }
        setConfirmModal(null);
      }
    });
  };

  const clearTeamForm = () => {
    setTeamName('');
    setTeamNameBn('');
    setTeamRole('');
    setTeamRoleBn('');
    setTeamBio('');
    setTeamBioBn('');
    setTeamImage('');
  };

  // 4. GALLERY CRUD
  const handleGallerySave = async (e: React.FormEvent) => {
    e.preventDefault();
    const categories: { [key: string]: string } = {
      plantation: 'Plantation',
      renewable: 'Solar Power',
      water: 'Clean Water',
      waste: 'Waste Cleanups',
      campaign: 'Campaigns'
    };
    const categoriesBn: { [key: string]: string } = {
      plantation: 'বৃক্ষরোপণ',
      renewable: 'সৌর শক্তি',
      water: 'বিশুদ্ধ পানি',
      waste: 'বর্জ্য অপসারণ',
      campaign: 'সচেতনতা অভিযান'
    };

    const payload = {
      id: editingId || undefined,
      title: galTitle,
      titleBn: galTitleBn,
      category: galCategory,
      categoryLabel: categories[galCategory],
      categoryLabelBn: categoriesBn[galCategory],
      image: galImage || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600',
      date: galDate || new Date().getFullYear().toString()
    };

    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setIsEditing(false);
        setEditingId(null);
        clearGalleryForm();
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGalleryEdit = (g: GalleryItem) => {
    setEditingId(g.id);
    setGalTitle(g.title);
    setGalTitleBn(g.titleBn);
    setGalCategory(g.category);
    setGalImage(g.image);
    setGalDate(g.date);
    setIsEditing(true);
  };

  const handleGalleryDelete = (id: string) => {
    setConfirmModal({
      title: isBangla ? 'গ্যালারি আইটেম মুছে ফেলা নিশ্চিত করুন' : 'Confirm Gallery Item Deletion',
      message: isBangla 
        ? 'আপনি কি নিশ্চিতভাবে এই গ্যালারি ছবিটি মুছে ফেলতে চান? এটি পুনরায় ফিরিয়ে আনা সম্ভব নয়।' 
        : 'Are you sure you want to delete this gallery item? This action cannot be undone.',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
          if (res.ok) fetchAllData();
        } catch (err) {
          console.error(err);
        }
        setConfirmModal(null);
      }
    });
  };

  const clearGalleryForm = () => {
    setGalTitle('');
    setGalTitleBn('');
    setGalCategory('plantation');
    setGalImage('');
    setGalDate('');
  };

  // 5. REGISTRATION DELETIONS & APPROVALS
  const handleVolunteerDelete = (id: string) => {
    setConfirmModal({
      title: isBangla ? 'স্বেচ্ছাসেবী আবেদন মুছে ফেলা নিশ্চিত করুন' : 'Confirm Volunteer Deletion',
      message: isBangla 
        ? 'আপনি কি নিশ্চিতভাবে এই স্বেচ্ছাসেবী আবেদনটি মুছে ফেলতে চান? এটি পুনরায় ফিরিয়ে আনা সম্ভব নয়।' 
        : 'Are you sure you want to delete this volunteer registration? This action cannot be undone.',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/volunteers/${id}`, { method: 'DELETE' });
          if (res.ok) fetchAllData();
        } catch (err) {
          console.error(err);
        }
        setConfirmModal(null);
      }
    });
  };

  const handleDonationDelete = (id: string) => {
    setConfirmModal({
      title: isBangla ? 'অনুদানের তথ্য মুছে ফেলা নিশ্চিত করুন' : 'Confirm Donation Record Deletion',
      message: isBangla 
        ? 'আপনি কি নিশ্চিতভাবে এই অনুদানের তথ্যটি মুছে ফেলতে চান? এটি পুনরায় ফিরিয়ে আনা সম্ভব নয়।' 
        : 'Are you sure you want to delete this donation record? This action cannot be undone.',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/donations/${id}`, { method: 'DELETE' });
          if (res.ok) fetchAllData();
        } catch (err) {
          console.error(err);
        }
        setConfirmModal(null);
      }
    });
  };

  const handleVerifyDonation = async (donation: Donation) => {
    const updated = { ...donation, status: 'verified' };
    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubscriberDelete = (email: string) => {
    setConfirmModal({
      title: isBangla ? 'নিউজলেটার সাবস্ক্রিপশন বাতিল নিশ্চিত করুন' : 'Confirm Unsubscribe',
      message: isBangla 
        ? `আপনি কি নিশ্চিতভাবে ${email} ইমেইলের সাবস্ক্রিপশন বাতিল করতে চান?` 
        : `Are you sure you want to unsubscribe email: ${email}?`,
      onConfirm: async () => {
        try {
          const res = await fetch('/api/subscribers', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          });
          if (res.ok) fetchAllData();
        } catch (err) {
          console.error(err);
        }
        setConfirmModal(null);
      }
    });
  };

  const handleContactDelete = (id: string) => {
    setConfirmModal({
      title: isBangla ? 'জিজ্ঞাসা বার্তা মুছে ফেলা নিশ্চিত করুন' : 'Confirm Inquiry Deletion',
      message: isBangla 
        ? 'আপনি কি নিশ্চিতভাবে এই বার্তাটি মুছে ফেলতে চান? এটি পুনরায় ফিরিয়ে আনা সম্ভব নয়।' 
        : 'Are you sure you want to delete this contact enquiry? This action cannot be undone.',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
          if (res.ok) fetchAllData();
        } catch (err) {
          console.error(err);
        }
        setConfirmModal(null);
      }
    });
  };

  // 6. SAVE ORG SETTINGS
  const handleSettingsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      orgName: setOrgName,
      tagline: setTagline,
      taglineBn: setTaglineBn,
      phone: setPhone,
      email: setEmail,
      address: setAddress,
      addressBn: setAddressBn,
      aboutText: setAboutText,
      aboutTextBn: setAboutTextBn,
      heroImgUrl: setHeroImgUrl,
      heroTagline: setHeroTagline,
      heroTaglineBn: setHeroTaglineBn,
      heroTitle: setHeroTitle,
      heroTitleBn: setHeroTitleBn,
      heroBio: setHeroBio,
      heroBioBn: setHeroBioBn,

      statTreesTarget: setStatTreesTarget,
      statVillagesTarget: setStatVillagesTarget,
      statVolunteersTarget: setStatVolunteersTarget,
      statWaterTarget: setStatWaterTarget,

      aboutStory1: setAboutStory1,
      aboutStory1Bn: setAboutStory1Bn,
      aboutStory2: setAboutStory2,
      aboutStory2Bn: setAboutStory2Bn,
      aboutMission: setAboutMission,
      aboutMissionBn: setAboutMissionBn,
      aboutVision: setAboutVision,
      aboutVisionBn: setAboutVisionBn,

      bkashNo: setBkashNo,
      nagadNo: setNagadNo
    };

    if (setNewPassword.trim()) {
      payload.password = setNewPassword;
    }

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setSetNewPassword('');
        alert('Settings saved successfully!');
        fetchAllData();
        if (onSettingsSaved) {
          onSettingsSaved();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ==============================================
     RENTAL PANELS (RENDER)
     ============================================== */

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAFAF7] via-[#F4F6F0] to-[#E3EAE0] pt-24 pb-12 px-4" id="admin-login-view">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl border border-gray-200/80 shadow-2xl p-8 sm:p-10 w-full max-w-md text-left"
        >
          <div className="flex flex-col items-center text-center gap-2 mb-8">
            <div className="p-4 bg-[#6BBF3A]/10 text-[#1F5E2E] rounded-3xl mb-1">
              <Lock size={32} className="stroke-[2.5]" />
            </div>
            <h1 className="font-sans text-2xl font-black text-[#1F5E2E]">{isBangla ? 'গ্রিন আর্থ পোর্টাল' : 'Green Earth Portal'}</h1>
            <p className="font-mono text-xs text-gray-400 font-bold uppercase tracking-wider">{isBangla ? 'প্রশাসনিক প্রবেশাধিকার' : 'Administrative Access'}</p>
          </div>

          {/* Tab Selection */}
          <div className="flex border-b border-gray-100 mb-6 font-sans text-sm">
            <button
              onClick={() => { setIsSignUp(false); setLoginError(''); setSignUpError(''); }}
              className={`flex-1 pb-3 text-center font-bold tracking-wide transition-all ${
                !isSignUp 
                  ? 'border-b-2 border-[#1F5E2E] text-[#1F5E2E]' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {isBangla ? 'লগইন করুন' : 'Sign In'}
            </button>
            <button
              onClick={() => { setIsSignUp(true); setLoginError(''); setSignUpError(''); }}
              className={`flex-1 pb-3 text-center font-bold tracking-wide transition-all ${
                isSignUp 
                  ? 'border-b-2 border-[#1F5E2E] text-[#1F5E2E]' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {isBangla ? 'অ্যাডমিন সাইন আপ' : 'Admin Sign Up'}
            </button>
          </div>

          {!isSignUp ? (
            <form onSubmit={handleLogin} className="space-y-5 font-sans">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{isBangla ? 'ইমেইল অ্যাড্রেস' : 'Email Address'}</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder={isBangla ? 'যেমন: greenearthbd.25@gmail.com' : 'e.g. greenearthbd.25@gmail.com'}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#6BBF3A] text-sm text-gray-800 font-semibold"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{isBangla ? 'পাসওয়ার্ড' : 'Password'}</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#6BBF3A] text-sm text-gray-800"
                  required
                />
              </div>

              {loginError && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl text-left" id="login-error-alert">
                  <div className="flex items-start gap-3">
                    <div className="text-red-500 shrink-0 mt-0.5">
                      <X size={16} className="stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-red-800 uppercase tracking-wider mb-0.5">
                        {isBangla ? 'অনুমোদন ব্যর্থ হয়েছে' : 'Authentication Failed'}
                      </h4>
                      <p className="text-xs text-red-600 font-semibold leading-relaxed">
                        {isBangla && (loginError === 'Invalid username or password' || loginError === 'Invalid credentials' || loginError === 'Invalid email or password')
                          ? 'ভুল ইমেইল অথবা পাসওয়ার্ড' 
                          : loginError}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#1F5E2E] hover:bg-[#2E7D32] text-white font-sans font-bold py-4 rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
              >
                <span>{isBangla ? 'প্রবেশ করুন' : 'Authenticate'}</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-5 font-sans">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{isBangla ? 'ইমেইল অ্যাড্রেস' : 'Email Address'}</label>
                <input
                  type="email"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  placeholder="greenearthbd.25@gmail.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#6BBF3A] text-sm text-gray-800 font-semibold"
                  required
                />
                <p className="text-[10px] text-gray-400 mt-1 font-semibold">
                  {isBangla 
                    ? '* শুধুমাত্র অনুমোদিত ইমেইলটিই অ্যাডমিন হতে পারবে।' 
                    : '* Only the authorized email can be registered.'}
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{isBangla ? 'নতুন পাসওয়ার্ড' : 'New Password'}</label>
                <input
                  type="password"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#6BBF3A] text-sm text-gray-800"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{isBangla ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm Password'}</label>
                <input
                  type="password"
                  value={signUpConfirmPassword}
                  onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#6BBF3A] text-sm text-gray-800"
                  required
                />
              </div>

              {signUpError && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl text-left" id="signup-error-alert">
                  <div className="flex items-start gap-3">
                    <div className="text-red-500 shrink-0 mt-0.5">
                      <X size={16} className="stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-red-800 uppercase tracking-wider mb-0.5">
                        {isBangla ? 'নিবন্ধন ব্যর্থ হয়েছে' : 'Registration Failed'}
                      </h4>
                      <p className="text-xs text-red-600 font-semibold leading-relaxed">
                        {signUpError}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {signUpSuccess && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-xl text-left" id="signup-success-alert">
                  <div className="flex items-start gap-3">
                    <div className="text-green-500 shrink-0 mt-0.5">
                      <svg className="h-4 w-4 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-green-800 uppercase tracking-wider mb-0.5">
                        {isBangla ? 'নিবন্ধন সফল হয়েছে' : 'Registration Successful'}
                      </h4>
                      <p className="text-xs text-green-600 font-semibold leading-relaxed font-semibold">
                        {signUpSuccess}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#1F5E2E] hover:bg-[#2E7D32] text-white font-sans font-bold py-4 rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
              >
                <span>{isBangla ? 'নিবন্ধন সম্পন্ন করুন' : 'Register Administrator'}</span>
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">
              {isBangla ? 'অ্যান্টিগ্রাভিটি এজেন্ট দ্বারা সুরক্ষিত' : 'Secured by Antigravity Agent'}
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Calculate stats
  const totalVerifiedDonationAmount = donations
    .filter((d) => d.status === 'verified')
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="min-h-screen flex bg-gray-50 pt-20" id="admin-dashboard-view">
      {/* 1. Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between hidden md:flex shrink-0 font-sans">
        <div className="p-6 flex flex-col gap-1.5">
          <div className="text-xs font-mono font-black text-gray-400 uppercase tracking-widest mb-4">
            Command Center
          </div>

          <nav className="flex flex-col gap-1">
            {[
              { tab: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
              { tab: 'projects', label: 'Manage Projects', icon: <Trees size={18} /> },
              { tab: 'blogs', label: 'Manage Blogs', icon: <BookOpen size={18} /> },
              { tab: 'volunteers', label: 'Volunteers List', icon: <Users size={18} />, count: volunteers.length },
              { tab: 'donations', label: 'Donations Audit', icon: <Heart size={18} />, count: donations.filter(d => d.status !== 'verified').length },
              { tab: 'team', label: 'Manage Team', icon: <Users size={18} /> },
              { tab: 'gallery', label: 'Manage Gallery', icon: <ImageIcon size={18} /> },
              { tab: 'subscribers', label: 'Subscribers', icon: <Mail size={18} />, count: subscribers.length },
              { tab: 'contacts', label: 'Contact Inquiries', icon: <FileText size={18} />, count: contacts.length },
              { tab: 'settings', label: 'System Settings', icon: <Settings size={18} /> }
            ].map((item) => (
              <button
                key={item.tab}
                onClick={() => {
                  setActiveTab(item.tab as AdminTab);
                  setIsEditing(false);
                  setEditingId(null);
                }}
                className={`w-full text-left py-3 px-4 rounded-xl flex items-center justify-between font-bold text-sm transition-all cursor-pointer ${
                  activeTab === item.tab
                    ? 'bg-[#1F5E2E]/10 text-[#1F5E2E]'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className="bg-[#6BBF3A] text-white font-mono text-[10px] font-black px-2 py-0.5 rounded-full">
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer text-sm"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Workspace */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full font-sans">
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-gray-200 pb-5">
          <div>
            <h2 className="text-2xl font-black text-gray-900 capitalize flex items-center gap-2">
              <ShieldCheck className="text-[#6BBF3A]" size={28} />
              <span>Admin / {activeTab}</span>
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              Manage Bangladesh environmental grassroots operations, write content, and audit donations.
            </p>
          </div>

          <div className="flex gap-2 shrink-0">
            {/* Mobile Nav Trigger placeholder helper */}
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as AdminTab)}
              className="md:hidden bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold text-gray-700 focus:outline-none"
            >
              <option value="dashboard">Dashboard</option>
              <option value="projects">Projects</option>
              <option value="blogs">Blogs</option>
              <option value="volunteers">Volunteers</option>
              <option value="donations">Donations</option>
              <option value="team">Team</option>
              <option value="gallery">Gallery</option>
              <option value="subscribers">Subscribers</option>
              <option value="contacts">Contact submissions</option>
              <option value="settings">Settings</option>
            </select>

            <button
              onClick={fetchAllData}
              className="bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Refresh Data</span>
            </button>
          </div>
        </div>

        {/* 3. Render Active Tab view panel */}
        {loading ? (
          <div className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest animate-pulse text-xs">
            Fetching green earth records...
          </div>
        ) : (
          <div id="admin-tab-workspace">
            {/* --- DASHBOARD TAB --- */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8" id="dashboard-tab">
                {/* 4 Stats Block */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Stat 1 */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center gap-5">
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
                      <Trees size={24} />
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider block">Initiatives</span>
                      <span className="text-2xl font-black text-[#1F5E2E]">{projects.length}</span>
                    </div>
                  </div>
                  {/* Stat 2 */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center gap-5">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                      <Users size={24} />
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider block">Volunteers</span>
                      <span className="text-2xl font-black text-[#1F5E2E]">{volunteers.length}</span>
                    </div>
                  </div>
                  {/* Stat 3 */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center gap-5">
                    <div className="p-4 bg-red-50 text-red-500 rounded-2xl">
                      <Heart size={24} fill="currentColor" />
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider block">Total Donations</span>
                      <span className="text-2xl font-black text-[#1F5E2E]">৳{totalVerifiedDonationAmount.toLocaleString()}</span>
                    </div>
                  </div>
                  {/* Stat 4 */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center gap-5">
                    <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl">
                      <Mail size={24} />
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider block">Eco-Subscribers</span>
                      <span className="text-2xl font-black text-[#1F5E2E]">{subscribers.length}</span>
                    </div>
                  </div>
                </div>

                {/* Grid Lists */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recent Volunteers */}
                  <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-3">
                      <h3 className="text-lg font-black text-[#1F5E2E]">Recent Volunteers</h3>
                      <button onClick={() => setActiveTab('volunteers')} className="text-[#6BBF3A] hover:underline font-bold text-xs">View All</button>
                    </div>

                    <div className="space-y-4">
                      {volunteers.slice(0, 4).map((vol) => (
                        <div key={vol.id} className="flex justify-between items-center bg-gray-50 border border-gray-200/50 p-4 rounded-2xl text-left">
                          <div>
                            <h4 className="font-bold text-[#1F5E2E] text-sm">{vol.name}</h4>
                            <p className="text-xs text-gray-400 font-mono mt-0.5">{vol.email} • {vol.phone}</p>
                          </div>
                          <span className="bg-green-100 text-green-800 text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-full">
                            {vol.interest}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Verified Donations */}
                  <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-3">
                      <h3 className="text-lg font-black text-[#1F5E2E]">Recent Donations</h3>
                      <button onClick={() => setActiveTab('donations')} className="text-[#6BBF3A] hover:underline font-bold text-xs">Verify Audit</button>
                    </div>

                    <div className="space-y-4">
                      {donations.slice(0, 4).map((don) => (
                        <div key={don.id} className="flex justify-between items-center bg-gray-50 border border-gray-200/50 p-4 rounded-2xl text-left">
                          <div>
                            <h4 className="font-bold text-[#1F5E2E] text-sm">{don.name}</h4>
                            <p className="text-xs text-gray-400 font-mono mt-0.5">
                              Via {don.paymentMethod.toUpperCase()} (TX: {don.transId || 'N/A'})
                            </p>
                          </div>
                          <span className="font-black text-[#1F5E2E] text-sm">
                            ৳{don.amount.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- PROJECTS MANAGEMENT TAB --- */}
            {activeTab === 'projects' && (
              <div className="space-y-6" id="projects-tab">
                {isEditing ? (
                  <form onSubmit={handleProjectSave} className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-6 text-left">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <h3 className="text-lg font-black text-[#1F5E2E]">
                        {editingId ? 'Edit Project / প্রকল্প সম্পাদনা' : 'Create New Project / নতুন প্রকল্প'}
                      </h3>
                      <button type="button" onClick={() => { setIsEditing(false); setEditingId(null); }} className="text-gray-400 hover:text-gray-700">
                        <X size={20} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* English Title */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Project Title (EN)</label>
                        <input
                          type="text"
                          value={projTitle}
                          onChange={(e) => setProjTitle(e.target.value)}
                          placeholder="e.g. Coastal Mangrove Plantation"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-800"
                          required
                        />
                      </div>

                      {/* Bangla Title */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Project Title (BN)</label>
                        <input
                          type="text"
                          value={projTitleBn}
                          onChange={(e) => setProjTitleBn(e.target.value)}
                          placeholder="যেমন: উপকূলীয় ম্যানগ্রোভ বনায়ন"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-800"
                          required
                        />
                      </div>

                      {/* Category */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
                        <select
                          value={projCategory}
                          onChange={(e) => setProjCategory(e.target.value as any)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-700"
                        >
                          <option value="plantation">Tree Plantation (বৃক্ষরোপণ)</option>
                          <option value="renewable">Renewable Energy (নবায়নযোগ্য জ্বালানি)</option>
                          <option value="water">Water Conservation (পানি সংরক্ষণ)</option>
                          <option value="waste">Waste & Recycling (বর্জ্য ও রিসাইক্লিং)</option>
                          <option value="awareness">Awareness Campaign (সচেতনতা অভিযান)</option>
                        </select>
                      </div>

                      {/* Status */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Operational Status</label>
                        <select
                          value={projStatus}
                          onChange={(e) => setProjStatus(e.target.value as any)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-700"
                        >
                          <option value="ongoing">Ongoing (চলমান)</option>
                          <option value="completed">Completed (সম্পন্ন)</option>
                        </select>
                      </div>

                      {/* Location EN */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Location (EN)</label>
                        <input
                          type="text"
                          value={projLocation}
                          onChange={(e) => setProjLocation(e.target.value)}
                          placeholder="e.g. Satkhira, Sundarbans"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-800"
                          required
                        />
                      </div>

                      {/* Location BN */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Location (BN)</label>
                        <input
                          type="text"
                          value={projLocationBn}
                          onChange={(e) => setProjLocationBn(e.target.value)}
                          placeholder="যেমন: সাতক্ষীরা, সুন্দরবন"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-800"
                          required
                        />
                      </div>

                      {/* Image URL with Upload Option */}
                      <div className="sm:col-span-2">
                        <ImageUploadInput
                          label="Banner Image"
                          value={projImage}
                          onChange={setProjImage}
                          placeholder="https://images.unsplash.com/..."
                          filenamePrefix="project"
                          isBangla={isBangla}
                        />
                      </div>

                      {/* Impact Metric EN */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Impact Value (EN) (e.g. "25,000+ Saplings")</label>
                        <input
                          type="text"
                          value={projMetric}
                          onChange={(e) => setProjMetric(e.target.value)}
                          placeholder="e.g. 25,000+ Saplings"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-800"
                        />
                      </div>

                      {/* Impact Metric BN */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Impact Value (BN) (যেমন: "২৫,০০০+ চারা গাছ")</label>
                        <input
                          type="text"
                          value={projMetricBn}
                          onChange={(e) => setProjMetricBn(e.target.value)}
                          placeholder="যেমন: ২৫,০০০+ চারা গাছ"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-800"
                        />
                      </div>

                      {/* Impact Label EN */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Impact Label (EN) (e.g. "Planted & Monitored")</label>
                        <input
                          type="text"
                          value={projMetricLabel}
                          onChange={(e) => setProjMetricLabel(e.target.value)}
                          placeholder="e.g. Planted & Monitored"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-800"
                        />
                      </div>

                      {/* Impact Label BN */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Impact Label (BN) (যেমন: "রোপণ ও পর্যবেক্ষণ")</label>
                        <input
                          type="text"
                          value={projMetricLabelBn}
                          onChange={(e) => setProjMetricLabelBn(e.target.value)}
                          placeholder="যেমন: রোপণ ও পর্যবেক্ষণ করা হয়েছে"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-800"
                        />
                      </div>

                      {/* Short Description EN */}
                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Short Description (EN)</label>
                        <textarea
                          rows={2}
                          value={projShortDesc}
                          onChange={(e) => setProjShortDesc(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-800 resize-none"
                          required
                        />
                      </div>

                      {/* Short Description BN */}
                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Short Description (BN)</label>
                        <textarea
                          rows={2}
                          value={projShortDescBn}
                          onChange={(e) => setProjShortDescBn(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-800 resize-none"
                          required
                        />
                      </div>

                      {/* Full Description EN */}
                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Story Description (EN)</label>
                        <textarea
                          rows={5}
                          value={projFullDesc}
                          onChange={(e) => setProjFullDesc(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-800 resize-none"
                          required
                        />
                      </div>

                      {/* Full Description BN */}
                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Story Description (BN)</label>
                        <textarea
                          rows={5}
                          value={projFullDescBn}
                          onChange={(e) => setProjFullDescBn(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-800 resize-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => { setIsEditing(false); setEditingId(null); }}
                        className="py-3 px-6 border border-gray-300 rounded-full text-sm font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="py-3 px-8 bg-[#1F5E2E] hover:bg-[#2E7D32] text-white rounded-full text-sm font-bold cursor-pointer"
                      >
                        Save Project
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-black text-[#1F5E2E]">Projects Directory</h3>
                      <button
                        onClick={() => { clearProjectForm(); setIsEditing(true); }}
                        className="bg-[#1F5E2E] hover:bg-[#2E7D32] text-white py-2 px-4 rounded-full text-xs font-bold cursor-pointer flex items-center gap-1"
                      >
                        <Plus size={14} />
                        <span>Add Project</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {projects.map((p) => (
                        <div key={p.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow flex flex-col justify-between text-left h-full">
                          <img src={p.image} className="w-full aspect-video object-cover" alt="" />
                          <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                            <div>
                              <span className="text-[10px] font-mono font-extrabold uppercase bg-[#6BBF3A]/10 text-[#1F5E2E] px-2.5 py-0.5 rounded-full">
                                {p.categoryLabel}
                              </span>
                              <h4 className="font-extrabold text-gray-900 mt-2 text-base line-clamp-1">{p.title}</h4>
                              <p className="text-xs text-gray-400 mt-1 font-mono">📍 {p.location}</p>
                            </div>

                            <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
                              <button
                                onClick={() => handleProjectEdit(p)}
                                className="p-2 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600 rounded-xl cursor-pointer"
                                title="Edit"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() => handleProjectDelete(p.id)}
                                className="p-2 border border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 rounded-xl cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* --- BLOGS MANAGEMENT TAB --- */}
            {activeTab === 'blogs' && (
              <div className="space-y-6" id="blogs-tab">
                {isEditing ? (
                  <form onSubmit={handleBlogSave} className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-6 text-left">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <h3 className="text-lg font-black text-[#1F5E2E]">
                        {editingId ? 'Edit Article / কলাম সম্পাদনা' : 'Compose New Article / নতুন নিবন্ধ লিখুন'}
                      </h3>
                      <button type="button" onClick={() => { setIsEditing(false); setEditingId(null); }} className="text-gray-400 hover:text-gray-700">
                        <X size={20} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Article Title (EN)</label>
                        <input
                          type="text"
                          value={blogTitle}
                          onChange={(e) => setBlogTitle(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-800"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Article Title (BN)</label>
                        <input
                          type="text"
                          value={blogTitleBn}
                          onChange={(e) => setBlogTitleBn(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-800"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category Tag (EN)</label>
                        <input
                          type="text"
                          value={blogCategory}
                          onChange={(e) => setBlogCategory(e.target.value)}
                          placeholder="e.g. Ecology, Waste, Solar"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-800"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category Tag (BN)</label>
                        <input
                          type="text"
                          value={blogCategoryBn}
                          onChange={(e) => setBlogCategoryBn(e.target.value)}
                          placeholder="যেমন: পরিবেশবিদ্যা, জ্বালানি"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-800"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Author Name (EN)</label>
                        <input
                          type="text"
                          value={blogAuthor}
                          onChange={(e) => setBlogAuthor(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-800"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Author Name (BN)</label>
                        <input
                          type="text"
                          value={blogAuthorBn}
                          onChange={(e) => setBlogAuthorBn(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-800"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Read Time (EN) (e.g. "5 min read")</label>
                        <input
                          type="text"
                          value={blogReadTime}
                          onChange={(e) => setBlogReadTime(e.target.value)}
                          placeholder="5 min read"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-800"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Read Time (BN) (যেমন: "৫ মিনিট রিড")</label>
                        <input
                          type="text"
                          value={blogReadTimeBn}
                          onChange={(e) => setBlogReadTimeBn(e.target.value)}
                          placeholder="৫ মিনিট রিড"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-800"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <ImageUploadInput
                          label="Main Cover Image"
                          value={blogImage}
                          onChange={setBlogImage}
                          placeholder="https://images.unsplash.com/..."
                          filenamePrefix="blog"
                          isBangla={isBangla}
                        />
                      </div>

                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Excerpt / Summary (EN)</label>
                        <textarea
                          rows={2}
                          value={blogExcerpt}
                          onChange={(e) => setBlogExcerpt(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-800 resize-none"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Excerpt / Summary (BN)</label>
                        <textarea
                          rows={2}
                          value={blogExcerptBn}
                          onChange={(e) => setBlogExcerptBn(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-800 resize-none"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Content Article (EN)</label>
                        <textarea
                          rows={8}
                          value={blogContent}
                          onChange={(e) => setBlogContent(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-800 resize-none"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Content Article (BN)</label>
                        <textarea
                          rows={8}
                          value={blogContentBn}
                          onChange={(e) => setBlogContentBn(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-800 resize-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => { setIsEditing(false); setEditingId(null); }}
                        className="py-3 px-6 border border-gray-300 rounded-full text-sm font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="py-3 px-8 bg-[#1F5E2E] hover:bg-[#2E7D32] text-white rounded-full text-sm font-bold cursor-pointer"
                      >
                        Publish Column
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-black text-[#1F5E2E]">Eco-Blogs</h3>
                      <button
                        onClick={() => { clearBlogForm(); setIsEditing(true); }}
                        className="bg-[#1F5E2E] hover:bg-[#2E7D32] text-white py-2 px-4 rounded-full text-xs font-bold cursor-pointer flex items-center gap-1"
                      >
                        <Plus size={14} />
                        <span>New Column</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {blogs.map((b) => (
                        <div key={b.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow flex flex-col justify-between text-left h-full">
                          <img src={b.image} className="w-full aspect-video object-cover" alt="" />
                          <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                            <div>
                              <span className="text-[10px] font-mono font-extrabold uppercase bg-[#6BBF3A]/10 text-[#1F5E2E] px-2.5 py-0.5 rounded-full">
                                {b.category}
                              </span>
                              <h4 className="font-extrabold text-gray-900 mt-2 text-base line-clamp-1">{b.title}</h4>
                              <p className="text-xs text-gray-400 mt-1 font-mono">✍️ {b.author} • {b.date}</p>
                            </div>

                            <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
                              <button
                                onClick={() => handleBlogEdit(b)}
                                className="p-2 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600 rounded-xl cursor-pointer"
                                title="Edit"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() => handleBlogDelete(b.id)}
                                className="p-2 border border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 rounded-xl cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* --- VOLUNTEERS TAB --- */}
            {activeTab === 'volunteers' && (
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4" id="volunteers-tab">
                <h3 className="text-lg font-black text-[#1F5E2E] text-left">Volunteer Applications</h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-400 font-mono text-xs uppercase font-bold">
                        <th className="py-3 px-4">Volunteer Details</th>
                        <th className="py-3 px-4">Contact Info</th>
                        <th className="py-3 px-4">Interest Area</th>
                        <th className="py-3 px-4">Intro Message</th>
                        <th className="py-3 px-4">Submission Date</th>
                        <th className="py-3 px-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {volunteers.map((vol) => (
                        <tr key={vol.id} className="hover:bg-gray-50">
                          <td className="py-4 px-4 font-bold text-gray-900">{vol.name}</td>
                          <td className="py-4 px-4">
                            <div className="text-xs text-gray-600">{vol.email}</div>
                            <div className="text-xs text-gray-400 font-semibold font-mono mt-0.5">{vol.phone}</div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="bg-emerald-50 text-[#1F5E2E] text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full">
                              {vol.interest}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-xs text-gray-500 max-w-xs truncate" title={vol.message}>
                            {vol.message || '—'}
                          </td>
                          <td className="py-4 px-4 text-xs text-gray-400 font-mono">
                            {new Date(vol.date).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4">
                            <button
                              onClick={() => handleVolunteerDelete(vol.id)}
                              className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 cursor-pointer"
                              title="Delete application"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {volunteers.length === 0 && (
                    <p className="py-8 text-center text-gray-400 font-bold uppercase tracking-wider text-xs">No volunteer registrations found.</p>
                  )}
                </div>
              </div>
            )}

            {/* --- DONATIONS TAB --- */}
            {activeTab === 'donations' && (
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4" id="donations-tab">
                <h3 className="text-lg font-black text-[#1F5E2E] text-left">Donations Audit Ledger</h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-400 font-mono text-xs uppercase font-bold">
                        <th className="py-3 px-4">Contributor</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Channel</th>
                        <th className="py-3 px-4">Trans ID</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {donations.map((don) => (
                        <tr key={don.id} className="hover:bg-gray-50">
                          <td className="py-4 px-4 font-bold text-gray-900">{don.name || 'Anonymous'}</td>
                          <td className="py-4 px-4 text-xs text-gray-600">{don.email || '—'}</td>
                          <td className="py-4 px-4 font-black text-[#1F5E2E]">৳{(don.amount || 0).toLocaleString()}</td>
                          <td className="py-4 px-4">
                            <span className="text-[10px] font-mono font-black uppercase tracking-wider text-gray-500 bg-gray-100 py-0.5 px-2 rounded-md">
                              {don.paymentMethod}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-mono text-xs font-bold text-gray-400">{don.transId || 'Direct'}</td>
                          <td className="py-4 px-4">
                            {don.status === 'verified' ? (
                              <span className="bg-green-100 text-green-800 text-[9px] font-mono font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 w-fit">
                                <Check size={10} className="stroke-[3]" />
                                Verified
                              </span>
                            ) : (
                              <span className="bg-amber-100 text-amber-800 text-[9px] font-mono font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 w-fit">
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-xs text-gray-400 font-mono">
                            {new Date(don.date).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex gap-1.5">
                              {don.status !== 'verified' && (
                                <button
                                  onClick={() => handleVerifyDonation(don)}
                                  className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50 cursor-pointer"
                                  title="Approve & Verify Transaction"
                                >
                                  <Check size={16} />
                                </button>
                              )}
                              <button
                                onClick={() => handleDonationDelete(don.id)}
                                className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 cursor-pointer"
                                title="Delete record"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {donations.length === 0 && (
                    <p className="py-8 text-center text-gray-400 font-bold uppercase tracking-wider text-xs">No donation records registered.</p>
                  )}
                </div>
              </div>
            )}

            {/* --- TEAM MEMBERS TAB --- */}
            {activeTab === 'team' && (
              <div className="space-y-6" id="team-tab">
                {isEditing ? (
                  <form onSubmit={handleTeamSave} className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-6 text-left">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <h3 className="text-lg font-black text-[#1F5E2E]">
                        {editingId ? 'Edit Leader / কর্মকর্তা সম্পাদন' : 'Add Team Leader / নতুন নেতা যোগ করুন'}
                      </h3>
                      <button type="button" onClick={() => { setIsEditing(false); setEditingId(null); }} className="text-gray-400 hover:text-gray-700">
                        <X size={20} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name (EN)</label>
                        <input
                          type="text"
                          value={teamName}
                          onChange={(e) => setTeamName(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-800"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name (BN)</label>
                        <input
                          type="text"
                          value={teamNameBn}
                          onChange={(e) => setTeamNameBn(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-800"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Role Designation (EN)</label>
                        <input
                          type="text"
                          value={teamRole}
                          onChange={(e) => setTeamRole(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-800"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Role Designation (BN)</label>
                        <input
                          type="text"
                          value={teamRoleBn}
                          onChange={(e) => setTeamRoleBn(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-800"
                          required
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <ImageUploadInput
                          label="Leader Photo"
                          value={teamImage}
                          onChange={setTeamImage}
                          placeholder="https://images.unsplash.com/..."
                          filenamePrefix="team"
                          isBangla={isBangla}
                        />
                      </div>

                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Short Biography Bio (EN)</label>
                        <textarea
                          rows={3}
                          value={teamBio}
                          onChange={(e) => setTeamBio(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-800 resize-none"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Short Biography Bio (BN)</label>
                        <textarea
                          rows={3}
                          value={teamBioBn}
                          onChange={(e) => setTeamBioBn(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-800 resize-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => { setIsEditing(false); setEditingId(null); }}
                        className="py-3 px-6 border border-gray-300 rounded-full text-sm font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="py-3 px-8 bg-[#1F5E2E] hover:bg-[#2E7D32] text-white rounded-full text-sm font-bold cursor-pointer"
                      >
                        Save Member
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-black text-[#1F5E2E]">Team Roster</h3>
                      <button
                        onClick={() => { clearTeamForm(); setIsEditing(true); }}
                        className="bg-[#1F5E2E] hover:bg-[#2E7D32] text-white py-2 px-4 rounded-full text-xs font-bold cursor-pointer flex items-center gap-1"
                      >
                        <Plus size={14} />
                        <span>Add Member</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {team.map((t) => (
                        <div key={t.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow flex flex-col justify-between text-left h-full">
                          <img src={t.image} className="w-full aspect-square object-cover" alt="" />
                          <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                            <div>
                              <h4 className="font-extrabold text-gray-900 text-sm leading-tight">{t.name}</h4>
                              <p className="text-[10px] font-mono font-bold text-[#6BBF3A] uppercase tracking-wider mt-0.5">{t.role}</p>
                            </div>

                            <div className="flex justify-end gap-2 border-t border-gray-100 pt-2.5 mt-2">
                              <button
                                onClick={() => handleTeamEdit(t)}
                                className="p-1.5 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600 rounded-lg cursor-pointer"
                              >
                                <Edit size={12} />
                              </button>
                              <button
                                onClick={() => handleTeamDelete(t.id)}
                                className="p-1.5 border border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 rounded-lg cursor-pointer"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* --- GALLERY MANAGEMENT TAB --- */}
            {activeTab === 'gallery' && (
              <div className="space-y-6" id="gallery-tab">
                {isEditing ? (
                  <form onSubmit={handleGallerySave} className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-6 text-left">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <h3 className="text-lg font-black text-[#1F5E2E]">
                        {editingId ? 'Edit Gallery Photo' : 'Upload Gallery Photo'}
                      </h3>
                      <button type="button" onClick={() => { setIsEditing(false); setEditingId(null); }} className="text-gray-400 hover:text-gray-700">
                        <X size={20} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Caption Title (EN)</label>
                        <input
                          type="text"
                          value={galTitle}
                          onChange={(e) => setGalTitle(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-800"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Caption Title (BN)</label>
                        <input
                          type="text"
                          value={galTitleBn}
                          onChange={(e) => setGalTitleBn(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-800"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ecology Category</label>
                        <select
                          value={galCategory}
                          onChange={(e) => setGalCategory(e.target.value as any)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-700"
                        >
                          <option value="plantation">Tree Plantation (বৃক্ষরোপণ)</option>
                          <option value="renewable">Solar Power (সৌর শক্তি)</option>
                          <option value="water">Clean Water (বিশুদ্ধ পানি)</option>
                          <option value="waste">Waste Cleanups (বর্জ্য অপসারণ)</option>
                          <option value="campaign">Campaigns & Awareness (সচেতনতা অভিযান)</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Year of Action (e.g. "2026")</label>
                        <input
                          type="text"
                          value={galDate}
                          onChange={(e) => setGalDate(e.target.value)}
                          placeholder="2026"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-800"
                          required
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <ImageUploadInput
                          label="Gallery Image"
                          value={galImage}
                          onChange={setGalImage}
                          placeholder="https://images.unsplash.com/..."
                          filenamePrefix="gallery"
                          isBangla={isBangla}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => { setIsEditing(false); setEditingId(null); }}
                        className="py-3 px-6 border border-gray-300 rounded-full text-sm font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="py-3 px-8 bg-[#1F5E2E] hover:bg-[#2E7D32] text-white rounded-full text-sm font-bold cursor-pointer"
                      >
                        Upload Photo
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-black text-[#1F5E2E]">Image Gallery</h3>
                      <button
                        onClick={() => { clearGalleryForm(); setIsEditing(true); }}
                        className="bg-[#1F5E2E] hover:bg-[#2E7D32] text-white py-2 px-4 rounded-full text-xs font-bold cursor-pointer flex items-center gap-1"
                      >
                        <Plus size={14} />
                        <span>Upload Photo</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {gallery.map((g) => (
                        <div key={g.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow flex flex-col justify-between text-left h-full group relative">
                          <img src={g.image} className="w-full aspect-video object-cover" alt="" />
                          <div className="p-3">
                            <h4 className="font-extrabold text-gray-900 text-xs truncate">{g.title}</h4>
                            <p className="text-[9px] font-mono font-bold text-[#6BBF3A] uppercase tracking-wider mt-0.5">{g.categoryLabel}</p>
                          </div>
                          
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleGalleryEdit(g)}
                              className="p-1.5 bg-white/95 border border-gray-200 hover:bg-white text-gray-600 rounded-lg cursor-pointer shadow"
                            >
                              <Edit size={10} />
                            </button>
                            <button
                              onClick={() => handleGalleryDelete(g.id)}
                              className="p-1.5 bg-white/95 border border-red-100 hover:bg-red-50 text-red-600 rounded-lg cursor-pointer shadow"
                            >
                              <Trash2 size={10} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* --- SUBSCRIBERS TAB --- */}
            {activeTab === 'subscribers' && (
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4" id="subscribers-tab">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-black text-[#1F5E2E]">Eco-Newsletter Subscribers</h3>
                  <button
                    onClick={() => {
                      const csvContent = "data:text/csv;charset=utf-8," + subscribers.join("\n");
                      const encodedUri = encodeURI(csvContent);
                      const link = document.createElement("a");
                      link.setAttribute("href", encodedUri);
                      link.setAttribute("download", "green_earth_subscribers.csv");
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="border border-gray-200 hover:border-gray-300 text-gray-600 font-bold py-2 px-4 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Download size={14} />
                    <span>Export CSV</span>
                  </button>
                </div>

                <div className="max-w-md mx-auto space-y-2">
                  {subscribers.map((email) => (
                    <div key={email} className="flex justify-between items-center bg-gray-50 border border-gray-200/50 p-4 rounded-2xl text-left">
                      <div className="flex items-center gap-3">
                        <Mail size={16} className="text-[#6BBF3A]" />
                        <span className="font-bold text-gray-800 text-sm">{email}</span>
                      </div>
                      <button
                        onClick={() => handleSubscriberDelete(email)}
                        className="text-gray-400 hover:text-red-500 p-1.5 rounded hover:bg-red-50 cursor-pointer"
                        title="Remove Subscriber"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {subscribers.length === 0 && (
                    <p className="py-8 text-center text-gray-400 font-bold uppercase tracking-wider text-xs">No active subscribers.</p>
                  )}
                </div>
              </div>
            )}

            {/* --- CONTACT INQUIRIES TAB --- */}
            {activeTab === 'contacts' && (
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4" id="contacts-tab">
                <h3 className="text-lg font-black text-[#1F5E2E] text-left">Contact Form Inquiries</h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-400 font-mono text-xs uppercase font-bold">
                        <th className="py-3 px-4">Sender Details</th>
                        <th className="py-3 px-4">Subject</th>
                        <th className="py-3 px-4">Message Details</th>
                        <th className="py-3 px-4">Received Date</th>
                        <th className="py-3 px-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {contacts.map((cont) => (
                        <tr key={cont.id} className="hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="font-bold text-gray-900">{cont.name}</div>
                            <div className="text-[11px] text-gray-400 font-mono mt-0.5">{cont.email} • {cont.phone || 'N/A'}</div>
                          </td>
                          <td className="py-4 px-4 font-semibold text-[#1F5E2E]">{cont.subject}</td>
                          <td className="py-4 px-4 text-xs text-gray-600 max-w-xs whitespace-pre-line" title={cont.message}>
                            {cont.message}
                          </td>
                          <td className="py-4 px-4 text-xs text-gray-400 font-mono">
                            {new Date(cont.date).toLocaleString()}
                          </td>
                          <td className="py-4 px-4">
                            <button
                              onClick={() => handleContactDelete(cont.id)}
                              className="text-red-500 hover:text-red-700 p-1.5 rounded hover:bg-red-50 cursor-pointer"
                              title="Delete enquiry"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {contacts.length === 0 && (
                    <p className="py-8 text-center text-gray-400 font-bold uppercase tracking-wider text-xs">No contact inquiries registered.</p>
                  )}
                </div>
              </div>
            )}

            {/* --- SYSTEM SETTINGS TAB --- */}
            {activeTab === 'settings' && (
              <div className="max-w-4xl mx-auto" id="settings-tab">
                <form onSubmit={handleSettingsSave} className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-8 text-left">
                  <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
                    <h3 className="text-xl font-black text-[#1F5E2E] flex items-center gap-1.5">
                      <Settings size={24} className="text-[#6BBF3A]" />
                      <span>{isBangla ? 'সিস্টেম সেটিংস ও পৃষ্ঠা এডিটর' : 'System Settings & Page Editor'}</span>
                    </h3>
                    <p className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">
                      {isBangla ? 'সমস্ত তথ্য পরিবর্তনযোগ্য' : 'Full Content Control'}
                    </p>
                  </div>

                  {/* SECTION 1: GENERAL BRANDING */}
                  <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-200/50 space-y-4">
                    <h4 className="text-sm font-black text-[#1F5E2E] uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#6BBF3A]" />
                      {isBangla ? '১. সাধারণ ব্র্যান্ডিং' : '1. General Branding'}
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1.5 md:col-span-1">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Organization Name</label>
                        <input
                          type="text"
                          value={setOrgName}
                          onChange={(e) => setSetOrgName(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800 font-bold"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 md:col-span-1">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tagline (EN)</label>
                        <input
                          type="text"
                          value={setTagline}
                          onChange={(e) => setSetTagline(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 md:col-span-1">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tagline (BN)</label>
                        <input
                          type="text"
                          value={setTaglineBn}
                          onChange={(e) => setSetTaglineBn(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: CONTACT DETAILS */}
                  <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-200/50 space-y-4">
                    <h4 className="text-sm font-black text-[#1F5E2E] uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#6BBF3A]" />
                      {isBangla ? '২. যোগাযোগের তথ্য ও ফুটার' : '2. Contact & Footer Details'}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Hotline Phone</label>
                        <input
                          type="text"
                          value={setPhone}
                          onChange={(e) => setSetPhone(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800 font-mono font-bold"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Hotline Email</label>
                        <input
                          type="email"
                          value={setEmail}
                          onChange={(e) => setSetEmail(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">HQ Address (EN)</label>
                        <input
                          type="text"
                          value={setAddress}
                          onChange={(e) => setSetAddress(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">HQ Address (BN)</label>
                        <input
                          type="text"
                          value={setAddressBn}
                          onChange={(e) => setSetAddressBn(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: HOME PAGE HERO */}
                  <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-200/50 space-y-4">
                    <h4 className="text-sm font-black text-[#1F5E2E] uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#6BBF3A]" />
                      {isBangla ? '৩. হোম পেজ হিরো সেকশন' : '3. Home Page Hero & Story'}
                    </h4>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <ImageUploadInput
                          label="Hero Background Image"
                          value={setHeroImgUrl}
                          onChange={setSetHeroImgUrl}
                          placeholder="https://images.unsplash.com/..."
                          filenamePrefix="hero"
                          isBangla={isBangla}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Hero Badge Tagline (EN)</label>
                          <input
                            type="text"
                            value={setHeroTagline}
                            onChange={(e) => setSetHeroTagline(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Hero Badge Tagline (BN)</label>
                          <input
                            type="text"
                            value={setHeroTaglineBn}
                            onChange={(e) => setSetHeroTaglineBn(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Hero Display Title (EN)</label>
                          <input
                            type="text"
                            value={setHeroTitle}
                            onChange={(e) => setSetHeroTitle(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800 font-bold"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Hero Display Title (BN)</label>
                          <input
                            type="text"
                            value={setHeroTitleBn}
                            onChange={(e) => setSetHeroTitleBn(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800 font-bold"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Hero Brief Bio (EN)</label>
                          <textarea
                            rows={3}
                            value={setHeroBio}
                            onChange={(e) => setSetHeroBio(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-gray-800 resize-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Hero Brief Bio (BN)</label>
                          <textarea
                            rows={3}
                            value={setHeroBioBn}
                            onChange={(e) => setSetHeroBioBn(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-gray-800 resize-none"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Home About Section Intro (EN)</label>
                          <textarea
                            rows={3}
                            value={setAboutText}
                            onChange={(e) => setSetAboutText(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-gray-800 resize-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Home About Section Intro (BN)</label>
                          <textarea
                            rows={3}
                            value={setAboutTextBn}
                            onChange={(e) => setSetAboutTextBn(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-gray-800 resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 4: ABOUT PAGE DETAILED CONTENT */}
                  <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-200/50 space-y-4">
                    <h4 className="text-sm font-black text-[#1F5E2E] uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#6BBF3A]" />
                      {isBangla ? '৪. আমাদের সম্পর্কে পৃষ্ঠা বিবরণ' : '4. About Us Page Sections'}
                    </h4>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Establishment Story P1 (EN)</label>
                          <textarea
                            rows={3}
                            value={setAboutStory1}
                            onChange={(e) => setSetAboutStory1(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-gray-800 resize-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Establishment Story P1 (BN)</label>
                          <textarea
                            rows={3}
                            value={setAboutStory1Bn}
                            onChange={(e) => setSetAboutStory1Bn(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-gray-800 resize-none"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Establishment Story P2 (EN)</label>
                          <textarea
                            rows={3}
                            value={setAboutStory2}
                            onChange={(e) => setSetAboutStory2(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-gray-800 resize-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Establishment Story P2 (BN)</label>
                          <textarea
                            rows={3}
                            value={setAboutStory2Bn}
                            onChange={(e) => setSetAboutStory2Bn(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-gray-800 resize-none"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Core Mission (EN)</label>
                          <textarea
                            rows={3}
                            value={setAboutMission}
                            onChange={(e) => setSetAboutMission(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-gray-800 resize-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Core Mission (BN)</label>
                          <textarea
                            rows={3}
                            value={setAboutMissionBn}
                            onChange={(e) => setSetAboutMissionBn(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-gray-800 resize-none"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Core Vision (EN)</label>
                          <textarea
                            rows={3}
                            value={setAboutVision}
                            onChange={(e) => setSetAboutVision(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-gray-800 resize-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Core Vision (BN)</label>
                          <textarea
                            rows={3}
                            value={setAboutVisionBn}
                            onChange={(e) => setSetAboutVisionBn(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-gray-800 resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 5: PROJECTS TARGET COUNTERS */}
                  <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-200/50 space-y-4">
                    <h4 className="text-sm font-black text-[#1F5E2E] uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#6BBF3A]" />
                      {isBangla ? '৫. প্রজেক্টস লাইভ কাউন্টার স্ট্যাটস' : '5. Project Impact Target Numbers'}
                    </h4>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Trees Planted</label>
                        <input
                          type="number"
                          value={setStatTreesTarget}
                          onChange={(e) => setSetStatTreesTarget(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800 font-mono font-bold"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Powered Villages</label>
                        <input
                          type="number"
                          value={setStatVillagesTarget}
                          onChange={(e) => setSetStatVillagesTarget(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800 font-mono font-bold"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Active Volunteers</label>
                        <input
                          type="number"
                          value={setStatVolunteersTarget}
                          onChange={(e) => setSetStatVolunteersTarget(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800 font-mono font-bold"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Water Projects</label>
                        <input
                          type="number"
                          value={setStatWaterTarget}
                          onChange={(e) => setSetStatWaterTarget(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800 font-mono font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 6: PAYMENT WALLETS */}
                  <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-200/50 space-y-4">
                    <h4 className="text-sm font-black text-[#1F5E2E] uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#6BBF3A]" />
                      {isBangla ? '৬. পেমেন্ট ওয়ালেট নম্বর সমূহ' : '6. Get Involved Donation Wallets'}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">bKash Merchant/Personal No.</label>
                        <input
                          type="text"
                          value={setBkashNo}
                          onChange={(e) => setSetBkashNo(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800 font-mono font-bold"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Nagad Wallet No.</label>
                        <input
                          type="text"
                          value={setNagadNo}
                          onChange={(e) => setSetNagadNo(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800 font-mono font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 7: SECURITY CREDENTIALS */}
                  <div className="bg-[#FEF2F2] rounded-2xl p-6 border border-red-100 space-y-4">
                    <h4 className="text-sm font-black text-red-800 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      {isBangla ? '৭. নিরাপত্তা পাসওয়ার্ড পরিবর্তন' : '7. Admin Security Credentials'}
                    </h4>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-red-600 uppercase tracking-wider">Update Admin Password</label>
                      <input
                        type="password"
                        value={setNewPassword}
                        onChange={(e) => setSetNewPassword(e.target.value)}
                        placeholder="Leave blank to keep current password"
                        className="w-full bg-white border border-red-200 rounded-xl py-2 px-3 text-xs text-gray-800"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button
                      type="submit"
                      className="py-3.5 px-8 bg-[#1F5E2E] hover:bg-[#2E7D32] text-white rounded-full text-xs font-black cursor-pointer shadow hover:shadow-lg transition-all uppercase tracking-wider"
                    >
                      {isBangla ? 'কনফিগারেশন সংরক্ষণ করুন' : 'Save Complete Configuration'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Custom Confirmation Modal */}
      <AnimatePresence>
        {confirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmModal(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="relative w-full max-w-md bg-white border border-gray-100 rounded-3xl p-6 shadow-2xl z-10 text-left font-sans"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-50 text-red-500 rounded-2xl shrink-0">
                  <Trash2 size={24} className="stroke-[2.5]" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-extrabold text-gray-900 leading-snug">
                    {confirmModal.title}
                  </h4>
                  <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                    {confirmModal.message}
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setConfirmModal(null)}
                  className="py-2.5 px-5 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-full text-xs font-bold transition-all cursor-pointer"
                >
                  {isBangla ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    confirmModal.onConfirm();
                  }}
                  className="py-2.5 px-6 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-bold transition-all cursor-pointer shadow hover:shadow-lg"
                >
                  {isBangla ? 'মুছে ফেলুন' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
