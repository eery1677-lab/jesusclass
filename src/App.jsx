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
import BannerAd from './components/ads/BannerAd';
import InterstitialAd from './components/ads/InterstitialAd';

export default function App() {
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

  // 라우팅 변경 감지
  useEffect(() => {
    setNavCount(prev => prev + 1);
  }, [activeTab]);

  // N회 화면 전환 시 전면 광고 노출
  useEffect(() => {
    // 최초 마운트(1회) 제외, 4번 탭 이동할 때마다 광고 노출
    if (navCount > 1 && navCount % 4 === 0) {
      setShowInterstitial(true);
    }
  }, [navCount]);

  // 현재 활성화된 탭에 맞춰서 뷰를 반환
  const renderView = () => {
    switch (activeTab) {
      // 학생 모드 뷰
      case 'kids-dashboard':
        return <KidsDashboard setActiveTab={setActiveTab} />;
      case 'kids-notices':
        return <KidsNotices setActiveTab={setActiveTab} />;
      case 'kids-album':
        return <KidsAlbum setActiveTab={setActiveTab} />;
      case 'kids-attendance':
        return <KidsAttendance setActiveTab={setActiveTab} />;
      case 'kids-dalant':
        return <KidsDalant setActiveTab={setActiveTab} />;
      case 'kids-memory-verse':
        return <KidsMemoryVerse setActiveTab={setActiveTab} />;
      case 'kids-schedule':
        return <KidsSchedule setActiveTab={setActiveTab} />;
      case 'kids-snack':
        return <KidsSnack setActiveTab={setActiveTab} />;
      case 'kids-bulletin':
        return <KidsBulletin setActiveTab={setActiveTab} />;
      
      // 교사 모드 뷰
      case 'teacher-dashboard':
        return <TeacherDashboard setActiveTab={setActiveTab} />;
      case 'teacher-notices':
        return <TeacherNotices setActiveTab={setActiveTab} />;
      case 'teacher-album':
        return <TeacherAlbum setActiveTab={setActiveTab} />;
      case 'teacher-attendance':
        return <TeacherAttendance setActiveTab={setActiveTab} />;
      case 'teacher-dalant':
        return <TeacherDalant setActiveTab={setActiveTab} />;
      case 'teacher-bulletin':
        return <TeacherBulletin setActiveTab={setActiveTab} />;
      case 'teacher-snack':
        return <TeacherSnack setActiveTab={setActiveTab} />;
      case 'teacher-schedule':
        return <TeacherSchedule setActiveTab={setActiveTab} />;
      
      // 설정 뷰
      case 'settings':
        return <SettingsView />;
      
      default:
        return <KidsDashboard />;
    }
  };

  if (authLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-main)' }}>
        <div style={{ color: 'var(--primary)', fontSize: '1.2rem', fontWeight: 'bold' }}>로딩 중...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <Login />;
  }

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onOpenChat={() => setChatOpen(true)}
    >
      {renderView()}

      {/* 배너 광고 영역 (하단 고정) */}
      <div style={{ padding: '0 16px 16px', background: 'var(--bg-main)' }}>
        <BannerAd />
      </div>

      {/* 전면 광고 영역 */}
      {showInterstitial && (
        <InterstitialAd onClose={() => setShowInterstitial(false)} />
      )}

      {/* 1:1 소통 톡 모달 */}
      <ChatModal 
        isOpen={chatOpen} 
        onClose={() => setChatOpen(false)} 
      />
    </Layout>
  );
}
