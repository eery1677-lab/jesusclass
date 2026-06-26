import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import KidsDashboard from './views/kids/KidsDashboard';
import KidsNotices from './views/kids/KidsNotices';
import KidsAlbum from './views/kids/KidsAlbum';
import KidsAttendance from './views/kids/KidsAttendance';
import KidsDalant from './views/kids/KidsDalant';
import KidsMemoryVerse from './views/kids/KidsMemoryVerse';
import KidsSchedule from './views/kids/KidsSchedule';
import KidsSnack from './views/kids/KidsSnack';
import KidsBulletin from './views/kids/KidsBulletin';
import TeacherDashboard from './views/teacher/TeacherDashboard';
import TeacherNotices from './views/teacher/TeacherNotices';
import TeacherAlbum from './views/teacher/TeacherAlbum';
import TeacherAttendance from './views/teacher/TeacherAttendance';
import TeacherDalant from './views/teacher/TeacherDalant';
import TeacherBulletin from './views/teacher/TeacherBulletin';
import TeacherSnack from './views/teacher/TeacherSnack';
import TeacherSchedule from './views/teacher/TeacherSchedule';
import ChatModal from './components/ChatModal';
import ProfileEditModal from './components/ProfileEditModal';
import SettingsView from './views/Settings';
import Login from './views/auth/Login';
import { useStore } from './store/useStore';
import { AuthProvider } from './contexts/AuthContext';
import BannerAd from './components/ads/BannerAd';
import InterstitialAd from './components/ads/InterstitialAd';

function AppContent() {
  const { currentUser, authLoading, initFirebaseListeners } = useStore();
  
  useEffect(() => {
    initFirebaseListeners();
  }, [initFirebaseListeners]);
  
  const [activeTab, setActiveTab] = useState('kids-dashboard');
  
  useEffect(() => {
    if (currentUser) {
      setActiveTab(currentUser.role === 'teacher' ? 'teacher-dashboard' : 'kids-dashboard');
    }
  }, [currentUser?.id, currentUser?.role]);
  
  const [chatOpen, setChatOpen] = useState(false);
  const [navCount, setNavCount] = useState(0);
  const [showInterstitial, setShowInterstitial] = useState(false);

  useEffect(() => {
    setNavCount(prev => prev + 1);
  }, [activeTab]);

  useEffect(() => {
    if (navCount > 1 && navCount % 4 === 0) {
      setShowInterstitial(true);
    }
  }, [navCount]);

  const renderView = () => {
    switch (activeTab) {
      case 'kids-dashboard':    return <KidsDashboard setActiveTab={setActiveTab} />;
      case 'kids-notices':      return <KidsNotices setActiveTab={setActiveTab} />;
      case 'kids-album':        return <KidsAlbum setActiveTab={setActiveTab} />;
      case 'kids-attendance':   return <KidsAttendance setActiveTab={setActiveTab} />;
      case 'kids-dalant':       return <KidsDalant setActiveTab={setActiveTab} />;
      case 'kids-memory-verse': return <KidsMemoryVerse setActiveTab={setActiveTab} />;
      case 'kids-schedule':     return <KidsSchedule setActiveTab={setActiveTab} />;
      case 'kids-snack':        return <KidsSnack setActiveTab={setActiveTab} />;
      case 'kids-bulletin':     return <KidsBulletin setActiveTab={setActiveTab} />;
      case 'teacher-dashboard': return <TeacherDashboard setActiveTab={setActiveTab} />;
      case 'teacher-notices':   return <TeacherNotices setActiveTab={setActiveTab} />;
      case 'teacher-album':     return <TeacherAlbum setActiveTab={setActiveTab} />;
      case 'teacher-attendance':return <TeacherAttendance setActiveTab={setActiveTab} />;
      case 'teacher-dalant':    return <TeacherDalant setActiveTab={setActiveTab} />;
      case 'teacher-bulletin':  return <TeacherBulletin setActiveTab={setActiveTab} />;
      case 'teacher-snack':     return <TeacherSnack setActiveTab={setActiveTab} />;
      case 'teacher-schedule':  return <TeacherSchedule setActiveTab={setActiveTab} />;
      case 'settings':          return <SettingsView />;
      default:                  return <KidsDashboard />;
    }
  };

  if (authLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-main)', gap: '16px' }}>
        <div style={{ fontSize: '2rem' }}>✝</div>
        <div style={{ width: '36px', height: '36px', border: '3px solid rgba(99,102,241,0.2)', borderTop: '3px solid var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>예수클래스를 불러오는 중...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <Login />;
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} onOpenChat={() => setChatOpen(true)}>
      {renderView()}
      <div style={{ padding: '0 16px 16px', background: 'var(--bg-main)' }}>
        <BannerAd />
      </div>
      {showInterstitial && (
        <InterstitialAd onClose={() => setShowInterstitial(false)} />
      )}
      <ChatModal isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

