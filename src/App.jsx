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
  const { currentUser, authLoading, initFirebaseListeners, chatOpen, setChatOpen } = useStore();
  
  useEffect(() => {
    initFirebaseListeners();
  }, [initFirebaseListeners]);
  
  const [activeTab, setActiveTab] = useState('kids-dashboard');
  
  // currentUser가 로드될 때마다 (role이 확정될 때) 올바른 탭으로 이동
  // currentUser.uid를 사용 — 교사는 id가 null이므로 uid 기준으로 추적
  useEffect(() => {
    if (currentUser && currentUser.role && !currentUser.needsRoleSelection) {
      setActiveTab(currentUser.role === 'teacher' ? 'teacher-dashboard' : 'kids-dashboard');
    }
  }, [currentUser?.uid, currentUser?.role, currentUser?.needsRoleSelection]);
  
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [hasShownInitialAd, setHasShownInitialAd] = useState(false);

  // 대표님 요청: 로그인 후 메인에 최초 진입할 때 단 한 번만 전면 광고를 띄워줍니다.
  useEffect(() => {
    if (currentUser && !hasShownInitialAd) {
      setShowInterstitial(true);
      setHasShownInitialAd(true);
    }
  }, [currentUser, hasShownInitialAd]);

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
      case 'settings':          return <SettingsView setActiveTab={setActiveTab} />;
      default:                  return <KidsDashboard />;
    }
  };

  if (authLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-main)', gap: '20px' }}>
        {/* 네온 형광 테두리와 나무색 십자가 컨테이너 */}
        <div style={{
          width: '74px',
          height: '74px',
          borderRadius: '20px',
          border: '2px solid rgba(16, 185, 129, 0.8)',
          background: 'var(--bg-card)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(16, 185, 129, 0.25), inset 0 0 10px rgba(16, 185, 129, 0.1)',
          animation: 'neon-breathe 2s ease-in-out infinite',
          position: 'relative'
        }}>
          <span style={{ fontSize: '2.5rem', color: '#8d6e63', transform: 'translateY(-2px)', fontFamily: 'serif', fontWeight: 'bold' }}>✝</span>
        </div>
        
        {/* 연녹색 로딩 스피너 */}
        <div style={{ 
          width: '32px', 
          height: '32px', 
          border: '3px solid rgba(16, 185, 129, 0.15)', 
          borderTop: '3px solid #10B981', 
          borderRadius: '50%', 
          animation: 'spin 1s linear infinite' 
        }} />
        
        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '-0.3px', marginTop: '4px' }}>
          예수클래스를 불러오는 중...
        </div>
      </div>
    );
  }

  if (!currentUser || !currentUser.role || currentUser.needsRoleSelection) {
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

