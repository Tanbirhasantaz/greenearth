/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Trees, Users, Activity, Award, FileSpreadsheet, Settings, ShieldAlert,
  Search, Check, X, Eye, FileText, Download, AlertCircle, Info, RefreshCw, Edit,
  Trash2, AlertTriangle
} from 'lucide-react';

interface GreenHeroAdminProps {
  isBangla?: boolean;
}

export default function GreenHeroAdmin({ isBangla = false }: GreenHeroAdminProps) {
  // 8 Admin subtabs
  type SubTab = 'dashboard' | 'participants' | 'trees' | 'logs' | 'leaderboard' | 'certificates' | 'export' | 'editor';
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('dashboard');

  // --- COMPONENT DATA STATE ---
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

  // Editor Inputs
  const [titleEn, setTitleEn] = useState('');
  const [titleBn, setTitleBn] = useState('');
  const [subtitleEn, setSubtitleEn] = useState('');
  const [subtitleBn, setSubtitleBn] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descBn, setDescBn] = useState('');

  // UI state filters
  const [partSearch, setPartSearch] = useState('');
  const [treeSearch, setTreeSearch] = useState('');
  const [logStatusFilter, setLogStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  
  // Log action states
  const [remarksInput, setRemarksInput] = useState<{ [key: string]: string }>({});
  const [successBanner, setSuccessBanner] = useState('');

  // Image zoom modal
  const [zoomImg, setZoomImg] = useState<string | null>(null);

  // Participant edit modal state
  const [editPartModal, setEditPartModal] = useState<any | null>(null);

  // Tree edit modal state
  const [editTreeModal, setEditTreeModal] = useState<any | null>(null);

  // Custom states for deletion confirmation modals (avoiding blocked window.confirm)
  const [deleteConfirmPart, setDeleteConfirmPart] = useState<any | null>(null);
  const [deleteConfirmTree, setDeleteConfirmTree] = useState<any | null>(null);
  const [deleteConfirmLog, setDeleteConfirmLog] = useState<any | null>(null);
  const [suspendConfirmPart, setSuspendConfirmPart] = useState<any | null>(null);

  // States for custom certificate template
  const [certTemplateImg, setCertTemplateImg] = useState<string | null>(() => localStorage.getItem('ge_gh_custom_cert_image') || null);
  const [certNameX, setCertNameX] = useState<number>(() => Number(localStorage.getItem('ge_gh_custom_cert_name_x')) || 50);
  const [certNameY, setCertNameY] = useState<number>(() => Number(localStorage.getItem('ge_gh_custom_cert_name_y')) || 53);
  const [certFontSize, setCertFontSize] = useState<number>(() => Number(localStorage.getItem('ge_gh_custom_cert_font_size')) || 36);
  const [certColor, setCertColor] = useState<string>(() => localStorage.getItem('ge_gh_custom_cert_color') || '#1b5e20');

  // Load all records from Server
  const loadAllData = async () => {
    try {
      // 1. Fetch Overview Settings
      const overviewRes = await fetch("/api/greenhero/overview");
      if (overviewRes.ok) {
        const overviewData = await overviewRes.json();
        if (overviewData) {
          setOverview(overviewData);
          setTitleEn(overviewData.titleEn || '');
          setTitleBn(overviewData.titleBn || '');
          setSubtitleEn(overviewData.subtitleEn || '');
          setSubtitleBn(overviewData.subtitleBn || '');
          setDescEn(overviewData.descriptionEn || '');
          setDescBn(overviewData.descriptionBn || '');
          localStorage.setItem('ge_gh_overview', JSON.stringify(overviewData));
        }
      }

      // 2. Fetch Participants
      const partsRes = await fetch("/api/greenhero/participants");
      if (partsRes.ok) {
        const partsData = await partsRes.json();
        setParticipants(partsData);
        localStorage.setItem('ge_gh_participants', JSON.stringify(partsData));
      }

      // 3. Fetch Trees
      const treesRes = await fetch("/api/greenhero/trees");
      if (treesRes.ok) {
        const treesData = await treesRes.json();
        setTrees(treesData);
        localStorage.setItem('ge_gh_trees', JSON.stringify(treesData));
      }

      // 4. Fetch Logs
      const logsRes = await fetch("/api/greenhero/logs");
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setLogs(logsData);
        localStorage.setItem('ge_gh_logs', JSON.stringify(logsData));
      }
    } catch (err) {
      console.error("Error loading admin Green Hero data from server:", err);
      // Fallback
      const savedParts = localStorage.getItem('ge_gh_participants');
      if (savedParts) setParticipants(JSON.parse(savedParts));
      const savedTrees = localStorage.getItem('ge_gh_trees');
      if (savedTrees) setTrees(JSON.parse(savedTrees));
      const savedLogs = localStorage.getItem('ge_gh_logs');
      if (savedLogs) setLogs(JSON.parse(savedLogs));
      const savedOverview = localStorage.getItem('ge_gh_overview');
      if (savedOverview) {
        try {
          const parsed = JSON.parse(savedOverview);
          setOverview(parsed);
          setTitleEn(parsed.titleEn || '');
          setTitleBn(parsed.titleBn || '');
          setSubtitleEn(parsed.subtitleEn || '');
          setSubtitleBn(parsed.subtitleBn || '');
          setDescEn(parsed.descriptionEn || '');
          setDescBn(parsed.descriptionBn || '');
        } catch (e) {}
      }
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // --- SAVE EDITOR ---
  const handleSaveOverview = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessBanner('');

    const updated = {
      titleEn: titleEn.trim(),
      titleBn: titleBn.trim(),
      subtitleEn: subtitleEn.trim(),
      subtitleBn: subtitleBn.trim(),
      descriptionEn: descEn.trim(),
      descriptionBn: descBn.trim()
    };

    fetch('/api/greenhero/overview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    })
      .then(res => res.json())
      .then(() => {
        setOverview(updated);
        localStorage.setItem('ge_gh_overview', JSON.stringify(updated));
        
        // Also keep settings.json in sync for fallback
        fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ greenHeroOverview: updated })
        }).catch(err => console.log(err));

        setSuccessBanner('Project Overview content updated successfully! (প্রকল্পের ওভারভিউ সফলভাবে আপডেট করা হয়েছে!)');
        setTimeout(() => setSuccessBanner(''), 4000);
        loadAllData();
      })
      .catch(err => {
        console.error(err);
        setSuccessBanner('Failed to update project overview. (প্রকল্পের ওভারভিউ আপডেট করতে ব্যর্থ হয়েছে।)');
        setTimeout(() => setSuccessBanner(''), 4000);
      });
  };

  // --- PARTICIPANT MANAGEMENT ACTIONS ---
  const handleUpdatePartStatus = (id: string, newStatus: 'Approved' | 'Suspended') => {
    fetch(`/api/greenhero/participants/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSuccessBanner(`Participant ${id} status updated to ${newStatus}.`);
          setTimeout(() => setSuccessBanner(''), 3000);
          loadAllData();
        }
      })
      .catch(err => console.error(err));
  };

  // --- CUSTOM CERTIFICATE TEMPLATE HANDLERS ---
  const handleCertTemplateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setSuccessBanner('Template must be less than 5MB. (টেমপ্লেট ৫ মেগাবাইটের কম হতে হবে)');
      setTimeout(() => setSuccessBanner(''), 4000);
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const base64 = event.target.result as string;
        setCertTemplateImg(base64);
        setSuccessBanner('Custom certificate template selected! Click "Save Certificate" below to persist it. (কাস্টম সার্টিফিকেট টেমপ্লেট নির্বাচন করা হয়েছে! এটি সংরক্ষণ করতে নিচের "সংরক্ষণ করুন" বাটনে ক্লিক করুন।)');
        setTimeout(() => setSuccessBanner(''), 5000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCertConfig = () => {
    if (certTemplateImg) {
      localStorage.setItem('ge_gh_custom_cert_image', certTemplateImg);
    } else {
      localStorage.removeItem('ge_gh_custom_cert_image');
    }
    localStorage.setItem('ge_gh_custom_cert_name_x', String(certNameX));
    localStorage.setItem('ge_gh_custom_cert_name_y', String(certNameY));
    localStorage.setItem('ge_gh_custom_cert_font_size', String(certFontSize));
    localStorage.setItem('ge_gh_custom_cert_color', certColor);
    setSuccessBanner('Certificate template and configuration saved successfully! (সার্টিফিকেট টেমপ্লেট ও কনফিগারেশন সফলভাবে সংরক্ষিত হয়েছে!)');
    setTimeout(() => setSuccessBanner(''), 4000);
  };

  const handleResetCertTemplate = () => {
    setCertTemplateImg(null);
    setCertNameX(50);
    setCertNameY(53);
    setCertFontSize(36);
    setCertColor('#1b5e20');
    localStorage.removeItem('ge_gh_custom_cert_image');
    localStorage.removeItem('ge_gh_custom_cert_name_x');
    localStorage.removeItem('ge_gh_custom_cert_name_y');
    localStorage.removeItem('ge_gh_custom_cert_font_size');
    localStorage.removeItem('ge_gh_custom_cert_color');
    setSuccessBanner('Certificate template reset to default. (সার্টিফিকেট টেমপ্লেট রিসেট করা হয়েছে।)');
    setTimeout(() => setSuccessBanner(''), 4000);
  };

  const handleDeletePart = (id: string) => {
    fetch(`/api/greenhero/participants/${id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSuccessBanner(`Participant ${id} has been deleted successfully. (অংশগ্রহণকারী ${id} সফলভাবে মুছে ফেলা হয়েছে।)`);
          setTimeout(() => setSuccessBanner(''), 4000);
          setDeleteConfirmPart(null);
          loadAllData();
        }
      })
      .catch(err => console.error(err));
  };

  const handleSaveParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPartModal) return;

    fetch(`/api/greenhero/participants/${editPartModal.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editPartModal)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEditPartModal(null);
          setSuccessBanner('Participant information updated successfully! (অংশগ্রহণকারীর তথ্য সফলভাবে আপডেট করা হয়েছে!)');
          setTimeout(() => setSuccessBanner(''), 4000);
          loadAllData();
        }
      })
      .catch(err => console.error(err));
  };

  const handleSaveTree = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTreeModal) return;

    fetch(`/api/greenhero/trees/${editTreeModal.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editTreeModal)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEditTreeModal(null);
          setSuccessBanner('Tree registry information updated successfully! (গাছ তথ্য সফলভাবে আপডেট করা হয়েছে!)');
          setTimeout(() => setSuccessBanner(''), 4000);
          loadAllData();
        }
      })
      .catch(err => console.error(err));
  };

  const handleDeleteTree = (id: string) => {
    fetch(`/api/greenhero/trees/${id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSuccessBanner(`Tree record ${id} has been deleted successfully. (গাছ রেকর্ড ${id} সফলভাবে মুছে ফেলা হয়েছে।)`);
          setTimeout(() => setSuccessBanner(''), 4000);
          setDeleteConfirmTree(null);
          loadAllData();
        }
      })
      .catch(err => console.error(err));
  };

  const handleTreePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setSuccessBanner('Photo must be less than 5MB. (ছবিটি ৫ মেগাবাইটের কম হতে হবে)');
      setTimeout(() => setSuccessBanner(''), 4000);
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result && editTreeModal) {
        setEditTreeModal({ ...editTreeModal, photo: event.target.result as string });
      }
    };
    reader.readAsDataURL(file);
  };

  // --- LOG AUDIT ACTIONS (APPROVE/REJECT) ---
  const handleAuditLog = (logId: string, isApproved: boolean) => {
    const remark = remarksInput[logId] || '';
    const status = isApproved ? 'Approved' : 'Rejected';
    const remarks = remark.trim() || (isApproved ? 'Approved by Admin (অ্যাডমিন কর্তৃক অনুমোদিত)' : 'Rejected by Admin (অ্যাডমিন কর্তৃক বাতিল)');

    fetch(`/api/greenhero/logs/${logId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, remarks })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Clear remarks input
          setRemarksInput(prev => ({ ...prev, [logId]: '' }));
          setSuccessBanner(`Log reviewed successfully! (লগ সফলভাবে পর্যালোচনা করা হয়েছে!)`);
          setTimeout(() => setSuccessBanner(''), 4000);
          loadAllData();
        }
      })
      .catch(err => console.error(err));
  };

  const handleDeleteLog = (logId: string) => {
    const targetLog = logs.find(l => l.id === logId);
    if (targetLog) {
      setDeleteConfirmLog(targetLog);
    }
  };

  const executeDeleteLog = (logId: string) => {
    fetch(`/api/greenhero/logs/${logId}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setDeleteConfirmLog(null);
          setSuccessBanner('Log deleted successfully. (প্রগতি লগটি সফলভাবে ডিলিট করা হয়েছে।)');
          setTimeout(() => setSuccessBanner(''), 3000);
          loadAllData();
        }
      })
      .catch(err => console.error(err));
  };

  const handleSuspendParticipantFromLog = (participantId: string) => {
    const targetPart = participants.find(p => p.id === participantId) || { id: participantId, name: participantId };
    setSuspendConfirmPart(targetPart);
  };

  const executeSuspendParticipant = (participantId: string) => {
    handleUpdatePartStatus(participantId, 'Suspended');
    setSuspendConfirmPart(null);
  };



  // --- CSV EXPORTER ---
  const downloadCSV = (type: 'participants' | 'trees' | 'logs') => {
    let csvContent = '';
    let fileName = '';

    if (type === 'participants') {
      fileName = 'green_hero_participants.csv';
      csvContent = 'Participant ID,Name,Type,Institution,Class/Grade,Mobile,District,Upazila,Registered Date,Status\n';
      participants.forEach(p => {
        csvContent += `"${p.id}","${p.name}","${p.type}","${p.institution}","${p.grade || ''}","${p.mobile}","${p.district}","${p.upazila}","${p.regDate}","${p.status}"\n`;
      });
    } else if (type === 'trees') {
      fileName = 'green_hero_tree_registry.csv';
      csvContent = 'Tree ID,Participant ID,Participant Name,Tree Name,Quantity,Type,Location,Planting Date,Status\n';
      trees.forEach(t => {
        csvContent += `"${t.id}","${t.participantId}","${t.participantName}","${t.treeName}","${t.quantity}","${t.treeType}","${t.location}","${t.plantingDate}","${t.status}"\n`;
      });
    } else if (type === 'logs') {
      fileName = 'green_hero_monitoring_logs.csv';
      csvContent = 'Log ID,Participant ID,Month,Health,Comments,Status,Admin Remarks,Date\n';
      logs.forEach(l => {
        csvContent += `"${l.id}","${l.participantId}","${l.month}","${l.health}","${l.comments}","${l.status}","${l.remarks || ''}","${l.date}"\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter logs for view
  const filteredLogs = logs.filter(l => {
    if (logStatusFilter === 'All') return true;
    return l.status === logStatusFilter;
  });

  // Calculate stats
  const totalPartsCount = participants.length;
  const totalTreesCount = trees.reduce((sum, t) => sum + t.quantity, 0);
  const pendingLogsCount = logs.filter(l => l.status === 'Pending').length;
  
  // Surviving count
  const deadParts = logs.filter(l => l.health?.startsWith('Dead') && l.status === 'Approved').map(l => l.participantId);
  const totalSurviving = trees.reduce((sum, t) => {
    if (deadParts.includes(t.participantId)) return sum;
    return sum + t.quantity;
  }, 0);
  
  const survivalRate = totalTreesCount > 0 ? Math.round((totalSurviving / totalTreesCount) * 100) : 100;

  // Active schools
  const totalSchools = Array.from(new Set(participants.filter(p => p.type === 'student').map(p => p.institution))).length;

  return (
    <div className="space-y-8 font-anek text-sm md:text-base" id="green-hero-admin-center">
      {/* Dynamic Success Toast */}
      {successBanner && (
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-xl text-emerald-800 text-xs font-semibold shadow flex items-center gap-2" id="admin-success-banner">
          <Check size={16} />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Admin Image Zoom Lightbox */}
      {zoomImg && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setZoomImg(null)}>
          <div className="relative max-w-3xl w-full text-center">
            <button className="absolute -top-10 right-0 text-white hover:text-gray-300 font-bold" onClick={() => setZoomImg(null)}>
              ✕ Close (বন্ধ করুন)
            </button>
            <img src={zoomImg} alt="Enlarged Progress Sapling" referrerPolicy="no-referrer" className="max-h-[80vh] mx-auto rounded-xl object-contain border border-gray-800" />
          </div>
        </div>
      )}

      {/* Participant Edit Modal */}
      {editPartModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-emerald-600 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden font-sans text-xs text-left">
            <div className="bg-[#1F5E2E] text-white p-5 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black flex items-center gap-2">
                  <Edit size={16} />
                  <span>Edit Participant Information (সদস্যের তথ্য পরিবর্তন)</span>
                </h3>
                <span className="text-[10px] text-emerald-100 font-mono font-bold mt-0.5">ID: {editPartModal.id}</span>
              </div>
              <button onClick={() => setEditPartModal(null)} className="text-white/80 hover:text-white font-bold text-base cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveParticipant} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Full Name (পূর্ণ নাম)</label>
                  <input
                    type="text"
                    required
                    value={editPartModal.name || ''}
                    onChange={(e) => setEditPartModal({ ...editPartModal, name: e.target.value })}
                    className="bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1F5E2E]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Mobile (মোবাইল নম্বর)</label>
                  <input
                    type="text"
                    required
                    value={editPartModal.mobile || ''}
                    onChange={(e) => setEditPartModal({ ...editPartModal, mobile: e.target.value })}
                    className="bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1F5E2E] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Participant Type (ধরন)</label>
                  <select
                    value={editPartModal.type || 'student'}
                    onChange={(e) => setEditPartModal({ ...editPartModal, type: e.target.value })}
                    className="bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1F5E2E]"
                  >
                    <option value="student">Student (শিক্ষার্থী)</option>
                    <option value="volunteer">Volunteer (স্বেচ্ছাসেবী)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Class / Grade (শ্রেণি)</label>
                  <input
                    type="text"
                    placeholder="e.g. Class 9, or N/A"
                    value={editPartModal.grade || ''}
                    disabled={editPartModal.type === 'volunteer'}
                    onChange={(e) => setEditPartModal({ ...editPartModal, grade: e.target.value })}
                    className={`bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1F5E2E] ${editPartModal.type === 'volunteer' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">School / Institution (শিক্ষা প্রতিষ্ঠান/ঠিকানা)</label>
                <input
                  type="text"
                  required
                  value={editPartModal.institution || ''}
                  onChange={(e) => setEditPartModal({ ...editPartModal, institution: e.target.value })}
                  className="bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1F5E2E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">District (জেলা)</label>
                  <input
                    type="text"
                    required
                    value={editPartModal.district || ''}
                    onChange={(e) => setEditPartModal({ ...editPartModal, district: e.target.value })}
                    className="bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1F5E2E]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Upazila (উপজেলা)</label>
                  <input
                    type="text"
                    required
                    value={editPartModal.upazila || ''}
                    onChange={(e) => setEditPartModal({ ...editPartModal, upazila: e.target.value })}
                    className="bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1F5E2E]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Status (অবস্থা)</label>
                <select
                  value={editPartModal.status || 'Approved'}
                  onChange={(e) => setEditPartModal({ ...editPartModal, status: e.target.value })}
                  className="bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1F5E2E]"
                >
                  <option value="Approved">Approved (অনুমোদিত)</option>
                  <option value="Suspended">Suspended (সাময়িক বরখাস্ত)</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditPartModal(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-bold cursor-pointer transition-colors text-center"
                >
                  Cancel (বাতিল)
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#1F5E2E] hover:bg-emerald-800 text-white py-2.5 rounded-xl font-bold cursor-pointer transition-colors text-center"
                >
                  Save Changes (সংরক্ষণ করুন)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tree Edit Modal */}
      {editTreeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-emerald-600 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden font-sans text-xs text-left">
            <div className="bg-[#1F5E2E] text-white p-5 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black flex items-center gap-2">
                  <Edit size={16} />
                  <span>Edit Tree Registry (গাছের তথ্য সংশোধন)</span>
                </h3>
                <span className="text-[10px] text-emerald-100 font-mono font-bold mt-0.5">Tree ID: {editTreeModal.id}</span>
              </div>
              <button onClick={() => setEditTreeModal(null)} className="text-white/80 hover:text-white font-bold text-base cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTree} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Owner ID & Name (মালিক)</label>
                  <div className="bg-gray-100 border border-gray-200 rounded-xl py-2 px-3 text-gray-600 font-semibold font-mono">
                    {editTreeModal.participantId} - {editTreeModal.participantName}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Species Name (প্রজাতি)</label>
                  <input
                    type="text"
                    required
                    value={editTreeModal.treeName || ''}
                    onChange={(e) => setEditTreeModal({ ...editTreeModal, treeName: e.target.value })}
                    className="bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1F5E2E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Quantity (পরিমাণ)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editTreeModal.quantity || 1}
                    onChange={(e) => setEditTreeModal({ ...editTreeModal, quantity: parseInt(e.target.value) || 1 })}
                    className="bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1F5E2E] font-mono font-bold"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Tree Type (গাছের ধরন)</label>
                  <select
                    value={editTreeModal.treeType || 'Fruit Tree (ফলজ বৃক্ষ)'}
                    onChange={(e) => setEditTreeModal({ ...editTreeModal, treeType: e.target.value })}
                    className="bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1F5E2E]"
                  >
                    <option value="Fruit Tree (ফলজ বৃক্ষ)">Fruit Tree (ফলজ বৃক্ষ)</option>
                    <option value="Forest Tree (বনজ বৃক্ষ)">Forest Tree (বনজ বৃক্ষ)</option>
                    <option value="Medicinal Tree (ঔষধি বৃক্ষ)">Medicinal Tree (ঔষধি বৃক্ষ)</option>
                    <option value="Indoor Plant (ইনডোর প্ল্যান্ট)">Indoor Plant (ইনডোর প্ল্যান্ট)</option>
                    <option value="Flower (ফুল)">Flower (ফুল)</option>
                    <option value="Flower Plant / Ornamental (ফুল বা শোভাবর্ধক গাছ)">Flower Plant / Ornamental (ফুল বা শোভাবর্ধক গাছ)</option>
                    <option value="Others (অন্যান্য)">Others (অন্যান্য)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Planting Date (রোপণের তারিখ)</label>
                  <input
                    type="date"
                    required
                    value={editTreeModal.plantingDate || ''}
                    onChange={(e) => setEditTreeModal({ ...editTreeModal, plantingDate: e.target.value })}
                    className="bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1F5E2E] font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Update Tree Photo (ছবি পরিবর্তন)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleTreePhotoUpload}
                    className="bg-gray-50 border border-gray-200 rounded-xl py-1.5 px-3 focus:ring-2 focus:ring-[#1F5E2E]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Location/Address (অবস্থান/ঠিকানা)</label>
                <textarea
                  required
                  rows={2}
                  value={editTreeModal.location || ''}
                  onChange={(e) => setEditTreeModal({ ...editTreeModal, location: e.target.value })}
                  className="bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1F5E2E]"
                />
              </div>

              {editTreeModal.photo && (
                <div className="space-y-1">
                  <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px] block">Photo Preview (গাছের ছবি প্রাকদর্শন)</span>
                  <div className="h-28 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 relative">
                    <img src={editTreeModal.photo} alt="Preview" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => setEditTreeModal({ ...editTreeModal, photo: '' })}
                      className="absolute top-1.5 right-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full px-2 py-1 text-[10px] font-bold"
                    >
                      ✕ Remove
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditTreeModal(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-bold cursor-pointer transition-colors text-center"
                >
                  Cancel (বাতিল)
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#1F5E2E] hover:bg-emerald-800 text-white py-2.5 rounded-xl font-bold cursor-pointer transition-colors text-center"
                >
                  Save Changes (সংরক্ষণ করুন)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- SUBTAB MENU CONTROLLERS (BILINGUAL) --- */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3" id="admin-subtabs">
        {[
          { id: 'dashboard', en: 'Dashboard Overview', bn: 'ড্যাশবোর্ড ওভারভিউ', icon: <RefreshCw size={14} /> },
          { id: 'participants', en: 'Participant Management', bn: 'অংশগ্রহণকারী ব্যবস্থাপনা', icon: <Users size={14} /> },
          { id: 'trees', en: 'Tree Registry', bn: 'গাছ রেজিস্ট্রি', icon: <Trees size={14} /> },
          { id: 'logs', en: 'Monitoring Logs Review', bn: 'মনিটরিং লগ পর্যালোচনা', icon: <Activity size={14} />, badge: pendingLogsCount },
          { id: 'certificates', en: 'Certificates & Badges', bn: 'সার্টিফিকেট ও ব্যাজ', icon: <Award size={14} /> },
          { id: 'export', en: 'Export Reports', bn: 'রিপোর্ট এক্সপোর্ট', icon: <FileSpreadsheet size={14} /> },
          { id: 'editor', en: 'Project Overview Editor', bn: 'প্রকল্পের ওভারভিউ এডিটর', icon: <Settings size={14} /> }
        ].map(sub => (
          <button
            key={sub.id}
            onClick={() => {
              setActiveSubTab(sub.id as SubTab);
              loadAllData();
            }}
            className={`py-2 px-4 rounded-full text-xs font-bold font-sans transition-all cursor-pointer border flex items-center gap-1.5 ${
              activeSubTab === sub.id
                ? 'bg-[#1F5E2E] border-[#1F5E2E] text-white shadow'
                : 'bg-white border-gray-200 text-gray-600 hover:text-[#1F5E2E] hover:bg-emerald-50/40'
            }`}
          >
            {sub.icon}
            <span>{sub.en} ({sub.bn})</span>
            {sub.badge !== undefined && sub.badge > 0 && (
              <span className="bg-red-500 text-white rounded-full text-[9px] px-1.5 py-0.2 ml-1">
                {sub.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* --- RENDERING ACTIVE SUBVIEW PANEL --- */}
      <div id="admin-green-hero-subtab-workspace">

        {/* SUBTAB 1: DASHBOARD OVERVIEW */}
        {activeSubTab === 'dashboard' && (
          <div className="space-y-6" id="subtab-dash">
            {/* Quick Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs text-left">
                <span className="text-[10px] font-mono font-bold text-gray-400 block uppercase">TOTAL REGISTRATIONS</span>
                <span className="text-2xl font-black text-[#1F5E2E] font-mono block mt-1">{totalPartsCount}</span>
                <span className="text-[9px] text-gray-500">Active Participants (গ্রিন হিরো সদস্য)</span>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs text-left">
                <span className="text-[10px] font-mono font-bold text-gray-400 block uppercase">TREES REGISTERED</span>
                <span className="text-2xl font-black text-[#1F5E2E] font-mono block mt-1">{totalTreesCount}</span>
                <span className="text-[9px] text-gray-500">Trees Seeded (মোট রোপিত চারা)</span>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs text-left">
                <span className="text-[10px] font-mono font-bold text-gray-400 block uppercase">SURVIVING CANOPY</span>
                <span className="text-2xl font-black text-emerald-700 font-mono block mt-1">{totalSurviving}</span>
                <span className="text-[9px] text-emerald-600">Verified Alive (টিকে আছে)</span>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs text-left">
                <span className="text-[10px] font-mono font-bold text-gray-400 block uppercase">SURVIVAL RATE</span>
                <span className="text-2xl font-black text-emerald-800 font-mono block mt-1">{survivalRate}%</span>
                <span className="text-[9px] text-gray-500">Target: 85% Minimum</span>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs text-left">
                <span className="text-[10px] font-mono font-bold text-gray-400 block uppercase">PENDING MONITORS</span>
                <span className="text-2xl font-black text-amber-600 font-mono block mt-1">{pendingLogsCount}</span>
                <span className="text-[9px] text-amber-500">Needs Audit Review (পর্যালোচনাধীন)</span>
              </div>
            </div>

            {/* Quick links banner */}
            <div className="bg-emerald-50 border border-emerald-200/40 p-6 rounded-3xl text-left flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="space-y-1">
                <h4 className="font-black text-[#1F5E2E] text-sm">
                  Active Monitoring Log Review Portal (মনিটরিং লগ পর্যালোচনা পোর্টাল)
                </h4>
                <p className="text-xs text-gray-600 font-medium">
                  Review submitted growth photos, read participant remarks, approve survival logs, or reject with custom feedback. (অংশগ্রহণকারীদের পাঠানো বৃদ্ধির ছবি পর্যালোচনা করুন, অনুমোদন দিন অথবা ত্রুটির কারণে মন্তব্যসহ বাতিল করুন।)
                </p>
              </div>
              <button 
                onClick={() => setActiveSubTab('logs')}
                className="bg-[#1F5E2E] hover:bg-[#2E7D32] text-white py-2 px-5 rounded-full text-xs font-bold cursor-pointer transition-colors shrink-0"
              >
                Go to Logs Review ({pendingLogsCount} Pending)
              </button>
            </div>


          </div>
        )}

        {/* SUBTAB 2: PARTICIPANT MANAGEMENT */}
        {activeSubTab === 'participants' && (
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6" id="subtab-parts">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <h4 className="text-lg font-black text-gray-900 text-left">
                Participants Registry (অংশগ্রহণকারী রেজিস্ট্রি)
              </h4>
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search by ID or Name..."
                  value={partSearch}
                  onChange={(e) => setPartSearch(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-full py-1.5 pl-9 pr-4 text-xs font-bold focus:ring-2 focus:ring-[#1F5E2E]"
                />
              </div>
            </div>

            <div className="overflow-x-auto text-xs text-left">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 font-bold border-b border-gray-100 uppercase tracking-wider">
                    <th className="py-3 px-4">Participant ID (আইডি)</th>
                    <th className="py-3 px-4">Name (নাম)</th>
                    <th className="py-3 px-4">Institution/Class (প্রতিষ্ঠান/শ্রেণি)</th>
                    <th className="py-3 px-4">District/Upazila (জেলা/উপজেলা)</th>
                    <th className="py-3 px-4">Mobile (মোবাইল)</th>
                    <th className="py-3 px-4">Registered Date (তারিখ)</th>
                    <th className="py-3 px-4 text-center">Status (অবস্থা)</th>
                    <th className="py-3 px-4 text-center">Actions (অ্যাকশন)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                  {participants.filter(p => 
                    p.id.toLowerCase().includes(partSearch.toLowerCase()) ||
                    p.name.toLowerCase().includes(partSearch.toLowerCase())
                  ).length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-gray-400 font-bold font-sans">
                        <Users size={32} className="mx-auto text-gray-300 mb-2" />
                        No participants registered. (কোনো অংশগ্রহণকারী পাওয়া যায়নি।)
                      </td>
                    </tr>
                  ) : (
                    participants.filter(p => 
                      p.id.toLowerCase().includes(partSearch.toLowerCase()) ||
                      p.name.toLowerCase().includes(partSearch.toLowerCase())
                    ).map((p, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50">
                        <td className="py-3.5 px-4 font-mono font-black text-[#1F5E2E]">{p.id}</td>
                        <td className="py-3.5 px-4 text-gray-900">{p.name}</td>
                        <td className="py-3.5 px-4 text-gray-500">
                          {p.institution} <span className="block text-[10px] text-gray-400 font-normal">{p.grade || 'N/A'}</span>
                        </td>
                        <td className="py-3.5 px-4 text-gray-500">
                          {p.upazila}, {p.district}
                        </td>
                        <td className="py-3.5 px-4 font-mono">{p.mobile}</td>
                        <td className="py-3.5 px-4 font-mono">{p.regDate}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`py-0.5 px-2 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                            p.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center space-x-1 whitespace-nowrap">
                          <button
                            onClick={() => setEditPartModal({ ...p })}
                            className="bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold py-1 px-2 rounded-md"
                            title="Edit Participant Details"
                          >
                            ✏️ Edit (সম্পাদনা)
                          </button>
                          {p.status !== 'Approved' ? (
                            <button
                              onClick={() => handleUpdatePartStatus(p.id, 'Approved')}
                              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold py-1 px-2 rounded-md"
                            >
                              Approve
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUpdatePartStatus(p.id, 'Suspended')}
                              className="bg-red-50 hover:bg-red-100 text-red-700 font-bold py-1 px-2 rounded-md"
                            >
                              Suspend
                            </button>
                          )}
                          <button
                            onClick={() => setDeleteConfirmPart(p)}
                            className="bg-gray-100 hover:bg-red-100 hover:text-red-700 text-gray-600 font-bold py-1 px-2 rounded-md"
                          >
                            ✕ Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUBTAB 3: TREE REGISTRY */}
        {activeSubTab === 'trees' && (
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6" id="subtab-trees">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <h4 className="text-lg font-black text-gray-900 text-left">
                Tree Registry Inventory (গাছ রেজিস্ট্রি তালিকা)
              </h4>
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search species or owner ID..."
                  value={treeSearch}
                  onChange={(e) => setTreeSearch(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-full py-1.5 pl-9 pr-4 text-xs font-bold focus:ring-2 focus:ring-[#1F5E2E]"
                />
              </div>
            </div>

            <div className="overflow-x-auto text-xs text-left">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 font-bold border-b border-gray-100 uppercase tracking-wider">
                    <th className="py-3 px-4">Tree ID (গাছ আইডি)</th>
                    <th className="py-3 px-4">Owner ID (মালিক আইডি)</th>
                    <th className="py-3 px-4">Owner Name (মালিকের নাম)</th>
                    <th className="py-3 px-4">Species Name (প্রজাতি)</th>
                    <th className="py-3 px-4 text-center">Qty (পরিমাণ)</th>
                    <th className="py-3 px-4">Type (ধরন)</th>
                    <th className="py-3 px-4">Planting Date (তারিখ)</th>
                    <th className="py-3 px-4">Location (অবস্থান)</th>
                    <th className="py-3 px-4 text-center">Photo Preview (ছবি)</th>
                    <th className="py-3 px-4 text-center">Actions (অ্যাকশন)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                  {trees.filter(t => 
                    t.treeName.toLowerCase().includes(treeSearch.toLowerCase()) ||
                    t.participantId.toLowerCase().includes(treeSearch.toLowerCase())
                  ).length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-gray-400 font-bold font-sans">
                        <Trees size={32} className="mx-auto text-gray-300 mb-2" />
                        No trees registered. (কোনো গাছ রেজিস্ট্রি পাওয়া যায়নি।)
                      </td>
                    </tr>
                  ) : (
                    trees.filter(t => 
                      t.treeName.toLowerCase().includes(treeSearch.toLowerCase()) ||
                      t.participantId.toLowerCase().includes(treeSearch.toLowerCase())
                    ).map((t, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50">
                        <td className="py-3.5 px-4 font-mono font-bold text-gray-500">{t.id}</td>
                        <td className="py-3.5 px-4 font-mono font-black text-[#1F5E2E]">{t.participantId}</td>
                        <td className="py-3.5 px-4 text-gray-900">{t.participantName}</td>
                        <td className="py-3.5 px-4 text-[#1F5E2E] font-bold">{t.treeName}</td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold">{t.quantity}</td>
                        <td className="py-3.5 px-4 text-gray-500">{t.treeType}</td>
                        <td className="py-3.5 px-4 font-mono">{t.plantingDate}</td>
                        <td className="py-3.5 px-4 text-gray-500 max-w-[150px] truncate" title={t.location}>{t.location}</td>
                        <td className="py-3.5 px-4 text-center">
                          {t.photo ? (
                            <button
                              onClick={() => setZoomImg(t.photo)}
                              className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-[#1F5E2E] p-1 rounded-lg border border-emerald-200/50"
                              title="View Tree Photo"
                            >
                              <img src={t.photo} alt="sapling" referrerPolicy="no-referrer" className="w-8 h-8 rounded object-cover" />
                              <Eye size={10} />
                            </button>
                          ) : 'No Image'}
                        </td>
                        <td className="py-3.5 px-4 text-center space-x-1 whitespace-nowrap">
                          <button
                            onClick={() => setEditTreeModal({ ...t })}
                            className="bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold py-1 px-2 rounded-md"
                            title="Edit Tree Details"
                          >
                            ✏️ Edit (সম্পাদনা)
                          </button>
                          <button
                            onClick={() => setDeleteConfirmTree(t)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 font-bold py-1 px-2 rounded-md transition-colors"
                            title="Delete Tree Details"
                          >
                            ✕ Delete (মুছে ফেলুন)
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUBTAB 4: MONITORING LOGS REVIEW */}
        {activeSubTab === 'logs' && (
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6" id="subtab-logs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div className="text-left">
                <h4 className="text-lg font-black text-gray-900">
                  Monthly Growth Logs Review (মাসিক প্রগতি লগ পর্যালোচনা)
                </h4>
                <p className="text-[11px] text-gray-400 font-semibold mt-0.5">
                  Approve or reject monthly growth progression logs uploaded by participants. (অংশগ্রহণকারীদের পাঠানো মাসিক ডায়েরি ও ছবি পর্যালোচনা করুন।)
                </p>
              </div>

              {/* Status Filters */}
              <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
                {['All', 'Pending', 'Approved', 'Rejected'].map((st: any) => (
                  <button
                    key={st}
                    onClick={() => setLogStatusFilter(st)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                      logStatusFilter === st
                        ? 'bg-[#1F5E2E] text-white shadow-xs'
                        : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 text-xs font-sans text-left">
              {filteredLogs.length === 0 ? (
                <div className="text-gray-400 font-bold text-center py-12 bg-gray-50 rounded-2xl">
                  No logs matching filter. (কোনো প্রগতি লগ পাওয়া যায়নি।)
                </div>
              ) : (
                filteredLogs.map((l, idx) => (
                  <div key={idx} className="bg-gray-50 border border-gray-200/70 rounded-2xl p-6 flex flex-col md:flex-row gap-6 relative overflow-hidden">
                    
                    {/* Status Badge in Corner */}
                    <span className={`absolute top-4 right-4 py-1 px-3 rounded-full font-black text-[9px] uppercase tracking-wider ${
                      l.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                      l.status === 'Pending' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-red-100 text-red-800'
                    }`}>
                      {l.status}
                    </span>

                    {/* Progress Photo Thumbnail Zoomable */}
                    <div className="w-full md:w-32 h-32 rounded-xl overflow-hidden bg-white border border-gray-200 shrink-0 relative group">
                      <img src={l.photo} alt="Sapling growth" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setZoomImg(l.photo)}
                        className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold cursor-pointer"
                      >
                        <Eye size={18} />
                      </button>
                    </div>

                    {/* Detailed Metadata fields */}
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-3 rounded-xl border border-gray-200/50">
                        <div>
                          <span className="block text-gray-400 font-bold text-[9px] uppercase">Log ID:</span>
                          <span className="font-bold text-gray-900 font-mono">{l.id}</span>
                        </div>
                        <div>
                          <span className="block text-gray-400 font-bold text-[9px] uppercase">Owner Participant:</span>
                          <span className="font-bold text-[#1F5E2E] font-mono">{l.participantId}</span>
                        </div>
                        <div>
                          <span className="block text-gray-400 font-bold text-[9px] uppercase">Monitored Month:</span>
                          <span className="font-black text-emerald-800">Month {l.month} ({l.month}ম মাস)</span>
                        </div>
                        <div>
                          <span className="block text-gray-400 font-bold text-[9px] uppercase">Health:</span>
                          <span className="font-bold text-gray-800">{l.health}</span>
                        </div>
                      </div>

                      {/* Participant Comments */}
                      <div>
                        <span className="block text-gray-400 font-bold text-[9px] uppercase">Comments (স্বেচ্ছাসেবীর মন্তব্য):</span>
                        <p className="text-gray-700 font-medium italic mt-0.5">"{l.comments || 'No comments submitted'}"</p>
                      </div>

                      {l.remarks && (
                        <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                          <span className="block text-[#1F5E2E] font-bold text-[9px] uppercase">Admin Audit Remarks:</span>
                          <p className="text-[#1F5E2E] font-bold mt-0.5">{l.remarks}</p>
                        </div>
                      )}

                      {/* Action workflow (only shown if log is Pending) */}
                      {l.status === 'Pending' && (
                        <div className="pt-3 border-t border-gray-200/60 flex flex-col sm:flex-row items-center gap-3">
                          <input
                            type="text"
                            placeholder="Add remarks (e.g. Great growth, or Please re-upload with clear photo)"
                            value={remarksInput[l.id] || ''}
                            onChange={(e) => setRemarksInput({ ...remarksInput, [l.id]: e.target.value })}
                            className="flex-grow bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs focus:ring-2 focus:ring-[#1F5E2E] focus:outline-none"
                          />
                          <div className="flex gap-2 w-full sm:w-auto">
                            <button
                              onClick={() => handleAuditLog(l.id, true)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-xl cursor-pointer shadow-xs whitespace-nowrap"
                            >
                              Approve Log (অনুমোদন)
                            </button>
                            <button
                              onClick={() => handleAuditLog(l.id, false)}
                              className="bg-red-50 hover:bg-red-100 text-red-700 font-bold py-2 px-4 rounded-xl cursor-pointer whitespace-nowrap"
                            >
                              Reject Log (বাতিল)
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Persistent Quick Admin Actions (Delete Log / Suspend Owner) */}
                      <div className="pt-3 border-t border-gray-200/60 flex flex-wrap gap-2 items-center justify-between text-[11px] font-bold">
                        <span className="text-gray-400">Quick Actions (দ্রুত অ্যাকশন):</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSuspendParticipantFromLog(l.participantId)}
                            className="bg-amber-50 hover:bg-amber-100 text-amber-700 hover:text-amber-800 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            Suspend Participant (সদস্য সাসপেন্ড)
                          </button>
                          <button
                            onClick={() => handleDeleteLog(l.id)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            Delete Log (লগ ডিলিট)
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* SUBTAB 5: CERTIFICATE AND BADGE LIST */}
        {activeSubTab === 'certificates' && (
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6" id="subtab-cert">
            <div className="border-b border-gray-100 pb-3 text-left">
              <h4 className="text-lg font-black text-gray-900">
                Green Hero Certification & Badges (গ্রিন হিরো স্বীকৃতি ও ব্যাজ)
              </h4>
              <p className="text-[11px] text-gray-400 font-semibold mt-0.5">
                Eligible participants who successfully completed all three months of tree monitoring. (যেসব সদস্য সফলভাবে ৩টি লগেরই চূড়ান্ত অনুমোদন পেয়েছেন, তাদের স্বীকৃতি দেওয়ার তালিকা।)
              </p>
            </div>

            {/* Custom Certificate Template Upload Section */}
            <div className="bg-emerald-50/50 border border-emerald-100/70 rounded-3xl p-6 text-left space-y-6 font-anek">
              <div className="flex items-center gap-2 text-[#1F5E2E]">
                <Award size={20} className="fill-[#1F5E2E]/20" />
                <h5 className="font-black text-sm uppercase tracking-wide">
                  Upload Custom Certificate Template (কাস্টম সার্টিফিকেট টেমপ্লেট আপলোড)
                </h5>
              </div>

              <p className="text-xs text-gray-600 font-semibold leading-relaxed">
                Upload a blank certificate image (JPG format). Leave the participant's name area blank on the image. The system will automatically overlay the participant's name on top of the image! 
                <span className="block mt-1 text-[#1F5E2E] font-bold font-anek text-sm">
                  (একটি ফাঁকা সার্টিফিকেট ছবি আপলোড করুন - JPG ফরম্যাটে। নামের জায়গাটি খালি রাখবেন, সেখানে অংশগ্রণকারীর নাম সিস্টেম স্বয়ংক্রিয়ভাবে বসিয়ে দেবে।)
                </span>
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Control Panel */}
                <div className="space-y-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-xs text-xs font-semibold">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider font-anek">Select Certificate JPG (জেপিজি ফাইল নির্বাচন করুন)</label>
                    <input 
                      type="file" 
                      accept="image/jpeg, image/jpg"
                      onChange={handleCertTemplateUpload}
                      className="bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1F5E2E] font-sans font-bold text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider font-anek">
                        Horizontal Name X Position (%) (নামের অনুভূমিক অবস্থান)
                      </label>
                      <input 
                        type="range" 
                        min="10" 
                        max="90" 
                        value={certNameX}
                        onChange={(e) => setCertNameX(Number(e.target.value))}
                        className="w-full accent-[#1F5E2E]"
                      />
                      <span className="font-mono text-xs text-gray-500 font-bold">{certNameX}% from left</span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider font-anek">
                        Vertical Name Y Position (%) (নামের উল্লম্ব অবস্থান)
                      </label>
                      <input 
                        type="range" 
                        min="20" 
                        max="80" 
                        value={certNameY}
                        onChange={(e) => setCertNameY(Number(e.target.value))}
                        className="w-full accent-[#1F5E2E]"
                      />
                      <span className="font-mono text-xs text-gray-500 font-bold">{certNameY}% from top</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider font-anek">
                        Font Size (px) (ফন্ট সাইজ)
                      </label>
                      <input 
                        type="range" 
                        min="16" 
                        max="72" 
                        value={certFontSize}
                        onChange={(e) => setCertFontSize(Number(e.target.value))}
                        className="w-full accent-[#1F5E2E]"
                      />
                      <span className="font-mono text-xs text-gray-500 font-bold">{certFontSize}px</span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider font-anek">Name Text Color (লেখার কালার)</label>
                      <div className="flex gap-2 items-center">
                        <input 
                          type="color" 
                          value={certColor}
                          onChange={(e) => setCertColor(e.target.value)}
                          className="w-8 h-8 border border-gray-200 rounded cursor-pointer shrink-0"
                        />
                        <input 
                          type="text" 
                          value={certColor}
                          onChange={(e) => setCertColor(e.target.value)}
                          className="bg-gray-50 border border-gray-200 rounded-xl py-1 px-2.5 font-mono text-[11px] font-bold w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={handleSaveCertConfig}
                      className="flex-1 bg-[#1F5E2E] hover:bg-emerald-800 text-white py-2.5 px-4 rounded-xl text-xs font-black transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 font-anek"
                    >
                      <span>💾 Save Certificate (সংরক্ষণ করুন)</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleResetCertTemplate}
                      className="bg-gray-100 hover:bg-red-50 hover:text-red-700 text-gray-600 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer font-anek"
                    >
                      Reset (রিসেট)
                    </button>
                  </div>
                </div>

                {/* Preview Panel */}
                <div className="space-y-2 font-anek">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Live Template Preview (লাইভ প্রাকদর্শন)</span>
                  <div className="relative border-4 border-[#1F5E2E] rounded-2xl overflow-hidden shadow-md aspect-[4/3] bg-gray-100 flex items-center justify-center">
                    {certTemplateImg ? (
                      <div className="w-full h-full relative">
                        <img 
                          src={certTemplateImg} 
                          alt="Custom Template" 
                          className="w-full h-full object-contain bg-white"
                          referrerPolicy="no-referrer"
                        />
                        <div 
                          className="absolute text-center select-none font-sans font-black tracking-wide font-anek pointer-events-none"
                          style={{ 
                            top: `${certNameY}%`, 
                            left: `${certNameX}%`,
                            transform: 'translateX(-50%)',
                            fontSize: `${certFontSize * 0.5}px`, // scale down font size slightly for responsive admin preview card
                            color: certColor,
                            textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                            width: '90%'
                          }}
                        >
                          Sample Participant (নমুনা নাম)
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-6 text-gray-400 space-y-2">
                        <Award size={48} className="mx-auto text-gray-300" />
                        <p className="text-xs font-bold">Using Built-in Default Template</p>
                        <p className="text-[10px] text-gray-400">Upload a JPG above to customize! (কাস্টমাইজ করতে উপরে ছবি আপলোড করুন)</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto text-xs text-left">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 font-bold border-b border-gray-100 uppercase tracking-wider">
                    <th className="py-3 px-4">Participant ID (আইডি)</th>
                    <th className="py-3 px-4">Name (নাম)</th>
                    <th className="py-3 px-4">Institution (শিক্ষা প্রতিষ্ঠান)</th>
                    <th className="py-3 px-4 text-center">Month 1</th>
                    <th className="py-3 px-4 text-center">Month 2</th>
                    <th className="py-3 px-4 text-center">Month 3</th>
                    <th className="py-3 px-4 text-center">Certificate Status (সার্টিফিকেট)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                  {participants.map((p, idx) => {
                    const m1 = logs.find(l => l.participantId === p.id && l.month === 1)?.status || 'None';
                    const m2 = logs.find(l => l.participantId === p.id && l.month === 2)?.status || 'None';
                    const m3 = logs.find(l => l.participantId === p.id && l.month === 3)?.status || 'None';
                    const isEligible = m3 === 'Approved';

                    return (
                      <tr key={idx} className="hover:bg-gray-50/50">
                        <td className="py-3.5 px-4 font-mono font-black text-[#1F5E2E]">{p.id}</td>
                        <td className="py-3.5 px-4 text-gray-900 font-bold">{p.name}</td>
                        <td className="py-3.5 px-4 text-gray-500">{p.institution || 'Volunteer'}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`py-0.5 px-1.5 rounded text-[10px] font-bold ${m1 === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-400'}`}>
                            {m1 === 'Approved' ? '✓ Approved' : m1}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`py-0.5 px-1.5 rounded text-[10px] font-bold ${m2 === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-400'}`}>
                            {m2 === 'Approved' ? '✓ Approved' : m2}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`py-0.5 px-1.5 rounded text-[10px] font-bold ${m3 === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-400'}`}>
                            {m3 === 'Approved' ? '✓ Approved' : m3}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {isEligible ? (
                            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 py-1 px-3 rounded-full font-black text-[10px] tracking-wide uppercase">
                              <Award size={12} fill="currentColor" />
                              <span>CERTIFIED HERO (গ্রিন হিরো)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-400 py-1 px-3 rounded-full text-[10px]">
                              In Progress (চলমান)
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUBTAB 6: EXPORT REPORTS */}
        {activeSubTab === 'export' && (
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6" id="subtab-export">
            <div className="border-b border-gray-100 pb-3 text-left">
              <h4 className="text-lg font-black text-gray-900">
                Export System Data (সিস্টেম ডাটা এক্সপোর্ট)
              </h4>
              <p className="text-[11px] text-gray-400 font-semibold mt-0.5">
                Download fully formatted CSV spreadsheets for monitoring reports and external verification. (ভেরিফিকেশনের সুবিধার্থে স্প্রেডশিট ডাউনলোড করুন।)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
              {/* Card 1 */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-left space-y-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <FileSpreadsheet size={24} />
                </div>
                <div>
                  <h5 className="font-black text-gray-900 text-sm">Participants List CSV</h5>
                  <p className="text-[11px] text-gray-500 mt-1">Download complete student/volunteer profile registers including location and status.</p>
                </div>
                <button
                  onClick={() => downloadCSV('participants')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl text-xs cursor-pointer transition-colors flex items-center justify-center gap-2"
                >
                  <Download size={14} /> Download CSV (ডাউনলোড করুন)
                </button>
              </div>

              {/* Card 2 */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-left space-y-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <Trees size={24} />
                </div>
                <div>
                  <h5 className="font-black text-gray-900 text-sm">Tree Registry CSV</h5>
                  <p className="text-[11px] text-gray-500 mt-1">Download full registered tree species inventory containing planting locations and details.</p>
                </div>
                <button
                  onClick={() => downloadCSV('trees')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-xl text-xs cursor-pointer transition-colors flex items-center justify-center gap-2"
                >
                  <Download size={14} /> Download CSV (ডাউনলোড করুন)
                </button>
              </div>

              {/* Card 3 */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-left space-y-4">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                  <Activity size={24} />
                </div>
                <div>
                  <h5 className="font-black text-gray-900 text-sm">Monitoring Logs CSV</h5>
                  <p className="text-[11px] text-gray-500 mt-1">Download raw historical monitoring entries, growth logs, health states, and remarks.</p>
                </div>
                <button
                  onClick={() => downloadCSV('logs')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-xl text-xs cursor-pointer transition-colors flex items-center justify-center gap-2"
                >
                  <Download size={14} /> Download CSV (ডাউনলোড করুন)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 7: PROJECT OVERVIEW EDITOR */}
        {activeSubTab === 'editor' && (
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-left" id="subtab-overview-editor">
            <div className="border-b border-gray-100 pb-3">
              <h4 className="text-lg font-black text-[#1F5E2E] flex items-center gap-2">
                <Settings size={20} />
                <span>Project Overview Editor (প্রকল্পের ওভারভিউ এডিটর)</span>
              </h4>
              <p className="text-xs text-gray-400 font-semibold mt-0.5">
                Directly edit the front-facing description text, titles, and headings for the public Green Hero landing screen! (গ্রিন হিরো পাবলিক পেজের শিরোনাম ও বর্ণনা সরাসরি এখান থেকে এডিট করুন।)
              </p>
            </div>

            <form onSubmit={handleSaveOverview} className="space-y-6 font-sans text-xs">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title EN */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-gray-500 uppercase tracking-wider">Project Title (English)</label>
                  <input
                    type="text"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="e.g. Green Hero Initiative (Adapt a Tree)"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#1F5E2E]"
                    required
                  />
                </div>

                {/* Title BN */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-gray-500 uppercase tracking-wider">Project Title (Bangla / বাংলা)</label>
                  <input
                    type="text"
                    value={titleBn}
                    onChange={(e) => setTitleBn(e.target.value)}
                    placeholder="যেমন: গ্রিন হিরো ইনিশিয়েটিভ - একটি গাছ দত্তক নিন"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#1F5E2E]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Subtitle EN */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-gray-500 uppercase tracking-wider">Project Subtitle (English)</label>
                  <input
                    type="text"
                    value={subtitleEn}
                    onChange={(e) => setSubtitleEn(e.target.value)}
                    placeholder="e.g. Plant Trees Today, Protect Tomorrow"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#1F5E2E]"
                    required
                  />
                </div>

                {/* Subtitle BN */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-gray-500 uppercase tracking-wider">Project Subtitle (Bangla / বাংলা)</label>
                  <input
                    type="text"
                    value={subtitleBn}
                    onChange={(e) => setSubtitleBn(e.target.value)}
                    placeholder="যেমন: আজই বৃক্ষরোপণ করুন, আগামীকে সুরক্ষিত রাখুন"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#1F5E2E]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Description EN */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-gray-500 uppercase tracking-wider">Campaign Description (English)</label>
                  <textarea
                    rows={6}
                    value={descEn}
                    onChange={(e) => setDescEn(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#1F5E2E]"
                    required
                  />
                </div>

                {/* Description BN */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-gray-500 uppercase tracking-wider">Campaign Description (Bangla / বাংলা)</label>
                  <textarea
                    rows={6}
                    value={descBn}
                    onChange={(e) => setDescBn(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#1F5E2E]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#1F5E2E] hover:bg-[#2E7D32] text-white font-black py-4 rounded-xl shadow cursor-pointer transition-all text-center text-xs"
              >
                Save Settings & Update Public Interface (সেটিংস সংরক্ষণ করুন)
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Custom Confirmation Modal: Participant Deletion */}
      {deleteConfirmPart && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border-2 border-red-200 text-left space-y-6">
            <div className="flex items-center gap-3 text-red-600">
              <ShieldAlert size={28} />
              <h3 className="text-lg font-black font-sans">
                Confirm Deletion (মুছে ফেলার নিশ্চিতকরণ)
              </h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed font-semibold">
              Are you sure you want to delete participant <strong className="text-red-700 font-mono">{deleteConfirmPart.id}</strong> ({deleteConfirmPart.name})? 
              <span className="block mt-2 text-red-600 font-bold font-anek">
                (আপনি কি নিশ্চিতভাবে অংশগ্রহণকারী {deleteConfirmPart.name} মুছে ফেলতে চান? তার সব রোপিত চারা এবং মনিটরিং লগ বজায় থাকবে।)
              </span>
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmPart(null)}
                className="flex-grow bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl transition-colors cursor-pointer text-center text-xs"
              >
                No, Cancel (বাতিল)
              </button>
              <button
                type="button"
                onClick={() => handleDeletePart(deleteConfirmPart.id)}
                className="flex-grow bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl transition-colors cursor-pointer text-center text-xs shadow-md shadow-red-200"
              >
                Yes, Delete (মুছে ফেলুন)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal: Tree Deletion */}
      {deleteConfirmTree && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border-2 border-red-200 text-left space-y-6">
            <div className="flex items-center gap-3 text-red-600">
              <ShieldAlert size={28} />
              <h3 className="text-lg font-black font-sans">
                Confirm Deletion (মুছে ফেলার নিশ্চিতকরণ)
              </h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed font-semibold">
              Are you sure you want to delete tree record <strong className="text-red-700 font-mono">{deleteConfirmTree.id}</strong> ({deleteConfirmTree.treeName})?
              <span className="block mt-2 text-red-600 font-bold font-anek">
                (আপনি কি নিশ্চিতভাবে এই গাছের রেকর্ড {deleteConfirmTree.treeName} মুছে ফেলতে চান?)
              </span>
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmTree(null)}
                className="flex-grow bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl transition-colors cursor-pointer text-center text-xs"
              >
                No, Cancel (বাতিল)
              </button>
              <button
                type="button"
                onClick={() => handleDeleteTree(deleteConfirmTree.id)}
                className="flex-grow bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl transition-colors cursor-pointer text-center text-xs shadow-md shadow-red-200"
              >
                Yes, Delete (মুছে ফেলুন)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal: Log Deletion */}
      {deleteConfirmLog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border-2 border-red-200 text-left space-y-6">
            <div className="flex items-center gap-3 text-red-600">
              <ShieldAlert size={28} />
              <h3 className="text-lg font-black font-sans">
                Confirm Log Deletion (লগ মুছে ফেলার নিশ্চিতকরণ)
              </h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed font-semibold">
              Are you sure you want to delete this tree growth log <strong className="text-red-700 font-mono">{deleteConfirmLog.id}</strong> (Month {deleteConfirmLog.month})?
              <span className="block mt-2 text-red-600 font-bold font-anek">
                (আপনি কি নিশ্চিতভাবে এই প্রগতি লগটি ডিলিট করতে চান?)
              </span>
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmLog(null)}
                className="flex-grow bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl transition-colors cursor-pointer text-center text-xs"
              >
                No, Cancel (বাতিল)
              </button>
              <button
                type="button"
                onClick={() => executeDeleteLog(deleteConfirmLog.id)}
                className="flex-grow bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl transition-colors cursor-pointer text-center text-xs shadow-md shadow-red-200"
              >
                Yes, Delete (মুছে ফেলুন)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal: Participant Suspension */}
      {suspendConfirmPart && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border-2 border-amber-200 text-left space-y-6">
            <div className="flex items-center gap-3 text-amber-600">
              <AlertTriangle size={28} />
              <h3 className="text-lg font-black font-sans">
                Confirm Suspension (সাময়িক বরখাস্ত নিশ্চিতকরণ)
              </h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed font-semibold">
              Are you sure you want to suspend participant <strong className="text-amber-700 font-mono">{suspendConfirmPart.id}</strong> ({suspendConfirmPart.name})?
              <span className="block mt-2 text-amber-600 font-bold font-anek">
                (আপনি কি নিশ্চিতভাবে এই অংশগ্রহণকারীকে সাময়িক বরখাস্ত করতে চান?)
              </span>
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setSuspendConfirmPart(null)}
                className="flex-grow bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl transition-colors cursor-pointer text-center text-xs"
              >
                No, Cancel (বাতিল)
              </button>
              <button
                type="button"
                onClick={() => executeSuspendParticipant(suspendConfirmPart.id)}
                className="flex-grow bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl transition-colors cursor-pointer text-center text-xs shadow-md shadow-amber-200"
              >
                Yes, Suspend (বরখাস্ত করুন)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
