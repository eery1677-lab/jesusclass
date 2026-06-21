import React from 'react';
import { useStore } from '../../store/useStore';
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  CheckSquare,
  ChevronRight,
  TrendingUp,
  Clock,
  Sparkles,
  FileText
} from 'lucide-react';

export default function TeacherDashboard({ setActiveTab }) {
  const { currentUser, students, approveMission, rejectMission } = useStore();
  const teacherName = currentUser.name || "선생님";
  const [selectedMission, setSelectedMission] = React.useState(null);
  
  // 미결재 미션 추출
  const pendingMissions = students.flatMap(student => 
    Object.entries(student.dailyMissions || {})
      .filter(([type, mission]) => mission.status === 'pending')
      .map(([type, mission]) => ({ student, type, mission }))
  ).sort((a, b) => new Date(b.mission.submittedAt) - new Date(a.mission.submittedAt));

  const quickMenuItems = [
    { id: 'attendance', label: '출결관리', icon: CheckSquare, color: '#10B981', bg: '#D1FAE5', tab: 'teacher-attendance' },
    { id: 'dalant', label: '달란트지급', icon: TrendingUp, color: '#F59E0B', bg: '#FEF3C7', tab: 'teacher-dalant' },
    { id: 'message', label: '가정통신문', icon: MessageSquare, color: '#3B82F6', bg: '#DBEAFE', tab: 'teacher-notices' },
    { id: 'album', label: '사진첩', icon: Sparkles, color: '#EC4899', bg: '#FCE7F3', tab: 'teacher-album' }, 
    { id: 'bulletin', label: '모바일주보', icon: FileText, color: '#8B5CF6', bg: '#EDE9FE', tab: 'teacher-bulletin' },
  ];

  const handleApprove = (studentId, type) => {
    approveMission(studentId, type);
    setSelectedMission(null);
  };

  const handleReject = (studentId, type) => {
    if (window.confirm('이 미션을 반려하시겠습니까?')) {
      rejectMission(studentId, type);
      setSelectedMission(null);
    }
  };

  return (
    <div style={styles.container}>
      <div className="dashboard-grid">
        
        {/* 왼쪽 단 */}
        <div style={styles.column}>
          {/* 1. 상단 프로필 영역 */}
          <section style={styles.profileSection} className="card-solid hover-lift">
            <div style={styles.profileHeader}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>교사 대시보드</h3>
            </div>
            
            <div style={styles.profileContent}>
              <div style={{...styles.avatarCircle, overflow: 'hidden'}} className="animate-pulse-soft">
                {currentUser.imageUrl ? (
                  <img src={currentUser.imageUrl} alt="profile" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                ) : (
                  <span style={styles.avatarEmoji}>{currentUser.avatar || '👩‍🏫'}</span>
                )}
              </div>
              
              <div style={styles.profileInfo}>
                <div style={styles.profileNameRow}>
                  <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>{teacherName}</h2>
                  <span className="badge badge-primary">열매 맺는 반</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
                  오늘도 아이들을 위해 헌신해 주셔서 감사합니다! ✨
                </p>
              </div>
            </div>
          </section>

          {/* 2. 관리 요약 정보 */}
          <section style={styles.statsSection}>
            <div style={styles.statCard} className="card-solid hover-lift">
              <div style={styles.statIconBg}><Users size={20} color="var(--primary)" /></div>
              <div>
                <div style={styles.statLabel}>우리 반 학생</div>
                <div style={styles.statValue}>{students.length}명</div>
              </div>
            </div>
            <div style={styles.statCard} className="card-solid hover-lift">
              <div style={styles.statIconBg}><Clock size={20} color="var(--secondary)" /></div>
              <div>
                <div style={styles.statLabel}>미확인 제출건</div>
                <div style={styles.statValue}>{pendingMissions.length}건</div>
              </div>
            </div>
          </section>
        </div>

        {/* 오른쪽 단 */}
        <div style={styles.column}>
          {/* 3. 빠른 실행 메뉴 */}
          <section style={styles.sectionContainer}>
            <div style={styles.sectionTitle}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>업무 바로가기</h3>
            </div>
            <div style={styles.quickMenuGrid}>
              {quickMenuItems.map(item => {
                const Icon = item.icon;
                return (
                  <button 
                    key={item.id} 
                    style={styles.quickMenuItem} 
                    className="card-solid hover-lift"
                    onClick={() => setActiveTab && setActiveTab(item.tab)}
                  >
                    <div style={{...styles.quickMenuIconWrapper, background: item.bg}} className="squircle">
                      <Icon size={30} color={item.color} strokeWidth={2.5} />
                    </div>
                    <span style={styles.quickMenuLabel}>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </section>
          
          {/* 4. 오늘의 할 일 / 리뷰 대기 */}
          <section style={styles.sectionContainer}>
            <div className="card-solid hover-lift">
               <div style={styles.todoHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckSquare size={18} color="var(--text-main)" />
                    <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>승인 대기 중인 제출물</h4>
                  </div>
                  {pendingMissions.length > 0 && (
                    <span className="badge badge-primary">{pendingMissions.length}건</span>
                  )}
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {pendingMissions.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      현재 승인 대기 중인 항목이 없습니다. 🎉
                    </div>
                  ) : (
                    pendingMissions.map((pm, idx) => {
                      const missionNames = { attendance: '출석체크', offering: '헌금 제출', bible: '성경 암송' };
                      return (
                        <div key={idx} style={styles.todoItem} className="hover-lift">
                           <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                             <div style={styles.studentAvatarMini}>{pm.student.avatar || '👦'}</div>
                             <div>
                                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{pm.student.name}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{missionNames[pm.type] || '기타 미션'} 제출</div>
                             </div>
                           </div>
                           <button 
                             className="btn btn-primary" 
                             style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                             onClick={() => setSelectedMission(pm)}
                           >
                             확인하기
                           </button>
                        </div>
                      )
                    })
                  )}
                </div>
            </div>
          </section>
        </div>

      </div>

      {/* 미션 확인 팝업 모달 */}
      {selectedMission && (
        <div style={styles.modalBackdrop} onClick={() => setSelectedMission(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()} className="animate-fade-up">
            <h3 style={{ margin: '0 0 16px 0' }}>{selectedMission.student.name} 학생의 제출물</h3>
            
            <div style={{ padding: '16px', background: '#F9FAFB', borderRadius: '12px', marginBottom: '20px', fontSize: '0.95rem', lineHeight: '1.5' }}>
              {selectedMission.type === 'bible' ? (
                <>
                  <div style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '8px' }}>📖 암송 내용</div>
                  <div>"{selectedMission.mission.textContent}"</div>
                </>
              ) : (
                <div>정상적으로 제출되었습니다. ({selectedMission.mission.submittedAt})</div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                style={{ flex: 1, padding: '12px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                onClick={() => handleReject(selectedMission.student.id, selectedMission.type)}
              >
                반려하기
              </button>
              <button 
                style={{ flex: 1, padding: '12px', background: '#10B981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                onClick={() => handleApprove(selectedMission.student.id, selectedMission.type)}
              >
                승인 (달란트 지급)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sectionContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '4px',
  },
  profileSection: {
    padding: '16px',
  },
  profileHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  profileEditBtn: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    cursor: 'pointer',
  },
  profileContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatarCircle: {
    width: '68px',
    height: '68px',
    borderRadius: '50%',
    background: 'var(--bg-app)',
    border: '2px solid var(--border-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: '2.5rem',
  },
  profileInfo: {
    flex: 1,
  },
  profileNameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  statsSection: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
  },
  statCard: {
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  statIconBg: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: 'var(--bg-app)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontWeight: 600,
  },
  statValue: {
    fontSize: '1.2rem',
    fontWeight: 800,
    color: 'var(--text-main)',
  },
  quickMenuGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
    padding: '12px 0',
  },
  quickMenuItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '8px 2px',
    cursor: 'pointer',
    width: '100%',
    minWidth: 0,
    aspectRatio: '1 / 1', // 완벽한 정사각형 모양 (앱 아이콘 타일)
  },
  quickMenuIconWrapper: {
    width: '56px', // 타일 안에서는 살짝 작아도 됨
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  quickMenuLabel: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: 'var(--text-main)',
  },
  todoHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    borderBottom: '1px solid var(--border-light)',
  },
  todoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid var(--border-light)',
  },
  studentAvatarMini: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'var(--bg-app)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
  },
  modalBackdrop: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 2000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  modalContent: {
    background: 'white',
    borderRadius: '24px',
    padding: '24px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
  }
};
