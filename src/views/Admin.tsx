import React, { useState, useEffect, Component } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, LayoutDashboard, Trees, BookOpen, Users, Heart, Image as ImageIcon, 
  Mail, Settings, Plus, Edit, Trash2, LogOut, Search, Check, X, Phone, MapPin, 
  Eye, FileText, Download, ShieldCheck, Globe, MessageSquare, Award, Flag, Megaphone,
  Clock, Calendar
} from 'lucide-react';
import { Project, BlogPost, TeamMember, GalleryItem, Testimonial } from '../types';
import GreenHeroAdmin from '../components/GreenHeroAdmin';

class AdminTabErrorBoundary extends Component<
  { children: React.ReactNode; tabName: string },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; tabName: string }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("AdminTabErrorBoundary caught an error in tab:", this.props.tabName, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center max-w-2xl mx-auto my-12 shadow-sm space-y-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600 font-bold text-lg">!</div>
          <h3 className="text-lg font-black text-red-800">Something went wrong rendering the "{this.props.tabName}" tab</h3>
          <p className="text-xs text-red-600 font-semibold bg-white py-2 px-4 rounded-xl border border-red-100 inline-block">
            {this.state.error?.name}: {this.state.error?.message || "Unknown rendering error"}
          </p>
          <pre className="text-[10px] font-mono text-left bg-red-100/50 p-4 rounded-xl overflow-x-auto text-red-700 max-h-40">
            {this.state.error?.stack}
          </pre>
          <div>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-full text-xs cursor-pointer transition-colors"
            >
              Reload Tab View
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
import ImageUploadInput from '../components/ImageUploadInput';

interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  date: string;
  location?: string;
  bloodGroup?: string;
  profession?: string;
  availability?: string;
  membership?: string;
}

interface Donation {
  id: string;
  name: string;
  email: string;
  amount: number;
  paymentMethod: string;
  method?: string;
  status: string;
  transId: string;
  transactionId?: string;
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
  membershipFormUrl?: string;
  aboutHeroLabel?: string;
  aboutHeroLabelBn?: string;
  aboutHeroTitle?: string;
  aboutHeroTitleBn?: string;
  aboutHeroSub?: string;
  aboutHeroSubBn?: string;
  aboutStoryTitle?: string;
  aboutStoryTitleBn?: string;
  aboutPrinciplesLabel?: string;
  aboutPrinciplesLabelBn?: string;
  aboutPrinciplesTitle?: string;
  aboutPrinciplesTitleBn?: string;
  aboutMilestonesLabel?: string;
  aboutMilestonesLabelBn?: string;
  aboutMilestonesTitle?: string;
  aboutMilestonesTitleBn?: string;
  aboutTeamLabel?: string;
  aboutTeamLabelBn?: string;
  aboutTeamTitle?: string;
  aboutTeamTitleBn?: string;
}

type AdminTab = 'dashboard' | 'projects' | 'blogs' | 'volunteers' | 'donations' | 'team' | 'gallery' | 'testimonials' | 'subscribers' | 'contacts' | 'settings' | 'corevalues' | 'milestones' | 'popup' | 'green-hero';

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
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [settings, setSettings] = useState<OrgSettings | null>(null);

  // Search filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [volSearchTerm, setVolSearchTerm] = useState('');
  const [volFilterInterest, setVolFilterInterest] = useState('all');
  const [volFilterMembership, setVolFilterMembership] = useState('all');
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);

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
  const [projCategory, setProjCategory] = useState<string>('plantation');
  const [customCategory, setCustomCategory] = useState('');
  const [customCategoryBn, setCustomCategoryBn] = useState('');
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

  // 4b. Testimonials Form Fields
  const [testQuote, setTestQuote] = useState('');
  const [testQuoteBn, setTestQuoteBn] = useState('');
  const [testAuthor, setTestAuthor] = useState('');
  const [testAuthorBn, setTestAuthorBn] = useState('');
  const [testRole, setTestRole] = useState('');
  const [testRoleBn, setTestRoleBn] = useState('');
  const [testLocation, setTestLocation] = useState('');
  const [testLocationBn, setTestLocationBn] = useState('');

  // 5. Settings Form Fields
  const [setOrgName, setSetOrgName] = useState('');
  const [setTagline, setSetTagline] = useState('');
  const [setTaglineBn, setSetTaglineBn] = useState('');
  const [setPhone, setSetPhone] = useState('');
  const [setEmail, setSetEmail] = useState('');
  const [setAddress, setSetAddress] = useState('');
  const [setAddressBn, setSetAddressBn] = useState('');
  const [setNewPassword, setSetNewPassword] = useState('');
  const [setLogoUrl, setSetLogoUrl] = useState('');

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

  // New About page headers and labels state variables
  const [setAboutHeroLabel, setSetAboutHeroLabel] = useState('');
  const [setAboutHeroLabelBn, setSetAboutHeroLabelBn] = useState('');
  const [setAboutHeroTitle, setSetAboutHeroTitle] = useState('');
  const [setAboutHeroTitleBn, setSetAboutHeroTitleBn] = useState('');
  const [setAboutHeroSub, setSetAboutHeroSub] = useState('');
  const [setAboutHeroSubBn, setSetAboutHeroSubBn] = useState('');
  const [setAboutStoryTitle, setSetAboutStoryTitle] = useState('');
  const [setAboutStoryTitleBn, setSetAboutStoryTitleBn] = useState('');
  const [setAboutPrinciplesLabel, setSetAboutPrinciplesLabel] = useState('');
  const [setAboutPrinciplesLabelBn, setSetAboutPrinciplesLabelBn] = useState('');
  const [setAboutPrinciplesTitle, setSetAboutPrinciplesTitle] = useState('');
  const [setAboutPrinciplesTitleBn, setSetAboutPrinciplesTitleBn] = useState('');
  const [setAboutMilestonesLabel, setSetAboutMilestonesLabel] = useState('');
  const [setAboutMilestonesLabelBn, setSetAboutMilestonesLabelBn] = useState('');
  const [setAboutMilestonesTitle, setSetAboutMilestonesTitle] = useState('');
  const [setAboutMilestonesTitleBn, setSetAboutMilestonesTitleBn] = useState('');
  const [setAboutTeamLabel, setSetAboutTeamLabel] = useState('');
  const [setAboutTeamLabelBn, setSetAboutTeamLabelBn] = useState('');
  const [setAboutTeamTitle, setSetAboutTeamTitle] = useState('');
  const [setAboutTeamTitleBn, setSetAboutTeamTitleBn] = useState('');

  // Footer Fields
  const [footerAboutText, setFooterAboutText] = useState('');
  const [footerAboutTextBn, setFooterAboutTextBn] = useState('');
  const [footerFbUrl, setFooterFbUrl] = useState('');
  const [footerInstaUrl, setFooterInstaUrl] = useState('');
  const [footerLinkedinUrl, setFooterLinkedinUrl] = useState('');
  const [footerYoutubeUrl, setFooterYoutubeUrl] = useState('');
  const [footerNewsletterTitle, setFooterNewsletterTitle] = useState('');
  const [footerNewsletterTitleBn, setFooterNewsletterTitleBn] = useState('');
  const [footerNewsletterDesc, setFooterNewsletterDesc] = useState('');
  const [footerNewsletterDescBn, setFooterNewsletterDescBn] = useState('');
  const [footerCopyright, setFooterCopyright] = useState('');
  const [footerCopyrightBn, setFooterCopyrightBn] = useState('');

  // 6. Dynamic Event Notice Popup Settings
  const [popupEnabled, setPopupEnabled] = useState(false);
  const [popupTitle, setPopupTitle] = useState('');
  const [popupTitleBn, setPopupTitleBn] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [popupMessageBn, setPopupMessageBn] = useState('');
  const [popupLinkText, setPopupLinkText] = useState('');
  const [popupLinkTextBn, setPopupLinkTextBn] = useState('');
  const [popupLinkUrl, setPopupLinkUrl] = useState('');
  const [popupImageUrl, setPopupImageUrl] = useState('');

  // Milestones and Core Values dataset list states
  const [milestonesList, setMilestonesList] = useState<any[]>([]);
  const [coreValuesList, setCoreValuesList] = useState<any[]>([]);

  // Milestone Form Fields
  const [mileYear, setMileYear] = useState('');
  const [mileYearBn, setMileYearBn] = useState('');
  const [mileTitle, setMileTitle] = useState('');
  const [mileTitleBn, setMileTitleBn] = useState('');
  const [mileDesc, setMileDesc] = useState('');
  const [mileDescBn, setMileDescBn] = useState('');

  // Core Value Form Fields
  const [valTitle, setValTitle] = useState('');
  const [valTitleBn, setValTitleBn] = useState('');
  const [valDesc, setValDesc] = useState('');
  const [valDescBn, setValDescBn] = useState('');
  const [valIconName, setValIconName] = useState('Leaf');

  // Focus Areas Form Fields
  const [focusAreasList, setFocusAreasList] = useState<any[]>([]);
  const [focusTitle, setFocusTitle] = useState('');
  const [focusTitleBn, setFocusTitleBn] = useState('');
  const [focusDesc, setFocusDesc] = useState('');
  const [focusDescBn, setFocusDescBn] = useState('');
  const [focusIconName, setFocusIconName] = useState('Trees');
  const [focusColor, setFocusColor] = useState('emerald');
  const [focusSubTab, setFocusSubTab] = useState<'values' | 'focus'>('values');

  // Payment details state variables
  const [setBkashNo, setSetBkashNo] = useState('');
  const [setNagadNo, setSetNagadNo] = useState('');
  const [setMembershipFormUrl, setSetMembershipFormUrl] = useState('');

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
        resVols, resDons, resSubs, resContacts, resSettings, resTests,
        resMilestones, resCoreValues, resFocusAreas
      ] = await Promise.all([
        fetch('/api/projects').then((r) => r.json()).catch(() => []),
        fetch('/api/blogs').then((r) => r.json()).catch(() => []),
        fetch('/api/team').then((r) => r.json()).catch(() => []),
        fetch('/api/gallery').then((r) => r.json()).catch(() => []),
        fetch('/api/volunteers').then((r) => r.json()).catch(() => []),
        fetch('/api/donations').then((r) => r.json()).catch(() => []),
        fetch('/api/subscribers').then((r) => r.json()).catch(() => []),
        fetch('/api/contacts').then((r) => r.json()).catch(() => []),
        fetch('/api/settings').then((r) => r.json()).catch(() => ({})),
        fetch('/api/testimonials').then((r) => r.json()).catch(() => []),
        fetch('/api/milestones').then((r) => r.json()).catch(() => []),
        fetch('/api/corevalues').then((r) => r.json()).catch(() => []),
        fetch('/api/focusareas').then((r) => r.json()).catch(() => [])
      ]);

      // Try to silently sync local data to server first
      try {
        // 1. Sync Volunteers
        const savedVols = localStorage.getItem('volunteers');
        const currentVols = savedVols ? JSON.parse(savedVols) : [];
        if (Array.isArray(currentVols)) {
          const localOnly = currentVols.filter(v => v && String(v.id).startsWith('VOL-LOCAL-'));
          for (const vol of localOnly) {
            const { id, ...cleanVol } = vol;
            await fetch('/api/volunteers', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(cleanVol)
            });
          }
        }
      } catch (e) {}

      try {
        // 2. Sync Donations
        const savedDons = localStorage.getItem('donations');
        const currentDons = savedDons ? JSON.parse(savedDons) : [];
        if (Array.isArray(currentDons)) {
          const localOnly = currentDons.filter(d => d && String(d.id).startsWith('DON-LOCAL-'));
          for (const don of localOnly) {
            const { id, ...cleanDon } = don;
            await fetch('/api/donations', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(cleanDon)
            });
          }
        }
      } catch (e) {}

      try {
        // 3. Sync Contacts
        const savedContacts = localStorage.getItem('contacts');
        const currentContacts = savedContacts ? JSON.parse(savedContacts) : [];
        if (Array.isArray(currentContacts)) {
          const localOnly = currentContacts.filter(c => c && String(c.id).startsWith('CON-LOCAL-'));
          for (const contact of localOnly) {
            const { id, ...cleanContact } = contact;
            await fetch('/api/contacts', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(cleanContact)
            });
          }
        }
      } catch (e) {}

      try {
        // 4. Sync Subscribers
        const savedSubs = localStorage.getItem('subscribers');
        const currentSubs = savedSubs ? JSON.parse(savedSubs) : [];
        if (Array.isArray(currentSubs)) {
          for (const email of currentSubs) {
            await fetch('/api/subscribers', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email })
            });
          }
        }
      } catch (e) {}

      setProjects(resProj);
      setBlogs(resBlogs);
      setTeam(resTeam);
      setGallery(resGallery);
      setTestimonials(resTests);

      // Merge Volunteers
      const localVolsRaw = localStorage.getItem('volunteers');
      let localVols: any[] = [];
      try {
        localVols = localVolsRaw ? JSON.parse(localVolsRaw) : [];
        if (!Array.isArray(localVols)) localVols = [];
      } catch {}
      const mergedVolsMap = new Map();
      localVols.forEach(v => {
        if (v && (v.email || v.phone)) mergedVolsMap.set(v.email || v.phone, v);
      });
      const validVols = Array.isArray(resVols) ? resVols : [];
      validVols.forEach(v => {
        if (v && (v.email || v.phone)) mergedVolsMap.set(v.email || v.phone, v);
      });
      const finalVols = Array.from(mergedVolsMap.values());
      setVolunteers(finalVols);
      localStorage.setItem('volunteers', JSON.stringify(finalVols));

      // Merge Donations
      const localDonsRaw = localStorage.getItem('donations');
      let localDons: any[] = [];
      try {
        localDons = localDonsRaw ? JSON.parse(localDonsRaw) : [];
        if (!Array.isArray(localDons)) localDons = [];
      } catch {}
      const mergedDonsMap = new Map();
      localDons.forEach((d, idx) => {
        const key = d.id || d.transactionId || `local-don-${idx}`;
        mergedDonsMap.set(key, d);
      });
      const validDons = Array.isArray(resDons) ? resDons : [];
      validDons.forEach((d, idx) => {
        const key = d.id || d.transactionId || `server-don-${idx}`;
        mergedDonsMap.set(key, d);
      });
      const finalDons = Array.from(mergedDonsMap.values());
      setDonations(finalDons);
      localStorage.setItem('donations', JSON.stringify(finalDons));

      // Merge Subscribers
      const localSubsRaw = localStorage.getItem('subscribers');
      let localSubs: any[] = [];
      try {
        localSubs = localSubsRaw ? JSON.parse(localSubsRaw) : [];
        if (!Array.isArray(localSubs)) localSubs = [];
      } catch {}
      const mergedSubsSet = new Set([...localSubs, ...(Array.isArray(resSubs) ? resSubs : [])]);
      const finalSubs = Array.from(mergedSubsSet);
      setSubscribers(finalSubs);
      localStorage.setItem('subscribers', JSON.stringify(finalSubs));

      // Merge Contacts
      const localContactsRaw = localStorage.getItem('contacts');
      let localContacts: any[] = [];
      try {
        localContacts = localContactsRaw ? JSON.parse(localContactsRaw) : [];
        if (!Array.isArray(localContacts)) localContacts = [];
      } catch {}
      const mergedContactsMap = new Map();
      localContacts.forEach((c, idx) => {
        const key = c.id || `local-con-${idx}`;
        mergedContactsMap.set(key, c);
      });
      const validContacts = Array.isArray(resContacts) ? resContacts : [];
      validContacts.forEach((c, idx) => {
        const key = c.id || `server-con-${idx}`;
        mergedContactsMap.set(key, c);
      });
      const finalContacts = Array.from(mergedContactsMap.values());
      setContacts(finalContacts);
      localStorage.setItem('contacts', JSON.stringify(finalContacts));

      setSettings(resSettings);
      setMilestonesList(Array.isArray(resMilestones) ? resMilestones : []);
      setCoreValuesList(Array.isArray(resCoreValues) ? resCoreValues : []);
      setFocusAreasList(Array.isArray(resFocusAreas) ? resFocusAreas : []);

      // Seed settings inputs
      if (resSettings) {
        setSetOrgName(resSettings.orgName || 'Green Earth');
        setSetTagline(resSettings.tagline || 'Cleaner, Greener & Sustainable Future');
        setSetTaglineBn(resSettings.taglineBn || 'পরিচ্ছন্ন, সবুজ ও টেকসই ভবিষ্যৎ');
        setSetPhone(resSettings.phone || '+880 1712-345678');
        setSetEmail(resSettings.email || 'info@greenearth-bd.org');
        setSetAddress(resSettings.address || '42, Road 11, Banani, Dhaka-1213, Bangladesh.');
        setSetAddressBn(resSettings.addressBn || '৪২, রোড ১১, বনানী, ঢাকা-১২১৩, বাংলাদেশ।');
        setSetLogoUrl(resSettings.logoUrl || '');
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
        setSetMembershipFormUrl(resSettings.membershipFormUrl || 'https://forms.gle/51Kt57CfRuAnAGy88');

        // New About Page Headers Seeding
        setSetAboutHeroLabel(resSettings.aboutHeroLabel || 'Who We Are');
        setSetAboutHeroLabelBn(resSettings.aboutHeroLabelBn || 'আমাদের পরিচয়');
        setSetAboutHeroTitle(resSettings.aboutHeroTitle || 'Our Story, Mission & Values');
        setSetAboutHeroTitleBn(resSettings.aboutHeroTitleBn || 'আমাদের গল্প ও শক্তি');
        setSetAboutHeroSub(resSettings.aboutHeroSub || 'Empowering local custodians to combat sea level rise, manage single-use waste, and establish off-grid solar-powered schools.');
        setSetAboutHeroSubBn(resSettings.aboutHeroSubBn || 'গ্রিন আর্থ হলো স্থানীয় সম্প্রদায়ের নেতৃত্বাধীন পরিবেশ উন্নয়নমূলক জোট, যা মাঠ পর্যায়ে সবুজ রূপান্তর আনয়ন করছে।');
        setSetAboutStoryTitle(resSettings.aboutStoryTitle || 'How We Started');
        setSetAboutStoryTitleBn(resSettings.aboutStoryTitleBn || 'আমাদের প্রতিষ্ঠার প্রেক্ষাপট');
        setSetAboutPrinciplesLabel(resSettings.aboutPrinciplesLabel || 'Our Principles');
        setSetAboutPrinciplesLabelBn(resSettings.aboutPrinciplesLabelBn || 'আমাদের আদর্শ');
        setSetAboutPrinciplesTitle(resSettings.aboutPrinciplesTitle || 'Our Core Organizational Values');
        setSetAboutPrinciplesTitleBn(resSettings.aboutPrinciplesTitleBn || 'যে মূল্যবোধের ওপর আমরা দাঁড়িয়ে');
        setSetAboutMilestonesLabel(resSettings.aboutMilestonesLabel || 'Our Milestones');
        setSetAboutMilestonesLabelBn(resSettings.aboutMilestonesLabelBn || 'আমাদের অর্জন');
        setSetAboutMilestonesTitle(resSettings.aboutMilestonesTitle || 'The Milestones of Our Journey');
        setSetAboutMilestonesTitleBn(resSettings.aboutMilestonesTitleBn || 'আজ পর্যন্ত আমাদের পথচলা');
        setSetAboutTeamLabel(resSettings.aboutTeamLabel || 'Our Team Leaders');
        setSetAboutTeamLabelBn(resSettings.aboutTeamLabelBn || 'আমাদের অভিভাবক');
        setSetAboutTeamTitle(resSettings.aboutTeamTitle || 'The Visionaries Behind Green Earth');
        setSetAboutTeamTitleBn(resSettings.aboutTeamTitleBn || 'সবুজ আন্দোলনের পেছনের মুখ');

        // Seed Footer Settings
        setFooterAboutText(resSettings.footerAboutText || 'Green Earth is a grassroots, non-profit environmental organization based in Bangladesh, driving sustainable reforestation, solar transition, and water safety.');
        setFooterAboutTextBn(resSettings.footerAboutTextBn || 'গ্রিন আর্থ হলো বাংলাদেশে জলবায়ু পরিবর্তনের ক্ষতিকর প্রভাব মোকাবিলা ও পরিবেশ সংরক্ষণে নিয়োজিত একটি তৃণমূল সামাজিক সংস্থা।');
        setFooterFbUrl(resSettings.footerFbUrl || 'https://www.facebook.com/greenearthbd.25/');
        setFooterInstaUrl(resSettings.footerInstaUrl || 'https://instagram.com');
        setFooterLinkedinUrl(resSettings.footerLinkedinUrl || 'https://linkedin.com');
        setFooterYoutubeUrl(resSettings.footerYoutubeUrl || 'https://youtube.com');
        setFooterNewsletterTitle(resSettings.footerNewsletterTitle || 'Subscribe to Eco-News');
        setFooterNewsletterTitleBn(resSettings.footerNewsletterTitleBn || 'নিউজলেটার সাবস্ক্রাইব');
        setFooterNewsletterDesc(resSettings.footerNewsletterDesc || 'Sign up to receive timely updates on planting drives, solar microgrid operations, and ecological guidelines in Bangladesh.');
        setFooterNewsletterDescBn(resSettings.footerNewsletterDescBn || 'নতুন প্রকল্প ও বৃক্ষরোপণ অভিযানের খবরাখবর সবার আগে জানতে আপনার ইমেইল দিয়ে সংযুক্ত থাকুন।');
        setFooterCopyright(resSettings.footerCopyright || '© 2026 Green Earth Bangladesh. All Rights Reserved.');
        setFooterCopyrightBn(resSettings.footerCopyrightBn || '© ২০২৬ গ্রিন আর্থ বাংলাদেশ। সর্বস্বত্ব সংরক্ষিত।');

        setPopupEnabled(resSettings.popupEnabled ?? false);
        setPopupTitle(resSettings.popupTitle || '');
        setPopupTitleBn(resSettings.popupTitleBn || '');
        setPopupMessage(resSettings.popupMessage || '');
        setPopupMessageBn(resSettings.popupMessageBn || '');
        setPopupLinkText(resSettings.popupLinkText || '');
        setPopupLinkTextBn(resSettings.popupLinkTextBn || '');
        setPopupLinkUrl(resSettings.popupLinkUrl || '');
        setPopupImageUrl(resSettings.popupImageUrl || '');
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

    const finalCategory = projCategory === 'custom' 
      ? customCategory.trim().toLowerCase().replace(/[^a-z0-9]/g, '_') 
      : projCategory;
    const finalCategoryLabel = projCategory === 'custom' 
      ? customCategory.trim() 
      : (categories[projCategory] || projCategory);
    const finalCategoryLabelBn = projCategory === 'custom' 
      ? customCategoryBn.trim() 
      : (categoriesBn[projCategory] || projCategory);

    const payload = {
      id: editingId || undefined,
      title: projTitle,
      titleBn: projTitleBn,
      category: finalCategory,
      categoryLabel: finalCategoryLabel,
      categoryLabelBn: finalCategoryLabelBn,
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
    
    const isPredefined = ['plantation', 'renewable', 'water', 'waste', 'awareness'].includes(p.category);
    if (isPredefined) {
      setProjCategory(p.category);
      setCustomCategory('');
      setCustomCategoryBn('');
    } else {
      setProjCategory('custom');
      setCustomCategory(p.categoryLabel || p.category);
      setCustomCategoryBn(p.categoryLabelBn || p.category);
    }

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
    setCustomCategory('');
    setCustomCategoryBn('');
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

  // 4b. TESTIMONIAL CRUD
  const handleTestimonialSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      id: editingId || undefined,
      quote: testQuote,
      quoteBn: testQuoteBn,
      author: testAuthor,
      authorBn: testAuthorBn,
      role: testRole,
      roleBn: testRoleBn,
      location: testLocation,
      locationBn: testLocationBn
    };

    try {
      const url = editingId ? `/api/testimonials/${editingId}` : '/api/testimonials';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setIsEditing(false);
        setEditingId(null);
        clearTestimonialForm();
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTestimonialEdit = (t: Testimonial) => {
    setEditingId(t.id);
    setTestQuote(t.quote);
    setTestQuoteBn(t.quoteBn);
    setTestAuthor(t.author);
    setTestAuthorBn(t.authorBn);
    setTestRole(t.role);
    setTestRoleBn(t.roleBn);
    setTestLocation(t.location);
    setTestLocationBn(t.locationBn);
    setIsEditing(true);
  };

  const handleTestimonialDelete = (id: string) => {
    setConfirmModal({
      title: isBangla ? 'মন্তব্য মুছে ফেলা নিশ্চিত করুন' : 'Confirm Testimonial Deletion',
      message: isBangla 
        ? 'আপনি কি নিশ্চিতভাবে এই মন্তব্যটি মুছে ফেলতে চান? এটি পুনরায় ফিরিয়ে আনা সম্ভব নয়।' 
        : 'Are you sure you want to delete this testimonial? This action cannot be undone.',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
          if (res.ok) fetchAllData();
        } catch (err) {
          console.error(err);
        }
        setConfirmModal(null);
      }
    });
  };

  const clearTestimonialForm = () => {
    setTestQuote('');
    setTestQuoteBn('');
    setTestAuthor('');
    setTestAuthorBn('');
    setTestRole('');
    setTestRoleBn('');
    setTestLocation('');
    setTestLocationBn('');
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

  const handleUpdateVolunteerStatus = async (id: string, newMembership: string) => {
    try {
      const res = await fetch(`/api/volunteers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ membership: newMembership, membershipStatus: newMembership }),
      });
      if (res.ok) {
        // Update local state
        setVolunteers(prev => prev.map(v => v.id === id ? { ...v, membership: newMembership, membershipStatus: newMembership } : v));
        // Update selected volunteer
        if (selectedVolunteer && selectedVolunteer.id === id) {
          setSelectedVolunteer(prev => prev ? { ...prev, membership: newMembership, membershipStatus: newMembership } : null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Download Volunteer list as CSV
  const downloadVolunteersCSV = () => {
    if (!Array.isArray(volunteers) || volunteers.length === 0) return;

    // Headers
    const headers = [
      'Name',
      'Email',
      'Phone',
      'Profession',
      'Location/District',
      'Blood Group',
      'Interest Area',
      'Availability',
      'Lifetime Membership Status',
      'Message/Bio',
      'Submission Date'
    ];

    // Helpers to map keys to friendly values
    const getInterestLabel = (interest: string) => {
      switch (interest) {
        case 'plantation': return 'Tree Plantation (Mangrove Belts)';
        case 'renewable': return 'Solar Micro-Grid Electrification';
        case 'water': return 'Arsenic Mitigation & Safe Wells';
        case 'waste': return 'River Cleanup & Waste Management';
        case 'awareness': return 'Environmental School Campaigns';
        default: return interest;
      }
    };

    const getProfessionLabel = (prof?: string) => {
      switch (prof) {
        case 'student': return 'Student';
        case 'job_holder': return 'Job Holder / Professional';
        case 'academician': return 'Teacher / Researcher';
        case 'business': return 'Business Owner';
        case 'other': return 'Other';
        default: return prof || '';
      }
    };

    const getAvailabilityLabel = (avail?: string) => {
      switch (avail) {
        case 'flexible': return 'Flexible / Project-based';
        case 'weekends': return 'Weekends Only';
        case 'weekdays': return 'Weekdays Only';
        case 'fulltime': return 'Full-time Dedication';
        default: return avail || '';
      }
    };

    const getMembershipLabel = (status?: string) => {
      switch (status) {
        case 'submitted_pending': return 'Submitted Google Form';
        case 'already_member': return 'Active Lifetime Member';
        case 'no_intent': return 'Field Volunteer Only';
        default: return 'Field Volunteer Only';
      }
    };

    const rows = volunteers.map(vol => [
      vol.name || '',
      vol.email || '',
      vol.phone || '',
      getProfessionLabel(vol.profession),
      vol.location || '',
      vol.bloodGroup || '',
      getInterestLabel(vol.interest),
      getAvailabilityLabel(vol.availability),
      getMembershipLabel((vol as any).membershipStatus || vol.membership),
      vol.message || '',
      vol.date || ''
    ]);

    // Format into standard CSV row structure with quotes and escaped characters
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    // Create file object blob with UTF-8 BOM to ensure seamless Bangla character rendering in Excel
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `green_earth_volunteers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  const handleUpdateDonationStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/donations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setDonations(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
      }
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
      logoUrl: setLogoUrl,
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
      nagadNo: setNagadNo,
      membershipFormUrl: setMembershipFormUrl,

      aboutHeroLabel: setAboutHeroLabel,
      aboutHeroLabelBn: setAboutHeroLabelBn,
      aboutHeroTitle: setAboutHeroTitle,
      aboutHeroTitleBn: setAboutHeroTitleBn,
      aboutHeroSub: setAboutHeroSub,
      aboutHeroSubBn: setAboutHeroSubBn,
      aboutStoryTitle: setAboutStoryTitle,
      aboutStoryTitleBn: setAboutStoryTitleBn,
      aboutPrinciplesLabel: setAboutPrinciplesLabel,
      aboutPrinciplesLabelBn: setAboutPrinciplesLabelBn,
      aboutPrinciplesTitle: setAboutPrinciplesTitle,
      aboutPrinciplesTitleBn: setAboutPrinciplesTitleBn,
      aboutMilestonesLabel: setAboutMilestonesLabel,
      aboutMilestonesLabelBn: setAboutMilestonesLabelBn,
      aboutMilestonesTitle: setAboutMilestonesTitle,
      aboutMilestonesTitleBn: setAboutMilestonesTitleBn,
      aboutTeamLabel: setAboutTeamLabel,
      aboutTeamLabelBn: setAboutTeamLabelBn,
      aboutTeamTitle: setAboutTeamTitle,
      aboutTeamTitleBn: setAboutTeamTitleBn,

      // Footer settings fields
      footerAboutText: footerAboutText,
      footerAboutTextBn: footerAboutTextBn,
      footerFbUrl: footerFbUrl,
      footerInstaUrl: footerInstaUrl,
      footerLinkedinUrl: footerLinkedinUrl,
      footerYoutubeUrl: footerYoutubeUrl,
      footerNewsletterTitle: footerNewsletterTitle,
      footerNewsletterTitleBn: footerNewsletterTitleBn,
      footerNewsletterDesc: footerNewsletterDesc,
      footerNewsletterDescBn: footerNewsletterDescBn,
      footerCopyright: footerCopyright,
      footerCopyrightBn: footerCopyrightBn,

      // Popup announcement settings fields
      popupEnabled: popupEnabled,
      popupTitle: popupTitle,
      popupTitleBn: popupTitleBn,
      popupMessage: popupMessage,
      popupMessageBn: popupMessageBn,
      popupLinkText: popupLinkText,
      popupLinkTextBn: popupLinkTextBn,
      popupLinkUrl: popupLinkUrl,
      popupImageUrl: popupImageUrl
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
              { tab: 'corevalues', label: 'Manage Core Values', icon: <Award size={18} /> },
              { tab: 'milestones', label: 'Manage Milestones', icon: <Flag size={18} /> },
              { tab: 'gallery', label: 'Manage Gallery', icon: <ImageIcon size={18} /> },
              { tab: 'testimonials', label: 'Manage Testimonials', icon: <MessageSquare size={18} /> },
              { tab: 'subscribers', label: 'Subscribers', icon: <Mail size={18} />, count: subscribers.length },
              { tab: 'contacts', label: 'Contact Inquiries', icon: <FileText size={18} />, count: contacts.length },
              { tab: 'popup', label: 'Announcement Popup', icon: <Megaphone size={18} /> },
              { tab: 'green-hero', label: 'Green Hero Initiative', icon: <Award size={18} /> },
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
              <option value="corevalues">Core Values</option>
              <option value="milestones">Milestones</option>
              <option value="gallery">Gallery</option>
              <option value="testimonials">Testimonials</option>
              <option value="subscribers">Subscribers</option>
              <option value="contacts">Contact submissions</option>
              <option value="popup">Announcement Popup</option>
              <option value="green-hero">Green Hero Initiative</option>
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
            <AdminTabErrorBoundary tabName={activeTab}>
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
                              Via {(don.paymentMethod || 'N/A').toUpperCase()} (TX: {don.transId || 'N/A'})
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
                          onChange={(e) => setProjCategory(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-700"
                        >
                          <option value="plantation">Tree Plantation (বৃক্ষরোপণ)</option>
                          <option value="renewable">Renewable Energy (নবায়নযোগ্য জ্বালানি)</option>
                          <option value="water">Water Conservation (পানি সংরক্ষণ)</option>
                          <option value="waste">Waste & Recycling (বর্জ্য ও রিসাইক্লিং)</option>
                          <option value="awareness">Awareness Campaign (সচেতনতা অভিযান)</option>
                          <option value="custom">Custom Category / কাস্টম ক্যাটাগরি</option>
                        </select>
                      </div>

                      {projCategory === 'custom' && (
                        <>
                          {/* Custom Category EN */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Custom Category Name (EN)</label>
                            <input
                              type="text"
                              value={customCategory}
                              onChange={(e) => setCustomCategory(e.target.value)}
                              placeholder="e.g. Biodiversity Conservation"
                              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-800"
                              required
                            />
                          </div>

                          {/* Custom Category BN */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Custom Category Name (BN)</label>
                            <input
                              type="text"
                              value={customCategoryBn}
                              onChange={(e) => setCustomCategoryBn(e.target.value)}
                              placeholder="যেমন: জীববৈচিত্র্য সংরক্ষণ"
                              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-800"
                              required
                            />
                          </div>
                        </>
                      )}

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
            {activeTab === 'volunteers' && (() => {
              const totalVols = volunteers.length;
              const pendingVols = volunteers.filter(v => v.membership === 'submitted_pending').length;
              const lifetimeMembers = volunteers.filter(v => v.membership === 'already_member').length;
              const fieldOnlyVols = volunteers.filter(v => v.membership === 'no_intent' || !v.membership).length;

              const filteredVolunteers = volunteers.filter((vol) => {
                const matchesSearch = 
                  !volSearchTerm ||
                  vol.name.toLowerCase().includes(volSearchTerm.toLowerCase()) ||
                  vol.email.toLowerCase().includes(volSearchTerm.toLowerCase()) ||
                  vol.phone.includes(volSearchTerm) ||
                  (vol.location && vol.location.toLowerCase().includes(volSearchTerm.toLowerCase())) ||
                  (vol.message && vol.message.toLowerCase().includes(volSearchTerm.toLowerCase()));

                const matchesInterest = volFilterInterest === 'all' || vol.interest === volFilterInterest;
                const matchesMembership = volFilterMembership === 'all' || vol.membership === volFilterMembership;

                return matchesSearch && matchesInterest && matchesMembership;
              });

              return (
                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6" id="volunteers-tab">
                  {/* Top Header Row */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                    <div className="text-left">
                      <h3 className="text-lg font-black text-[#1F5E2E]">
                        {isBangla ? 'স্বেচ্ছাসেবক আবেদনপত্রসমূহ' : 'Volunteer Applications'}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {isBangla 
                          ? `মোট আবেদনকারী: ${volunteers.length} জন` 
                          : `Total Registered Volunteers: ${volunteers.length}`}
                      </p>
                    </div>
                    
                    {volunteers.length > 0 && (
                      <button
                        onClick={downloadVolunteersCSV}
                        className="inline-flex items-center gap-2 bg-[#1F5E2E] hover:bg-[#2E7D32] text-white py-2.5 px-5 rounded-full text-xs font-black cursor-pointer shadow hover:shadow-md transition-all uppercase tracking-wider self-start md:self-center"
                      >
                        <Download size={14} className="stroke-[2.5]" />
                        <span>{isBangla ? 'ডেটা শিট ডাউনলোড করুন (CSV)' : 'Download CSV Sheet'}</span>
                      </button>
                    )}
                  </div>

                  {/* Summary KPI Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Card 1: Total */}
                    <div className="bg-emerald-50/50 border border-emerald-100/80 p-4 rounded-2xl flex items-center gap-3">
                      <div className="p-2.5 bg-emerald-100 text-[#1F5E2E] rounded-xl">
                        <Users size={18} />
                      </div>
                      <div>
                        <div className="text-lg font-extrabold text-[#1F5E2E]">{totalVols}</div>
                        <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
                          {isBangla ? 'মোট স্বেচ্ছাসেবক' : 'Total Volunteers'}
                        </div>
                      </div>
                    </div>

                    {/* Card 2: Lifetime Members */}
                    <div className="bg-blue-50/50 border border-blue-100/80 p-4 rounded-2xl flex items-center gap-3">
                      <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
                        <Award size={18} />
                      </div>
                      <div>
                        <div className="text-lg font-extrabold text-blue-800">{lifetimeMembers}</div>
                        <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
                          {isBangla ? 'আজীবন সদস্য' : 'Lifetime Members'}
                        </div>
                      </div>
                    </div>

                    {/* Card 3: Pending Approval */}
                    <div className="bg-yellow-50/50 border border-yellow-100/80 p-4 rounded-2xl flex items-center gap-3">
                      <div className="p-2.5 bg-yellow-100 text-yellow-700 rounded-xl">
                        <FileText size={18} />
                      </div>
                      <div>
                        <div className="text-lg font-extrabold text-yellow-800">{pendingVols}</div>
                        <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
                          {isBangla ? 'আবেদন পেন্ডিং' : 'Submitted Pending'}
                        </div>
                      </div>
                    </div>

                    {/* Card 4: Field Vols */}
                    <div className="bg-purple-50/50 border border-purple-100/80 p-4 rounded-2xl flex items-center gap-3">
                      <div className="p-2.5 bg-purple-100 text-purple-700 rounded-xl">
                        <Heart size={18} />
                      </div>
                      <div>
                        <div className="text-lg font-extrabold text-purple-800">{fieldOnlyVols}</div>
                        <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
                          {isBangla ? 'ফিল্ড ভলান্টিয়ার' : 'Field Volunteer Only'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Filter & Search Bar */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    {/* Search Field */}
                    <div className="relative md:col-span-6">
                      <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={volSearchTerm}
                        onChange={(e) => setVolSearchTerm(e.target.value)}
                        placeholder={isBangla ? 'নাম, ইমেল, ফোন বা এলাকা দিয়ে খুঁজুন...' : 'Search by name, email, phone, location...'}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#1F5E2E]/20 focus:border-[#1F5E2E] transition-all outline-none"
                      />
                    </div>

                    {/* Interest Dropdown */}
                    <div className="md:col-span-3">
                      <select
                        value={volFilterInterest}
                        onChange={(e) => setVolFilterInterest(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-700 focus:ring-2 focus:ring-[#1F5E2E]/20 focus:border-[#1F5E2E] transition-all outline-none select-hand"
                      >
                        <option value="all">{isBangla ? 'সব ধরণের আগ্রহ' : 'All Campaign Interests'}</option>
                        <option value="plantation">{isBangla ? 'ম্যানগ্রোভ বৃক্ষরোপণ' : 'Mangrove Plantation'}</option>
                        <option value="renewable">{isBangla ? 'সৌর বিদ্যুৎ' : 'Solar Micro-Grids'}</option>
                        <option value="water">{isBangla ? 'বিশুদ্ধ পানি প্ল্যান্ট' : 'Safe Water Plants'}</option>
                        <option value="waste">{isBangla ? 'বর্জ্য অপসারণ' : 'Waste & Cleanup'}</option>
                        <option value="awareness">{isBangla ? 'সচেতনতা ক্যাম্পেইন' : 'School Campaigns'}</option>
                      </select>
                    </div>

                    {/* Membership Dropdown */}
                    <div className="md:col-span-3">
                      <select
                        value={volFilterMembership}
                        onChange={(e) => setVolFilterMembership(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-700 focus:ring-2 focus:ring-[#1F5E2E]/20 focus:border-[#1F5E2E] transition-all outline-none select-hand"
                      >
                        <option value="all">{isBangla ? 'সব সদস্যপদের ধরণ' : 'All Membership Statuses'}</option>
                        <option value="submitted_pending">{isBangla ? 'আবেদন পেন্ডিং' : 'Submitted Form'}</option>
                        <option value="already_member">{isBangla ? 'আজীবন সদস্য' : 'Lifetime Member'}</option>
                        <option value="no_intent">{isBangla ? 'শুধু মাঠ ভলান্টিয়ার' : 'Field Vol Only'}</option>
                      </select>
                    </div>
                  </div>

                  {/* List View / Table Container */}
                  <div className="overflow-x-auto rounded-2xl border border-gray-100">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-mono text-[10px] uppercase font-bold tracking-wider">
                          <th className="py-3.5 px-4">{isBangla ? 'স্বেচ্ছাসেবক' : 'Volunteer Info'}</th>
                          <th className="py-3.5 px-4">{isBangla ? 'পেশা ও এলাকা' : 'Profession & Location'}</th>
                          <th className="py-3.5 px-4">{isBangla ? 'আগ্রহ ও সময়' : 'Interest & Availability'}</th>
                          <th className="py-3.5 px-4">{isBangla ? 'সদস্যপদ' : 'Membership'}</th>
                          <th className="py-3.5 px-4">{isBangla ? 'বার্তা' : 'Intro Message'}</th>
                          <th className="py-3.5 px-4 text-right">{isBangla ? 'অ্যাকশন' : 'Action'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredVolunteers.map((vol) => {
                          const getInterestLabel = (interest: string) => {
                            switch (interest) {
                              case 'plantation': return 'Mangrove Plantation';
                              case 'renewable': return 'Solar Micro-Grids';
                              case 'water': return 'Safe Water Plants';
                              case 'waste': return 'Waste & Cleanup';
                              case 'awareness': return 'School Campaigns';
                              default: return interest;
                            }
                          };

                          const getProfessionLabel = (prof?: string) => {
                            switch (prof) {
                              case 'student': return 'Student';
                              case 'job_holder': return 'Job Holder / Pro';
                              case 'academician': return 'Teacher / Researcher';
                              case 'business': return 'Business Owner';
                              case 'other': return 'Other';
                              default: return prof || '—';
                            }
                          };

                          const getAvailabilityLabel = (avail?: string) => {
                            switch (avail) {
                              case 'flexible': return 'Flexible / Project';
                              case 'weekends': return 'Weekends Only';
                              case 'weekdays': return 'Weekdays Only';
                              case 'fulltime': return 'Full-time Dedication';
                              default: return avail || '—';
                            }
                          };

                          const getMembershipBadge = (status?: string) => {
                            switch (status) {
                              case 'submitted_pending':
                                return (
                                  <span className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-[10px] font-bold px-2 py-1 rounded-full inline-flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                                    Submitted Form
                                  </span>
                                );
                              case 'already_member':
                                return (
                                  <span className="bg-emerald-50 border border-emerald-200 text-[#1F5E2E] text-[10px] font-bold px-2 py-1 rounded-full inline-flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#6BBF3A]"></span>
                                    Lifetime Member
                                  </span>
                                );
                              case 'no_intent':
                              default:
                                return (
                                  <span className="bg-gray-50 border border-gray-200 text-gray-500 text-[10px] font-bold px-2 py-1 rounded-full inline-flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                    Field Vol Only
                                  </span>
                                );
                            }
                          };

                          // Get initial for avatar
                          const initials = vol.name ? vol.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'V';

                          return (
                            <tr key={vol.id} className="hover:bg-gray-50/50 transition-colors text-xs">
                              {/* Volunteer info with initial avatar */}
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1F5E2E]/10 to-[#6BBF3A]/20 text-[#1F5E2E] flex items-center justify-center font-black font-mono text-xs shadow-inner">
                                    {initials}
                                  </div>
                                  <div className="space-y-0.5">
                                    <div className="font-extrabold text-gray-900 text-sm leading-tight hover:text-[#1F5E2E] transition-colors">{vol.name}</div>
                                    <div className="text-gray-400 font-mono text-[10px]">{new Date(vol.date).toLocaleDateString()}</div>
                                  </div>
                                </div>
                              </td>

                              {/* Profession and Area */}
                              <td className="py-4 px-4 space-y-1">
                                <div className="text-gray-700 font-semibold">{getProfessionLabel(vol.profession)}</div>
                                <div className="text-gray-400 flex items-center gap-0.5">
                                  <MapPin size={11} className="text-gray-400" />
                                  <span>{vol.location || '—'}</span>
                                </div>
                              </td>

                              {/* Interest and availability */}
                              <td className="py-4 px-4 space-y-1">
                                <span className="bg-[#1F5E2E]/10 border border-[#1F5E2E]/20 text-[#1F5E2E] text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full inline-block">
                                  {getInterestLabel(vol.interest)}
                                </span>
                                <div className="text-gray-500 text-[10px] font-medium">{getAvailabilityLabel(vol.availability)}</div>
                              </td>

                              {/* Membership badge */}
                              <td className="py-4 px-4">
                                {getMembershipBadge(vol.membership)}
                              </td>

                              {/* Intro message */}
                              <td className="py-4 px-4 max-w-xs">
                                <p className="text-gray-500 line-clamp-2 pr-4 text-[11px]" title={vol.message}>
                                  {vol.message || '—'}
                                </p>
                              </td>

                              {/* Action buttons */}
                              <td className="py-4 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => setSelectedVolunteer(vol)}
                                    className="p-1.5 bg-[#1F5E2E]/10 hover:bg-[#1F5E2E]/20 text-[#1F5E2E] rounded-xl cursor-pointer transition-colors"
                                    title={isBangla ? 'বিস্তারিত বিবরণ দেখুন' : 'View Full Details'}
                                  >
                                    <Eye size={15} className="stroke-[2.5]" />
                                  </button>
                                  <button
                                    onClick={() => handleVolunteerDelete(vol.id)}
                                    className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl cursor-pointer transition-colors"
                                    title={isBangla ? 'আবেদনটি মুছে ফেলুন' : 'Delete Application'}
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    {filteredVolunteers.length === 0 && (
                      <div className="py-12 text-center text-gray-400 space-y-2">
                        <Users size={32} className="mx-auto text-gray-300 stroke-[1.5]" />
                        <p className="font-bold uppercase tracking-wider text-xs">
                          {isBangla ? 'কোনো স্বেচ্ছাসেবক পাওয়া যায়নি।' : 'No matching volunteers found.'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* --- DONATIONS TAB --- */}
            {activeTab === 'donations' && (
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4" id="donations-tab">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h3 className="text-lg font-black text-[#1F5E2E] text-left">
                      {isBangla ? 'অনুদান ও লেনদেন অডিট লেজার' : 'Donations Audit Ledger'}
                    </h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider font-mono mt-0.5">
                      {isBangla ? 'গ্রাসরুট ফান্ডিং ও মোবাইল পেমেন্ট ট্র্যাকিং' : 'Grassroots funding & mobile transfer validation'}
                    </p>
                  </div>
                  <span className="text-[10px] text-[#1F5E2E] font-bold font-mono bg-[#6BBF3A]/10 px-3 py-1.5 rounded-lg border border-[#6BBF3A]/20">
                    {isBangla ? 'তাত্ক্ষণিক ড্রপডাউন আপডেট' : 'Dropdown Saves Instantly'}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-400 font-mono text-xs uppercase font-bold">
                        <th className="py-3 px-4">{isBangla ? 'দাতা / অবদানকারী' : 'Contributor'}</th>
                        <th className="py-3 px-4">{isBangla ? 'ইমেইল' : 'Email'}</th>
                        <th className="py-3 px-4">{isBangla ? 'পরিমাণ' : 'Amount'}</th>
                        <th className="py-3 px-4">{isBangla ? 'মাধ্যম' : 'Channel'}</th>
                        <th className="py-3 px-4">{isBangla ? 'ট্রানজেকশন আইডি' : 'Trans ID'}</th>
                        <th className="py-3 px-4">{isBangla ? 'স্ট্যাটাস / পেমেন্ট প্রাপ্তি' : 'Status / Received'}</th>
                        <th className="py-3 px-4">{isBangla ? 'তারিখ' : 'Date'}</th>
                        <th className="py-3 px-4">{isBangla ? 'অ্যাকশন' : 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {donations.map((don) => {
                        const channel = (don.paymentMethod || don.method || 'Direct').toUpperCase();
                        const trans = don.transId || don.transactionId || '—';
                        return (
                          <tr key={don.id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-4 font-bold text-gray-900">{don.name || 'Anonymous'}</td>
                            <td className="py-4 px-4 text-xs text-gray-600">{don.email || '—'}</td>
                            <td className="py-4 px-4 font-black text-[#1F5E2E]">৳{(don.amount || 0).toLocaleString()}</td>
                            <td className="py-4 px-4">
                              <span className={`text-[10px] font-mono font-black uppercase tracking-wider py-1 px-2.5 rounded-lg ${
                                channel === 'BKASH' 
                                  ? 'bg-pink-50 text-pink-700 border border-pink-100'
                                  : channel === 'NAGAD'
                                  ? 'bg-orange-50 text-orange-700 border border-orange-100'
                                  : 'bg-gray-50 text-gray-500 border border-gray-100'
                              }`}>
                                {channel}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-mono text-xs font-bold text-gray-700 bg-gray-100 py-1 px-2 rounded">
                                {trans}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <select
                                value={don.status || 'pending'}
                                onChange={(e) => handleUpdateDonationStatus(don.id, e.target.value)}
                                className={`text-[10px] font-mono font-black uppercase tracking-wider px-3 py-1.5 rounded-xl outline-none border focus:ring-2 focus:ring-offset-1 transition-all cursor-pointer font-bold ${
                                  don.status === 'verified' || don.status === 'approved' || don.status === 'received'
                                    ? 'bg-green-100 text-green-800 border-green-200 focus:ring-green-400'
                                    : don.status === 'rejected'
                                    ? 'bg-red-100 text-red-800 border-red-200 focus:ring-red-400'
                                    : 'bg-amber-100 text-amber-800 border-amber-200 focus:ring-amber-400'
                                }`}
                              >
                                <option value="pending">{isBangla ? 'পেন্ডিং / যাচাইাধীন (Pending)' : 'Pending / Review'}</option>
                                <option value="verified">{isBangla ? 'অনুমোদিত ও প্রাপ্ত (Approved)' : 'Approved / Received'}</option>
                                <option value="rejected">{isBangla ? 'প্রত্যাখ্যাত / ভুয়া (Rejected)' : 'Rejected / Fake'}</option>
                              </select>
                            </td>
                            <td className="py-4 px-4 text-xs text-gray-400 font-mono">
                              {don.date ? (don.date.includes('-') && don.date.length > 10 ? new Date(don.date).toLocaleDateString() : don.date) : 'N/A'}
                            </td>
                            <td className="py-4 px-4">
                              <button
                                onClick={() => handleDonationDelete(don.id)}
                                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 cursor-pointer transition-colors"
                                title="Delete record"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {donations.length === 0 && (
                    <p className="py-12 text-center text-gray-400 font-bold uppercase tracking-wider text-xs">No donation records registered.</p>
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

            {/* --- TESTIMONIALS MANAGEMENT TAB --- */}
            {activeTab === 'testimonials' && (
              <div className="space-y-6" id="testimonials-tab">
                {isEditing ? (
                  <form onSubmit={handleTestimonialSave} className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-6 text-left">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <h3 className="text-lg font-black text-[#1F5E2E]">
                        {editingId ? 'Edit Testimonial' : 'Add Testimonial'}
                      </h3>
                      <button type="button" onClick={() => { setIsEditing(false); setEditingId(null); }} className="text-gray-400 hover:text-gray-700">
                        <X size={20} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Author Name (EN)</label>
                        <input
                          type="text"
                          value={testAuthor}
                          onChange={(e) => setTestAuthor(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-800"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Author Name (BN)</label>
                        <input
                          type="text"
                          value={testAuthorBn}
                          onChange={(e) => setTestAuthorBn(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-800"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Role/Designation (EN)</label>
                        <input
                          type="text"
                          value={testRole}
                          onChange={(e) => setTestRole(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-800"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Role/Designation (BN)</label>
                        <input
                          type="text"
                          value={testRoleBn}
                          onChange={(e) => setTestRoleBn(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-800"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Location (EN)</label>
                        <input
                          type="text"
                          value={testLocation}
                          onChange={(e) => setTestLocation(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-800"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Location (BN)</label>
                        <input
                          type="text"
                          value={testLocationBn}
                          onChange={(e) => setTestLocationBn(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-800"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Quote (EN)</label>
                        <textarea
                          rows={3}
                          value={testQuote}
                          onChange={(e) => setTestQuote(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-800 resize-none"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Quote (BN)</label>
                        <textarea
                          rows={3}
                          value={testQuoteBn}
                          onChange={(e) => setTestQuoteBn(e.target.value)}
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
                        {editingId ? 'Save Changes' : 'Add Testimonial'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-black text-[#1F5E2E]">Testimonials</h3>
                      <button
                        onClick={() => { clearTestimonialForm(); setIsEditing(true); }}
                        className="bg-[#1F5E2E] hover:bg-[#2E7D32] text-white py-2 px-4 rounded-full text-xs font-bold cursor-pointer flex items-center gap-1"
                      >
                        <Plus size={14} />
                        <span>Add Testimonial</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {testimonials.map((t) => (
                        <div key={t.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow flex flex-col justify-between text-left h-full group relative animate-fadeIn">
                          <div className="space-y-4">
                            <span className="text-4xl text-[#6BBF3A]/20 font-serif leading-none select-none">“</span>
                            <p className="font-sans text-sm text-gray-600 italic leading-relaxed mb-4">
                              {t.quote}
                            </p>
                            <p className="font-sans text-xs text-gray-400 italic leading-relaxed border-t border-gray-100 pt-2">
                              {t.quoteBn}
                            </p>
                          </div>
                          
                          <div className="mt-4 border-t border-gray-100 pt-3 flex justify-between items-end">
                            <div>
                              <h4 className="font-sans font-black text-gray-900 text-sm leading-tight">
                                {t.author} / {t.authorBn}
                              </h4>
                              <p className="font-mono text-[10px] text-gray-500 mt-1 uppercase tracking-wider">
                                {t.role} ({t.location})
                              </p>
                            </div>
                            
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                              <button
                                onClick={() => handleTestimonialEdit(t)}
                                className="p-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg cursor-pointer shadow-sm"
                              >
                                <Edit size={12} />
                              </button>
                              <button
                                onClick={() => handleTestimonialDelete(t.id)}
                                className="p-1.5 bg-white border border-red-100 hover:bg-red-50 text-red-600 rounded-lg cursor-pointer shadow-sm"
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

            {/* --- SUBSCRIBERS TAB --- */}
            {activeTab === 'subscribers' && (
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4" id="subscribers-tab">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-black text-[#1F5E2E]">Eco-Newsletter Subscribers</h3>
                  <button
                    onClick={() => {
                      const emails = subscribers.map(s => typeof s === 'string' ? s : (s?.email || ''));
                      const csvContent = "data:text/csv;charset=utf-8,Email\n" + emails.join("\n");
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
                  {subscribers.map((sub, idx) => {
                    const email = typeof sub === 'string' ? sub : (sub?.email || '');
                    const date = typeof sub === 'string' ? '' : (sub?.date || '');
                    return (
                      <div key={email || idx} className="flex justify-between items-center bg-gray-50 border border-gray-200/50 p-4 rounded-2xl text-left">
                        <div className="flex items-center gap-3">
                          <Mail size={16} className="text-[#6BBF3A]" />
                          <div>
                            <span className="font-bold text-gray-800 text-sm block">{email}</span>
                            {date && <span className="text-[10px] text-gray-400 font-mono">Date: {date}</span>}
                          </div>
                        </div>
                        <button
                          onClick={() => handleSubscriberDelete(email)}
                          className="text-gray-400 hover:text-red-500 p-1.5 rounded hover:bg-red-50 cursor-pointer"
                          title="Remove Subscriber"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    );
                  })}
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

                    <div className="pt-4 border-t border-gray-200/60">
                      <ImageUploadInput
                        label={isBangla ? "অর্গানাইজেশনের লোগো বা ছবি" : "Organization Logo or Photo"}
                        value={setLogoUrl}
                        onChange={setSetLogoUrl}
                        placeholder="/src/assets/images/logo_placeholder.png"
                        filenamePrefix="logo"
                        isBangla={isBangla}
                      />
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

                        {/* Dynamic About Headers */}
                        <div className="flex flex-col gap-1.5 col-span-1 md:col-span-2 border-t border-gray-200 pt-4 mt-2">
                          <span className="text-xs font-bold text-gray-700">About Page Hero Section Headers</span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Hero Badge Label (EN)</label>
                          <input
                            type="text"
                            value={setAboutHeroLabel}
                            onChange={(e) => setSetAboutHeroLabel(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Hero Badge Label (BN)</label>
                          <input
                            type="text"
                            value={setAboutHeroLabelBn}
                            onChange={(e) => setSetAboutHeroLabelBn(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Hero Title (EN)</label>
                          <input
                            type="text"
                            value={setAboutHeroTitle}
                            onChange={(e) => setSetAboutHeroTitle(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800 font-bold"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Hero Title (BN)</label>
                          <input
                            type="text"
                            value={setAboutHeroTitleBn}
                            onChange={(e) => setSetAboutHeroTitleBn(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800 font-bold"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Hero Subtitle (EN)</label>
                          <textarea
                            rows={2}
                            value={setAboutHeroSub}
                            onChange={(e) => setSetAboutHeroSub(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-gray-800 resize-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Hero Subtitle (BN)</label>
                          <textarea
                            rows={2}
                            value={setAboutHeroSubBn}
                            onChange={(e) => setSetAboutHeroSubBn(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-gray-800 resize-none"
                          />
                        </div>

                        {/* Story Title */}
                        <div className="flex flex-col gap-1.5 col-span-1 md:col-span-2 border-t border-gray-200 pt-4 mt-2">
                          <span className="text-xs font-bold text-gray-700">About Page Story Section</span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Story Section Title (EN)</label>
                          <input
                            type="text"
                            value={setAboutStoryTitle}
                            onChange={(e) => setSetAboutStoryTitle(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Story Section Title (BN)</label>
                          <input
                            type="text"
                            value={setAboutStoryTitleBn}
                            onChange={(e) => setSetAboutStoryTitleBn(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800"
                          />
                        </div>

                        {/* Principles Headers */}
                        <div className="flex flex-col gap-1.5 col-span-1 md:col-span-2 border-t border-gray-200 pt-4 mt-2">
                          <span className="text-xs font-bold text-gray-700">Core Principles Section Headers</span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Principles Badge (EN)</label>
                          <input
                            type="text"
                            value={setAboutPrinciplesLabel}
                            onChange={(e) => setSetAboutPrinciplesLabel(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Principles Badge (BN)</label>
                          <input
                            type="text"
                            value={setAboutPrinciplesLabelBn}
                            onChange={(e) => setSetAboutPrinciplesLabelBn(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Principles Title (EN)</label>
                          <input
                            type="text"
                            value={setAboutPrinciplesTitle}
                            onChange={(e) => setSetAboutPrinciplesTitle(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Principles Title (BN)</label>
                          <input
                            type="text"
                            value={setAboutPrinciplesTitleBn}
                            onChange={(e) => setSetAboutPrinciplesTitleBn(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800"
                          />
                        </div>

                        {/* Milestones Headers */}
                        <div className="flex flex-col gap-1.5 col-span-1 md:col-span-2 border-t border-gray-200 pt-4 mt-2">
                          <span className="text-xs font-bold text-gray-700">Milestones Section Headers</span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Milestones Badge (EN)</label>
                          <input
                            type="text"
                            value={setAboutMilestonesLabel}
                            onChange={(e) => setSetAboutMilestonesLabel(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Milestones Badge (BN)</label>
                          <input
                            type="text"
                            value={setAboutMilestonesLabelBn}
                            onChange={(e) => setSetAboutMilestonesLabelBn(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Milestones Title (EN)</label>
                          <input
                            type="text"
                            value={setAboutMilestonesTitle}
                            onChange={(e) => setSetAboutMilestonesTitle(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Milestones Title (BN)</label>
                          <input
                            type="text"
                            value={setAboutMilestonesTitleBn}
                            onChange={(e) => setSetAboutMilestonesTitleBn(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800"
                          />
                        </div>

                        {/* Team Leaders Headers */}
                        <div className="flex flex-col gap-1.5 col-span-1 md:col-span-2 border-t border-gray-200 pt-4 mt-2">
                          <span className="text-xs font-bold text-gray-700">Team Leaders Section Headers</span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Team Badge (EN)</label>
                          <input
                            type="text"
                            value={setAboutTeamLabel}
                            onChange={(e) => setSetAboutTeamLabel(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Team Badge (BN)</label>
                          <input
                            type="text"
                            value={setAboutTeamLabelBn}
                            onChange={(e) => setSetAboutTeamLabelBn(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Team Title (EN)</label>
                          <input
                            type="text"
                            value={setAboutTeamTitle}
                            onChange={(e) => setSetAboutTeamTitle(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Team Title (BN)</label>
                          <input
                            type="text"
                            value={setAboutTeamTitleBn}
                            onChange={(e) => setSetAboutTeamTitleBn(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800"
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

                  {/* SECTION 6: PAYMENT WALLETS & MEMBERSHIP */}
                  <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-200/50 space-y-4">
                    <h4 className="text-sm font-black text-[#1F5E2E] uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#6BBF3A]" />
                      {isBangla ? '৬. অনুদান ওয়ালেট এবং মেম্বারশিপ সেটিংস' : '6. Donation Wallets & Membership Settings'}
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
                      <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Membership Registration Form (Google Form URL)</label>
                        <input
                          type="url"
                          value={setMembershipFormUrl}
                          onChange={(e) => setSetMembershipFormUrl(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800 font-mono font-bold"
                          placeholder="https://forms.gle/..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 7: FOOTER CONFIGURATION */}
                  <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-200/50 space-y-4">
                    <h4 className="text-sm font-black text-[#1F5E2E] uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#6BBF3A]" />
                      {isBangla ? '৭. ফুটার কনফিগারেশন' : '7. Footer Configuration'}
                    </h4>

                    <div className="space-y-4">
                      {/* Subtitle */}
                      <span className="text-xs font-bold text-gray-700 block border-b border-gray-200 pb-1">About Organization Segment</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Footer About Text (EN)</label>
                          <textarea
                            rows={3}
                            value={footerAboutText}
                            onChange={(e) => setFooterAboutText(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-gray-800 resize-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Footer About Text (BN)</label>
                          <textarea
                            rows={3}
                            value={footerAboutTextBn}
                            onChange={(e) => setFooterAboutTextBn(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-gray-800 resize-none"
                          />
                        </div>
                      </div>

                      <span className="text-xs font-bold text-gray-700 block border-b border-gray-200 pb-1 pt-2">Social Profiles Links</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Facebook URL</label>
                          <input
                            type="text"
                            value={footerFbUrl}
                            onChange={(e) => setFooterFbUrl(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800 font-mono"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Instagram URL</label>
                          <input
                            type="text"
                            value={footerInstaUrl}
                            onChange={(e) => setFooterInstaUrl(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800 font-mono"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">LinkedIn URL</label>
                          <input
                            type="text"
                            value={footerLinkedinUrl}
                            onChange={(e) => setFooterLinkedinUrl(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800 font-mono"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">YouTube URL</label>
                          <input
                            type="text"
                            value={footerYoutubeUrl}
                            onChange={(e) => setFooterYoutubeUrl(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800 font-mono"
                          />
                        </div>
                      </div>

                      <span className="text-xs font-bold text-gray-700 block border-b border-gray-200 pb-1 pt-2">Newsletter Subscription Details</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Newsletter Title (EN)</label>
                          <input
                            type="text"
                            value={footerNewsletterTitle}
                            onChange={(e) => setFooterNewsletterTitle(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Newsletter Title (BN)</label>
                          <input
                            type="text"
                            value={footerNewsletterTitleBn}
                            onChange={(e) => setFooterNewsletterTitleBn(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Newsletter Description (EN)</label>
                          <textarea
                            rows={2}
                            value={footerNewsletterDesc}
                            onChange={(e) => setFooterNewsletterDesc(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-gray-800 resize-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Newsletter Description (BN)</label>
                          <textarea
                            rows={2}
                            value={footerNewsletterDescBn}
                            onChange={(e) => setFooterNewsletterDescBn(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-gray-800 resize-none"
                          />
                        </div>
                      </div>

                      <span className="text-xs font-bold text-gray-700 block border-b border-gray-200 pb-1 pt-2">Copyright Disclaimer</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Copyright Notice (EN)</label>
                          <input
                            type="text"
                            value={footerCopyright}
                            onChange={(e) => setFooterCopyright(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Copyright Notice (BN)</label>
                          <input
                            type="text"
                            value={footerCopyrightBn}
                            onChange={(e) => setFooterCopyrightBn(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800"
                          />
                        </div>
                      </div>
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

            {/* --- MANAGE CORE VALUES & FOCUS AREAS TAB --- */}
            {activeTab === 'corevalues' && (
              <div className="space-y-8" id="corevalues-tab">
                {/* Sub Tab Switcher */}
                <div className="flex gap-4 border-b border-gray-200 pb-2">
                  <button
                    onClick={() => { setFocusSubTab('values'); setIsEditing(false); setEditingId(null); }}
                    className={`py-2 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                      focusSubTab === 'values'
                        ? 'border-[#1F5E2E] text-[#1F5E2E]'
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {isBangla ? 'আমাদের মূল মূল্যবোধ' : 'Our Core Values'}
                  </button>
                  <button
                    onClick={() => { setFocusSubTab('focus'); setIsEditing(false); setEditingId(null); }}
                    className={`py-2 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                      focusSubTab === 'focus'
                        ? 'border-[#1F5E2E] text-[#1F5E2E]'
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {isBangla ? 'আমাদের ফোকাস এরিয়া' : 'Our Focus Areas'}
                  </button>
                </div>

                {focusSubTab === 'values' ? (
                  <div className="space-y-8">
                    {/* Header */}
                    <div className="flex justify-between items-center bg-white p-6 border border-gray-200 rounded-3xl shadow-sm">
                      <div>
                        <h3 className="text-lg font-black text-gray-900">Manage Core Values</h3>
                        <p className="text-xs text-gray-500">Add, edit or delete organization core values shown on the About Us page.</p>
                      </div>
                      {!isEditing && (
                        <button
                          onClick={() => {
                            setIsEditing(true);
                            setEditingId(null);
                            setValTitle('');
                            setValTitleBn('');
                            setValDesc('');
                            setValDescBn('');
                            setValIconName('Leaf');
                          }}
                          className="bg-[#1F5E2E] hover:bg-[#2E7D32] text-white font-bold py-2 px-5 rounded-full text-xs cursor-pointer flex items-center gap-1.5 shadow"
                        >
                          <Plus size={16} />
                          <span>Add Core Value</span>
                        </button>
                      )}
                    </div>

                    {/* Form (Add or Edit) */}
                    {isEditing && (
                      <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-6 text-left">
                        <h4 className="text-sm font-black text-[#1F5E2E] uppercase tracking-wider">
                          {editingId ? 'Edit Core Value' : 'Add New Core Value'}
                        </h4>
                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();
                            const payload = {
                              title: valTitle,
                              titleBn: valTitleBn,
                              description: valDesc,
                              descriptionBn: valDescBn,
                              iconName: valIconName
                            };
                            try {
                              const url = editingId ? `/api/corevalues?id=${editingId}` : '/api/corevalues';
                              const res = await fetch(url, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(editingId ? { id: editingId, ...payload } : payload)
                              });
                              if (res.ok) {
                                alert('Core Value saved successfully!');
                                setIsEditing(false);
                                setEditingId(null);
                                fetchAllData();
                              }
                            } catch (err) {
                              console.error(err);
                            }
                          }}
                          className="space-y-4"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Title (EN)</label>
                              <input
                                type="text"
                                required
                                value={valTitle}
                                onChange={(e) => setValTitle(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800 font-bold"
                                placeholder="e.g. Grassroots Leadership"
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Title (BN)</label>
                              <input
                                type="text"
                                required
                                value={valTitleBn}
                                onChange={(e) => setValTitleBn(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800 font-bold"
                                placeholder="যেমনঃ তৃণমূলের নেতৃত্ব"
                              />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Description (EN)</label>
                              <textarea
                                rows={3}
                                required
                                value={valDesc}
                                onChange={(e) => setValDesc(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-gray-800 resize-none"
                                placeholder="Explain the value..."
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Description (BN)</label>
                              <textarea
                                rows={3}
                                required
                                value={valDescBn}
                                onChange={(e) => setValDescBn(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-gray-800 resize-none"
                                placeholder="মূল্যবোধের বিবরণ দিন..."
                              />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Icon Name</label>
                              <select
                                value={valIconName}
                                onChange={(e) => setValIconName(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800 font-bold"
                              >
                                <option value="Leaf">Leaf (পরিবেশ ও সবুজ রূপান্তর)</option>
                                <option value="Users">Users (জনগণ ও সম্প্রদায়)</option>
                                <option value="TrendingUp">TrendingUp (উন্নতি ও প্রবৃদ্ধি)</option>
                                <option value="Award">Award (অর্জন ও স্বীকৃতি)</option>
                                <option value="Shield">Shield (নিরাপত্তা ও সুরক্ষা)</option>
                                <option value="Lightbulb">Lightbulb (উদ্ভাবন ও আইডিয়া)</option>
                                <option value="Landmark">Landmark (ঐতিহ্য ও মূল্যবোধ)</option>
                                <option value="BookOpen">BookOpen (শিক্ষা ও জ্ঞান)</option>
                                <option value="Heart">Heart (সহমর্মিতা ও ভালোবাসা)</option>
                                <option value="Globe">Globe (বৈশ্বিক ও জলবায়ু)</option>
                                <option value="Activity">Activity (গতিশীলতা ও কার্যক্রম)</option>
                                <option value="Droplet">Droplet (বিশুদ্ধ পানি ও জীবন)</option>
                                <option value="Sun">Sun (সৌরশক্তি ও নবায়নযোগ্য জ্বালানি)</option>
                                <option value="Target">Target (নির্দিষ্ট লক্ষ্য ও উদ্দেশ্য)</option>
                                <option value="Scale">Scale (সমতা ও সততা)</option>
                                <option value="Zap">Zap (তাত্ক্ষণিক কার্যকারিতা ও শক্তি)</option>
                                <option value="Trees">Trees (বনায়ন ও বৃক্ষরোপণ)</option>
                                <option value="HeartHandshake">HeartHandshake (অংশীদারিত্ব ও একতা)</option>
                                <option value="Eye">Eye (ভিশন ও দূরদর্শিতা)</option>
                                <option value="Flag">Flag (নেতৃত্ব ও মিশন)</option>
                                <option value="ShieldCheck">ShieldCheck (স্বচ্ছতা ও নিয়মতান্ত্রিকতা)</option>
                                <option value="MapPin">MapPin (স্থানীয় বা আঞ্চলিক প্রভাব)</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <button
                              type="button"
                              onClick={() => {
                                setIsEditing(false);
                                setEditingId(null);
                              }}
                              className="py-2.5 px-5 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-full text-xs font-bold transition-all cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="py-2.5 px-6 bg-[#1F5E2E] hover:bg-[#2E7D32] text-white rounded-full text-xs font-bold transition-all cursor-pointer shadow hover:shadow-lg"
                            >
                              Save Value
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* List View */}
                    {!isEditing && (
                      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
                        <table className="w-full text-left border-collapse font-sans">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                              <th className="py-4 px-6">Icon</th>
                              <th className="py-4 px-6">Title (EN)</th>
                              <th className="py-4 px-6">Title (BN)</th>
                              <th className="py-4 px-6">Description (EN)</th>
                              <th className="py-4 px-6 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-150 text-xs text-gray-700">
                            {Array.isArray(coreValuesList) && coreValuesList.map((val) => (
                              <tr key={val.id} className="hover:bg-gray-50/50 transition-all font-medium">
                                <td className="py-4 px-6 font-bold text-gray-900">{val.iconName || 'Leaf'}</td>
                                <td className="py-4 px-6 font-bold text-gray-900">{val.title}</td>
                                <td className="py-4 px-6 text-gray-600 font-bold">{val.titleBn}</td>
                                <td className="py-4 px-6 text-gray-500 max-w-xs truncate">{val.description}</td>
                                <td className="py-4 px-6 text-right">
                                  <div className="flex justify-end gap-2">
                                    <button
                                      onClick={() => {
                                        setIsEditing(true);
                                        setEditingId(val.id);
                                        setValTitle(val.title);
                                        setValTitleBn(val.titleBn || '');
                                        setValDesc(val.description);
                                        setValDescBn(val.descriptionBn || '');
                                        setValIconName(val.iconName || 'Leaf');
                                      }}
                                      className="text-gray-500 hover:text-[#1F5E2E] p-1.5 rounded hover:bg-gray-100 cursor-pointer"
                                    >
                                      <Edit size={16} />
                                    </button>
                                    <button
                                      onClick={() => {
                                        setConfirmModal({
                                          title: 'Confirm Deletion',
                                          message: `Are you sure you want to delete core value: "${val.title}"?`,
                                          onConfirm: async () => {
                                            try {
                                              const res = await fetch(`/api/corevalues/${val.id}`, { method: 'DELETE' });
                                              if (res.ok) fetchAllData();
                                            } catch (err) {
                                              console.error(err);
                                            }
                                            setConfirmModal(null);
                                          }
                                        });
                                      }}
                                      className="text-red-500 hover:text-red-700 p-1.5 rounded hover:bg-red-50 cursor-pointer"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {(!Array.isArray(coreValuesList) || coreValuesList.length === 0) && (
                          <p className="py-8 text-center text-gray-400 font-bold uppercase tracking-wider text-xs">No Core Values found.</p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Focus Areas Header */}
                    <div className="flex justify-between items-center bg-white p-6 border border-gray-200 rounded-3xl shadow-sm">
                      <div>
                        <h3 className="text-lg font-black text-gray-900">Manage Focus Areas</h3>
                        <p className="text-xs text-gray-500">Add, edit or delete organization focus areas shown on the Home page.</p>
                      </div>
                      {!isEditing && (
                        <button
                          onClick={() => {
                            setIsEditing(true);
                            setEditingId(null);
                            setFocusTitle('');
                            setFocusTitleBn('');
                            setFocusDesc('');
                            setFocusDescBn('');
                            setFocusIconName('Trees');
                            setFocusColor('emerald');
                          }}
                          className="bg-[#1F5E2E] hover:bg-[#2E7D32] text-white font-bold py-2 px-5 rounded-full text-xs cursor-pointer flex items-center gap-1.5 shadow"
                        >
                          <Plus size={16} />
                          <span>Add Focus Area</span>
                        </button>
                      )}
                    </div>

                    {/* Focus Areas Form (Add or Edit) */}
                    {isEditing && (
                      <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-6 text-left">
                        <h4 className="text-sm font-black text-[#1F5E2E] uppercase tracking-wider">
                          {editingId ? 'Edit Focus Area' : 'Add New Focus Area'}
                        </h4>
                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();
                            const payload = {
                              title: focusTitle,
                              titleBn: focusTitleBn,
                              description: focusDesc,
                              descriptionBn: focusDescBn,
                              iconName: focusIconName,
                              color: focusColor
                            };
                            try {
                              const url = editingId ? `/api/focusareas?id=${editingId}` : '/api/focusareas';
                              const res = await fetch(url, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(editingId ? { id: editingId, ...payload } : payload)
                              });
                              if (res.ok) {
                                alert('Focus Area saved successfully!');
                                setIsEditing(false);
                                setEditingId(null);
                                fetchAllData();
                              }
                            } catch (err) {
                              console.error(err);
                            }
                          }}
                          className="space-y-4"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Title (EN)</label>
                              <input
                                type="text"
                                required
                                value={focusTitle}
                                onChange={(e) => setFocusTitle(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800 font-bold"
                                placeholder="e.g. Tree Plantation"
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Title (BN)</label>
                              <input
                                type="text"
                                required
                                value={focusTitleBn}
                                onChange={(e) => setFocusTitleBn(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800 font-bold"
                                placeholder="e.g. বৃক্ষরোপণ কর্মসূচি"
                              />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Description (EN)</label>
                              <textarea
                                rows={3}
                                required
                                value={focusDesc}
                                onChange={(e) => setFocusDesc(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-gray-800 resize-none"
                                placeholder="Explain the focus area..."
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Description (BN)</label>
                              <textarea
                                rows={3}
                                required
                                value={focusDescBn}
                                onChange={(e) => setFocusDescBn(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-gray-800 resize-none"
                                placeholder="ফোকাস এরিয়ার বিবরণ দিন..."
                              />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Icon Name</label>
                              <select
                                value={focusIconName}
                                onChange={(e) => setFocusIconName(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800 font-bold"
                              >
                                <option value="Trees">Trees (বনায়ন ও বৃক্ষরোপণ)</option>
                                <option value="Sun">Sun (সৌরশক্তি ও নবায়নযোগ্য জ্বালানি)</option>
                                <option value="Droplet">Droplet (বিশুদ্ধ পানি ও জীবন)</option>
                                <option value="Trash2">Trash2 (বর্জ্য ও রিসাইক্লিং)</option>
                                <option value="Leaf">Leaf (পরিবেশ ও সবুজ রূপান্তর)</option>
                                <option value="Users">Users (জনগণ ও সম্প্রদায়)</option>
                                <option value="TrendingUp">TrendingUp (উন্নতি ও প্রবৃদ্ধি)</option>
                                <option value="Award">Award (অর্জন ও স্বীকৃতি)</option>
                                <option value="Shield">Shield (নিরাপত্তা ও সুরক্ষা)</option>
                                <option value="Lightbulb">Lightbulb (উদ্ভাবন ও আইডিয়া)</option>
                                <option value="Landmark">Landmark (ঐতিহ্য ও মূল্যবোধ)</option>
                                <option value="BookOpen">BookOpen (শিক্ষা ও জ্ঞান)</option>
                                <option value="Heart">Heart (সহমর্মিতা ও ভালোবাসা)</option>
                                <option value="Globe">Globe (বৈশ্বিক ও জলবায়ু)</option>
                                <option value="Activity">Activity (গতিশীলতা ও কার্যক্রম)</option>
                                <option value="Target">Target (নির্দিষ্ট লক্ষ্য ও উদ্দেশ্য)</option>
                                <option value="Scale">Scale (সমতা ও সততা)</option>
                                <option value="Zap">Zap (তাত্ক্ষণিক কার্যকারিতা ও শক্তি)</option>
                                <option value="HeartHandshake">HeartHandshake (অংশীদারিত্ব ও একতা)</option>
                                <option value="Eye">Eye (ভিশন ও দূরদর্শিতা)</option>
                                <option value="Flag">Flag (নেতৃত্ব ও মিশন)</option>
                                <option value="ShieldCheck">ShieldCheck (স্বচ্ছতা ও নিয়মতান্ত্রিকতা)</option>
                                <option value="MapPin">MapPin (স্থানীয় বা আঞ্চলিক প্রভাব)</option>
                              </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Color Theme</label>
                              <select
                                value={focusColor}
                                onChange={(e) => setFocusColor(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800 font-bold"
                              >
                                <option value="emerald">Emerald (সবুজ)</option>
                                <option value="amber">Amber (কমলা/হলুদ)</option>
                                <option value="sky">Sky (আকাশী নীল)</option>
                                <option value="purple">Purple (বেগুনি)</option>
                                <option value="teal">Teal (নীলাভ সবুজ)</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <button
                              type="button"
                              onClick={() => {
                                setIsEditing(false);
                                setEditingId(null);
                              }}
                              className="py-2.5 px-5 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-full text-xs font-bold transition-all cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="py-2.5 px-6 bg-[#1F5E2E] hover:bg-[#2E7D32] text-white rounded-full text-xs font-bold transition-all cursor-pointer shadow hover:shadow-lg"
                            >
                              Save Focus Area
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* Focus Areas List View */}
                    {!isEditing && (
                      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
                        <table className="w-full text-left border-collapse font-sans">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                              <th className="py-4 px-6">Icon</th>
                              <th className="py-4 px-6">Title (EN)</th>
                              <th className="py-4 px-6">Title (BN)</th>
                              <th className="py-4 px-6">Description (EN)</th>
                              <th className="py-4 px-6 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-150 text-xs text-gray-700">
                            {Array.isArray(focusAreasList) && focusAreasList.map((focus) => (
                              <tr key={focus.id} className="hover:bg-gray-50/50 transition-all font-medium">
                                <td className="py-4 px-6 font-bold text-gray-900">{focus.iconName || 'Trees'} ({focus.color || 'emerald'})</td>
                                <td className="py-4 px-6 font-bold text-gray-900">{focus.title}</td>
                                <td className="py-4 px-6 text-gray-600 font-bold">{focus.titleBn}</td>
                                <td className="py-4 px-6 text-gray-500 max-w-xs truncate">{focus.description}</td>
                                <td className="py-4 px-6 text-right">
                                  <div className="flex justify-end gap-2">
                                    <button
                                      onClick={() => {
                                        setIsEditing(true);
                                        setEditingId(focus.id);
                                        setFocusTitle(focus.title);
                                        setFocusTitleBn(focus.titleBn || '');
                                        setFocusDesc(focus.description);
                                        setFocusDescBn(focus.descriptionBn || '');
                                        setFocusIconName(focus.iconName || 'Trees');
                                        setFocusColor(focus.color || 'emerald');
                                      }}
                                      className="text-gray-500 hover:text-[#1F5E2E] p-1.5 rounded hover:bg-gray-100 cursor-pointer"
                                    >
                                      <Edit size={16} />
                                    </button>
                                    <button
                                      onClick={() => {
                                        setConfirmModal({
                                          title: 'Confirm Deletion',
                                          message: `Are you sure you want to delete focus area: "${focus.title}"?`,
                                          onConfirm: async () => {
                                            try {
                                              const res = await fetch(`/api/focusareas/${focus.id}`, { method: 'DELETE' });
                                              if (res.ok) fetchAllData();
                                            } catch (err) {
                                              console.error(err);
                                            }
                                            setConfirmModal(null);
                                          }
                                        });
                                      }}
                                      className="text-red-500 hover:text-red-700 p-1.5 rounded hover:bg-red-50 cursor-pointer"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {(!Array.isArray(focusAreasList) || focusAreasList.length === 0) && (
                          <p className="py-8 text-center text-gray-400 font-bold uppercase tracking-wider text-xs">No Focus Areas found.</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* --- MANAGE MILESTONES TAB --- */}
            {activeTab === 'milestones' && (
              <div className="space-y-8" id="milestones-tab">
                {/* Header */}
                <div className="flex justify-between items-center bg-white p-6 border border-gray-200 rounded-3xl shadow-sm">
                  <div>
                    <h3 className="text-lg font-black text-gray-900">Manage Milestones</h3>
                    <p className="text-xs text-gray-500">Add, edit or delete journey milestones shown on the About Us page timeline.</p>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setEditingId(null);
                        setMileYear('');
                        setMileYearBn('');
                        setMileTitle('');
                        setMileTitleBn('');
                        setMileDesc('');
                        setMileDescBn('');
                      }}
                      className="bg-[#1F5E2E] hover:bg-[#2E7D32] text-white font-bold py-2 px-5 rounded-full text-xs cursor-pointer flex items-center gap-1.5 shadow"
                    >
                      <Plus size={16} />
                      <span>Add Milestone</span>
                    </button>
                  )}
                </div>

                {/* Form (Add or Edit) */}
                {isEditing && (
                  <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-6 text-left">
                    <h4 className="text-sm font-black text-[#1F5E2E] uppercase tracking-wider">
                      {editingId ? 'Edit Milestone' : 'Add New Milestone'}
                    </h4>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const payload = {
                          year: mileYear,
                          yearBn: mileYearBn,
                          title: mileTitle,
                          titleBn: mileTitleBn,
                          description: mileDesc,
                          descriptionBn: mileDescBn
                        };
                        try {
                          const url = editingId ? `/api/milestones?id=${editingId}` : '/api/milestones';
                          const res = await fetch(url, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(editingId ? { id: editingId, ...payload } : payload)
                          });
                          if (res.ok) {
                            alert('Milestone saved successfully!');
                            setIsEditing(false);
                            setEditingId(null);
                            fetchAllData();
                          }
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Year (EN)</label>
                          <input
                            type="text"
                            required
                            value={mileYear}
                            onChange={(e) => setMileYear(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800 font-bold"
                            placeholder="e.g. 2024"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Year (BN)</label>
                          <input
                            type="text"
                            required
                            value={mileYearBn}
                            onChange={(e) => setMileYearBn(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800 font-bold"
                            placeholder="যেমনঃ ২০২৪"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Title (EN)</label>
                          <input
                            type="text"
                            required
                            value={mileTitle}
                            onChange={(e) => setMileTitle(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800 font-bold"
                            placeholder="e.g. Founded"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Title (BN)</label>
                          <input
                            type="text"
                            required
                            value={mileTitleBn}
                            onChange={(e) => setMileTitleBn(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800 font-bold"
                            placeholder="যেমনঃ প্রতিষ্ঠা"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Description (EN)</label>
                          <textarea
                            rows={3}
                            required
                            value={mileDesc}
                            onChange={(e) => setMileDesc(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-gray-800 resize-none"
                            placeholder="Milestone description..."
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Description (BN)</label>
                          <textarea
                            rows={3}
                            required
                            value={mileDescBn}
                            onChange={(e) => setMileDescBn(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-gray-800 resize-none"
                            placeholder="অর্জনের বিবরণ দিন..."
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                            setEditingId(null);
                          }}
                          className="py-2.5 px-5 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-full text-xs font-bold transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="py-2.5 px-6 bg-[#1F5E2E] hover:bg-[#2E7D32] text-white rounded-full text-xs font-bold transition-all cursor-pointer shadow hover:shadow-lg"
                        >
                          Save Milestone
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* List View */}
                {!isEditing && (
                  <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse font-sans">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                          <th className="py-4 px-6">Year</th>
                          <th className="py-4 px-6">Title (EN)</th>
                          <th className="py-4 px-6">Title (BN)</th>
                          <th className="py-4 px-6">Description (EN)</th>
                          <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-150 text-xs text-gray-700">
                        {Array.isArray(milestonesList) && milestonesList.map((m) => (
                          <tr key={m.id} className="hover:bg-gray-50/50 transition-all font-medium">
                            <td className="py-4 px-6 font-bold text-[#1F5E2E]">{m.year}</td>
                            <td className="py-4 px-6 font-bold text-gray-900">{m.title}</td>
                            <td className="py-4 px-6 text-gray-600 font-bold">{m.titleBn}</td>
                            <td className="py-4 px-6 text-gray-500 max-w-xs truncate">{m.description}</td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setIsEditing(true);
                                    setEditingId(m.id);
                                    setMileYear(m.year);
                                    setMileYearBn(m.yearBn || '');
                                    setMileTitle(m.title);
                                    setMileTitleBn(m.titleBn || '');
                                    setMileDesc(m.description);
                                    setMileDescBn(m.descriptionBn || '');
                                  }}
                                  className="text-gray-500 hover:text-[#1F5E2E] p-1.5 rounded hover:bg-gray-100 cursor-pointer"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() => {
                                    setConfirmModal({
                                      title: 'Confirm Deletion',
                                      message: `Are you sure you want to delete milestone: "${m.title}"?`,
                                      onConfirm: async () => {
                                        try {
                                          const res = await fetch(`/api/milestones/${m.id}`, { method: 'DELETE' });
                                          if (res.ok) fetchAllData();
                                        } catch (err) {
                                          console.error(err);
                                        }
                                        setConfirmModal(null);
                                      }
                                    });
                                  }}
                                  className="text-red-500 hover:text-red-700 p-1.5 rounded hover:bg-red-50 cursor-pointer"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {(!Array.isArray(milestonesList) || milestonesList.length === 0) && (
                      <p className="py-8 text-center text-gray-400 font-bold uppercase tracking-wider text-xs">No Milestones found.</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* --- MANAGE ANNOUNCEMENT POPUP TAB --- */}
            {activeTab === 'popup' && (
              <div className="max-w-4xl mx-auto" id="popup-tab">
                <form onSubmit={handleSettingsSave} className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-8 text-left">
                  <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
                    <h3 className="text-xl font-black text-[#1F5E2E] flex items-center gap-2">
                      <Megaphone size={24} className="text-[#6BBF3A]" />
                      <span>{isBangla ? 'ওয়েবসাইট ঘোষণা পপ-আপ' : 'Web Announcement Pop-Up'}</span>
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">
                        {isBangla ? 'সক্রিয়তা নিয়ন্ত্রণ' : 'Visibility Control'}
                      </span>
                      {/* Enable/Disable Toggle */}
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <span className="text-[10px] font-mono font-black tracking-wide text-gray-500 uppercase">
                          {popupEnabled ? (isBangla ? 'সক্রিয়' : 'ACTIVE') : (isBangla ? 'নিষ্ক্রিয়' : 'DISABLED')}
                        </span>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={popupEnabled}
                            onChange={(e) => setPopupEnabled(e.target.checked)}
                            className="sr-only"
                          />
                          <div className={`block w-9 h-5 rounded-full transition-colors ${popupEnabled ? 'bg-[#6BBF3A]' : 'bg-gray-300'}`}></div>
                          <div className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform ${popupEnabled ? 'transform translate-x-4' : ''}`}></div>
                        </div>
                      </label>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 font-sans leading-relaxed">
                    {isBangla 
                      ? 'এটি সক্রিয় করলে দর্শকরা ওয়েবসাইটে প্রবেশ করা মাত্র একটি সুন্দর পপ-আপ মেসেজে যেকোনো জরুরি ঘোষণা, আসন্ন ইভেন্ট বা পরিবর্তন দেখতে পাবেন। একই ব্রাউজারে একবার বন্ধ (Dismiss) করলে পরবর্তীতে বিরক্তি এড়াতে এটি পুনরায় স্বয়ংক্রিয়ভাবে দেখাবে না।'
                      : 'Enabling this option triggers a beautiful alert pop-up window to any visitor entering your website. Useful for announcing beach cleanups, solar projects, or urgent notices. The popup caches close states so dismissed users are not repeatedly disrupted.'}
                  </p>

                  <div className="space-y-6 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Announcement Title (EN)</label>
                        <input
                          type="text"
                          value={popupTitle}
                          onChange={(e) => setPopupTitle(e.target.value)}
                          placeholder="e.g. Satkhira Mangrove Planting Drive"
                          className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800 font-bold"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Announcement Title (BN)</label>
                        <input
                          type="text"
                          value={popupTitleBn}
                          onChange={(e) => setPopupTitleBn(e.target.value)}
                          placeholder="যেমন: সাতক্ষীরায় ম্যানগ্রোভ বনায়ন কর্মসূচি"
                          className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800 font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Announcement Message (EN)</label>
                        <textarea
                          rows={4}
                          value={popupMessage}
                          onChange={(e) => setPopupMessage(e.target.value)}
                          placeholder="Describe the notice details, date, venue, and participation guidelines..."
                          className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-gray-800 resize-none font-medium"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Announcement Message (BN)</label>
                        <textarea
                          rows={4}
                          value={popupMessageBn}
                          onChange={(e) => setPopupMessageBn(e.target.value)}
                          placeholder="নোটিশের বিস্তারিত তথ্য, তারিখ, সময়, কীভাবে অংশ নেবে ইত্যাদি এখানে লিখুন..."
                          className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-gray-800 resize-none font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Action Link URL (Optional)</label>
                        <input
                          type="text"
                          value={popupLinkUrl}
                          onChange={(e) => setPopupLinkUrl(e.target.value)}
                          placeholder="e.g. #/involved or https://forms.gle/..."
                          className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800 font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Button Text (EN)</label>
                        <input
                          type="text"
                          value={popupLinkText}
                          onChange={(e) => setPopupLinkText(e.target.value)}
                          placeholder="e.g. Join as Volunteer"
                          className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Button Text (BN)</label>
                        <input
                          type="text"
                          value={popupLinkTextBn}
                          onChange={(e) => setPopupLinkTextBn(e.target.value)}
                          placeholder="যেমন: স্বেচ্ছাসেবক হোন"
                          className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800"
                        />
                      </div>
                    </div>

                    <div>
                      <ImageUploadInput
                        label={isBangla ? "ঘোষণার ব্যানার ইমেজ (ঐচ্ছিক)" : "Announcement Banner Image (Optional)"}
                        value={popupImageUrl}
                        onChange={setPopupImageUrl}
                        placeholder="https://images.unsplash.com/... or upload"
                        filenamePrefix="notice"
                        isBangla={isBangla}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-6 border-t border-gray-100">
                    <button
                      type="submit"
                      className="py-3.5 px-8 bg-[#1F5E2E] hover:bg-[#2E7D32] text-white rounded-full text-xs font-black cursor-pointer shadow hover:shadow-lg transition-all uppercase tracking-wider"
                    >
                      {isBangla ? 'ঘোষণা সংরক্ষণ ও প্রকাশ করুন' : 'Save & Publish Announcement'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* --- GREEN HERO MANAGEMENT TAB --- */}
            {activeTab === 'green-hero' && (
              <div id="green-hero-tab">
                <GreenHeroAdmin isBangla={isBangla} />
              </div>
            )}
            </AdminTabErrorBoundary>
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

        {/* Volunteer Details Modal */}
        {selectedVolunteer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVolunteer(null)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="relative w-full max-w-2xl bg-white border border-gray-100 rounded-3xl shadow-2xl z-10 text-left font-sans flex flex-col overflow-hidden max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-[#1F5E2E] to-[#2E7D32] text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 text-white rounded-full flex items-center justify-center font-black text-sm">
                    {selectedVolunteer.name ? selectedVolunteer.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'V'}
                  </div>
                  <div>
                    <h4 className="text-lg font-black leading-tight">{selectedVolunteer.name}</h4>
                    <p className="text-[10px] text-emerald-100 font-medium uppercase tracking-wider">
                      {isBangla ? 'স্বেচ্ছাসেবক আবেদনপত্র' : 'Volunteer Application Details'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedVolunteer(null)}
                  className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-white/80 hover:text-white cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto space-y-6">
                
                {/* Section 1: Key Metadata badging */}
                <div className="flex flex-wrap gap-2 pb-4 border-b border-gray-100">
                  {/* Status badge */}
                  {selectedVolunteer.membership === 'submitted_pending' && (
                    <span className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                      {isBangla ? 'আবেদন পেন্ডিং' : 'Submitted & Pending'}
                    </span>
                  )}
                  {selectedVolunteer.membership === 'already_member' && (
                    <span className="bg-emerald-50 border border-emerald-200 text-[#1F5E2E] text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6BBF3A]"></span>
                      {isBangla ? 'আজীবন সদস্য' : 'Lifetime Member'}
                    </span>
                  )}
                  {(selectedVolunteer.membership === 'no_intent' || !selectedVolunteer.membership) && (
                    <span className="bg-gray-50 border border-gray-200 text-gray-500 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                      {isBangla ? 'মাঠ ভলান্টিয়ার' : 'Field Volunteer Only'}
                    </span>
                  )}

                  {/* Campaign Interest */}
                  <span className="bg-[#1F5E2E]/10 border border-[#1F5E2E]/20 text-[#1F5E2E] text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 uppercase font-mono">
                    🎯 {(() => {
                      switch (selectedVolunteer.interest) {
                        case 'plantation': return isBangla ? 'ম্যানগ্রোভ রোপণ' : 'Mangrove Plantation';
                        case 'renewable': return isBangla ? 'সৌর বিদ্যুৎ' : 'Solar Micro-Grids';
                        case 'water': return isBangla ? 'বিশুদ্ধ পানি' : 'Safe Water Plants';
                        case 'waste': return isBangla ? 'বর্জ্য অপসারণ' : 'Waste & Cleanup';
                        case 'awareness': return isBangla ? 'সচেতনতা প্রচার' : 'School Campaigns';
                        default: return selectedVolunteer.interest;
                      }
                    })()}
                  </span>

                  {/* Blood Group */}
                  {selectedVolunteer.bloodGroup && selectedVolunteer.bloodGroup !== 'Unknown' && (
                    <span className="bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      🩸 {isBangla ? `রক্তের গ্রুপ: ${selectedVolunteer.bloodGroup}` : `Blood Group: ${selectedVolunteer.bloodGroup}`}
                    </span>
                  )}
                </div>

                {/* Grid Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Column Left: Contact & Profile */}
                  <div className="space-y-4">
                    <h5 className="text-xs font-black text-gray-400 uppercase tracking-wider font-mono">
                      {isBangla ? 'যোগাযোগ ও পরিচিতি' : 'Contact & Profile'}
                    </h5>
                    
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3">
                      {/* Email */}
                      <div className="flex items-start gap-2.5">
                        <Mail size={14} className="text-gray-400 mt-0.5" />
                        <div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase">{isBangla ? 'ইমেল' : 'Email Address'}</div>
                          <a href={`mailto:${selectedVolunteer.email}`} className="text-xs font-semibold text-[#1F5E2E] hover:underline break-all">
                            {selectedVolunteer.email}
                          </a>
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="flex items-start gap-2.5">
                        <Phone size={14} className="text-gray-400 mt-0.5" />
                        <div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase">{isBangla ? 'মোবাইল নম্বর' : 'Phone Number'}</div>
                          <a href={`tel:${selectedVolunteer.phone}`} className="text-xs font-semibold text-gray-700 hover:underline">
                            {selectedVolunteer.phone}
                          </a>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-start gap-2.5">
                        <MapPin size={14} className="text-gray-400 mt-0.5" />
                        <div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase">{isBangla ? 'জেলা / এলাকা' : 'Location / Area'}</div>
                          <div className="text-xs font-semibold text-gray-700">
                            {selectedVolunteer.location || '—'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Column Right: Engagement Details */}
                  <div className="space-y-4">
                    <h5 className="text-xs font-black text-gray-400 uppercase tracking-wider font-mono">
                      {isBangla ? 'সংযুক্তি ও সময়সূচী' : 'Engagement & Availability'}
                    </h5>

                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3">
                      {/* Profession */}
                      <div className="flex items-start gap-2.5">
                        <Award size={14} className="text-gray-400 mt-0.5" />
                        <div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase">{isBangla ? 'পেশা' : 'Profession'}</div>
                          <div className="text-xs font-semibold text-gray-700">
                            {(() => {
                              switch (selectedVolunteer.profession) {
                                case 'student': return isBangla ? 'শিক্ষার্থী' : 'Student';
                                case 'job_holder': return isBangla ? 'চাকুরীজীবী' : 'Job Holder / Professional';
                                case 'academician': return isBangla ? 'শিক্ষক / গবেষক' : 'Teacher / Researcher';
                                case 'business': return isBangla ? 'ব্যবসায়ী' : 'Business Owner';
                                case 'other': return isBangla ? 'অন্যান্য' : 'Other';
                                default: return selectedVolunteer.profession || '—';
                              }
                            })()}
                          </div>
                        </div>
                      </div>

                      {/* Availability */}
                      <div className="flex items-start gap-2.5">
                        <Clock size={14} className="text-gray-400 mt-0.5" />
                        <div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase">{isBangla ? 'কাজের সময়' : 'Time Availability'}</div>
                          <div className="text-xs font-semibold text-gray-700">
                            {(() => {
                              switch (selectedVolunteer.availability) {
                                case 'flexible': return isBangla ? 'ফ্লেক্সিবল / প্রজেক্ট ভিত্তিক' : 'Flexible / Project Based';
                                case 'weekends': return isBangla ? 'শুধু সাপ্তাহিক ছুটির দিন' : 'Weekends Only';
                                case 'weekdays': return isBangla ? 'कर्मदिवस সমূহে' : 'Weekdays Only';
                                case 'fulltime': return isBangla ? 'ফুল-টাইম ডেডিকেশন' : 'Full-time Dedication';
                                default: return selectedVolunteer.availability || '—';
                              }
                            })()}
                          </div>
                        </div>
                      </div>

                      {/* Submitted Date */}
                      <div className="flex items-start gap-2.5">
                        <Calendar size={14} className="text-gray-400 mt-0.5" />
                        <div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase">{isBangla ? 'আবেদনের তারিখ' : 'Application Date'}</div>
                          <div className="text-xs font-semibold text-gray-700">
                            {new Date(selectedVolunteer.date).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Section: Admin Actions */}
                <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-black text-gray-500 uppercase tracking-wider font-mono">
                    <ShieldCheck size={14} className="text-[#1F5E2E]" />
                    <span>{isBangla ? 'অ্যাডমিন কন্ট্রোল: সদস্যপদ আপডেট' : 'Admin Action: Update Membership Status'}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <select
                      value={selectedVolunteer.membership || 'no_intent'}
                      onChange={(e) => handleUpdateVolunteerStatus(selectedVolunteer.id, e.target.value)}
                      className="flex-1 bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs font-bold text-gray-700 focus:ring-2 focus:ring-[#1F5E2E]/20 focus:border-[#1F5E2E] transition-all outline-none"
                    >
                      <option value="no_intent">{isBangla ? 'মাঠ ভলান্টিয়ার (Field Volunteer Only)' : 'Field Volunteer Only'}</option>
                      <option value="submitted_pending">{isBangla ? 'আবেদন পেন্ডিং (Submitted Form)' : 'Submitted Form'}</option>
                      <option value="already_member">{isBangla ? 'আজীবন সদস্য (Lifetime Member)' : 'Lifetime Member'}</option>
                    </select>
                    
                    <span className="text-[10px] text-[#1F5E2E] font-bold font-mono text-center sm:text-right bg-[#6BBF3A]/10 px-2.5 py-1.5 rounded-lg border border-[#6BBF3A]/20">
                      {isBangla ? 'তাত্ক্ষণিক আপডেট হবে' : 'Saves Instantly'}
                    </span>
                  </div>
                </div>

                {/* Section: Motivation / Intro Message */}
                <div className="space-y-3">
                  <h5 className="text-xs font-black text-gray-400 uppercase tracking-wider font-mono">
                    {isBangla ? 'স্বেচ্ছাসেবক হওয়ার মূল প্রেরণা ও বার্তা' : 'Motivation Message & Message Details'}
                  </h5>
                  <div className="bg-[#1F5E2E]/5 border border-[#1F5E2E]/10 rounded-2xl p-5 relative">
                    <span className="absolute right-5 top-4 text-[#1F5E2E]/15 font-serif text-6xl leading-none select-none">“</span>
                    <p className="text-gray-700 text-xs leading-relaxed font-sans font-medium whitespace-pre-wrap relative z-10">
                      {selectedVolunteer.message || (isBangla ? 'কোনো বার্তা প্রদান করা হয়নি।' : 'No custom message was submitted.')}
                    </p>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href={`mailto:${selectedVolunteer.email}`}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-[#1F5E2E] hover:bg-[#2E7D32] text-white py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm hover:shadow"
                  >
                    <Mail size={13} />
                    <span>{isBangla ? 'ইমেল পাঠান' : 'Send Email'}</span>
                  </a>
                  <a
                    href={`tel:${selectedVolunteer.phone}`}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-[#1F5E2E] border border-gray-200 py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    <Phone size={13} />
                    <span>{isBangla ? 'কল করুন' : 'Call Mobile'}</span>
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedVolunteer(null)}
                  className="w-full sm:w-auto py-2 px-5 border border-gray-200 hover:bg-gray-100 text-gray-700 bg-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
                >
                  {isBangla ? 'বন্ধ করুন' : 'Close Details'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
