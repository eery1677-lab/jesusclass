import React, { useState } from 'react';
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
import ChatModal from './components/ChatModal';
import ProfileEditModal from './components/ProfileEditModal';
import SettingsView from './views/Settings';
import { useStore } from './store/useStore';

export default function App() {
  const { currentUser } = useStore();
  const [activeTab, setActiveTab] = useState(currentUser?.role === 'teacher' ? 'teacher-dashboard' : 'kids-dashboard');
  const [chatOpen, setChatOpen] = useState(false);

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
      
      // 설정 뷰
      case 'settings':
        return <SettingsView />;
      
      default:
        return <KidsDashboard />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onOpenChat={() => setChatOpen(true)}
    >
      {renderView()}

      {/* 1:1 소통 톡 모달 */}
      <ChatModal 
        isOpen={chatOpen} 
        onClose={() => setChatOpen(false)} 
      />
    </Layout>
  );
}
