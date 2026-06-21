import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';
import Confetti from '../../components/Confetti';
import { 
  Award, 
  BookOpen, 
  CheckCircle, 
  Coins, 
  Send, 
  Sparkles, 
  Volume2,
  Camera,
  Calendar,
  Bell,
  Utensils,
  FileText,
  ChevronRight,
  Check,
  AlertTriangle,
  Flame
} from 'lucide-react';
import ProfileEditModal from '../../components/ProfileEditModal';

export default function KidsDashboard({ setActiveTab }) {
  const { currentUser, students, submitMission, rejectMission, churchName } = useStore();
  const [bibleText, setBibleText] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  const student = students.find(s => s.id === currentUser.id);
  const prevDalantRef = useRef(student ? student.dalant : 0);

  useEffect(() => {
    if (student && student.dalant > prevDalantRef.current) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    if (student) {
      prevDalantRef.current = student.dalant;
    }
  }, [student?.dalant]);

  if (!student) return null;

  const quickMenuItems = [
    { id: 'attendance', tab: 'kids-attendance', label: '출결체크', icon: CheckCircle, color: '#7B3DFF', bg: '#F3E8FF' }, 
    { id: 'dalant', tab: 'kids-dalant', label: '달란트조회', icon: Coins, color: '#F59E0B', bg: '#FEF3C7' },
    { id: 'bible', tab: 'kids-memory-verse', label: '암송요절', icon: BookOpen, color: '#10B981', bg: '#D1FAE5' },
    { id: 'album', tab: 'kids-album', label: '사진/앨범', icon: Camera, color: '#EC4899', bg: '#FCE7F3' }, 
    { id: 'calendar', tab: 'kids-schedule', label: '주일일정', icon: Calendar, color: '#0EA5E9', bg: '#E0F2FE' }, 
    { id: 'notice', tab: 'kids-notices', label: '가정통신문', icon: Bell, color: '#3B82F6', bg: '#DBEAFE' },
    { id: 'snack', tab: 'kids-snack', label: '주간 간식', icon: Utensils, color: '#F43F5E', bg: '#FFE4E6' },
    { id: 'bulletin', tab: 'kids-bulletin', label: '모바일주보', icon: FileText, color: '#6B7280', bg: '#F3F4F6' },
  ];

  return (
    <div style={styles.container}>
      <Confetti active={showConfetti} />
      
      {/* 반응형 2단 대시보드 그리드 래퍼 */}
      <div className="dashboard-grid">
        
        {/* 왼쪽 단 (모바일에서는 위쪽) */}
        <div style={styles.column}>
          {/* 1. 상단 프로필 영역 */}
          <section style={styles.profileSection} className="card-solid hover-lift">
            <div style={styles.profileHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={styles.appBadge}>{churchName}</span>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>나의 프로필</h3>
              </div>
              <span style={{...styles.profileEditBtn, cursor: 'pointer'}} onClick={() => setIsProfileModalOpen(true)}>설정 <ChevronRight size={16} /></span>
            </div>
            
            <div style={styles.profileContent}>
              <div style={styles.avatarCircle} className="animate-pulse-soft">
                {student.imageUrl ? (
                  <img src={student.imageUrl} alt="profile" style={styles.profileImage} />
                ) : (
                  <span style={styles.avatarEmoji}>{student.avatar}</span>
                )}
              </div>
              
              <div style={styles.profileInfo}>
                <div style={styles.profileNameRow}>
                  <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>{student.name}</h2>
                  <span className="badge badge-primary">LV.{student.level}</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px', fontWeight: 500 }}>
                  {student.grade} • 열매 맺는 반
                </p>
                
                {student.allergy && student.allergy.length > 0 && (
                  <div style={styles.allergyBadge}>
                    <AlertTriangle size={12} /> <span>알레르기: {student.allergy.join(', ')}</span>
                  </div>
                )}
                
                <div style={styles.dalantBadge}>
                  <div style={styles.dalantIconBg}><Coins size={14} color="white" /></div>
                  <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>{student.dalant} 달란트</span>
                </div>
              </div>
            </div>
          </section>

          {/* 2. 우리들 이야기 (8그리드 퀵 메뉴) */}
          <section style={styles.sectionContainer}>
            <div style={styles.sectionTitle}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>우리들 이야기</h3>
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
        </div>

        {/* 오른쪽 단 (모바일에서는 아래쪽) */}
        <div style={styles.column}>
          {/* 출결 리마인더 */}
          {student.dailyMissions.attendance.status === 'none' && (
            <div style={styles.reminderCard} className="card-solid hover-lift">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={styles.reminderIcon} className="animate-pulse-soft"><CheckCircle size={22} color="white" /></div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>예수님과 함께하는 하루</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>출석체크하고 달란트 받기</p>
                </div>
              </div>
              <button 
                className="btn btn-primary" 
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                onClick={() => handleMissionSubmit('attendance')}
              >
                체크하기
              </button>
            </div>
          )}

          {/* 데일리 미션 (암송 요절) */}
          <section style={styles.sectionContainer}>
            <div style={styles.feedCard} className="card-solid hover-lift">
              <div style={styles.feedHeader}>
                <div style={styles.feedTypeBadge}><Sparkles size={12} /> 데일리 미션</div>
                <span style={styles.feedDate}>오늘의 말씀 암송</span>
              </div>
              
              <div style={styles.missionTitleArea}>
                <div 
                  style={{
                    ...styles.missionIconBg, 
                    background: 'var(--bg-card)', 
                    border: '2px solid rgba(16, 185, 129, 0.5)',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxSizing: 'border-box'
                  }} 
                  className="neon-logo-box"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8D6E63" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M5 8h14" />
                  </svg>
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>이번 주 성경 요절 암송하기</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    외운 말씀을 또박또박 적어보세요 (+2달란트)
                  </p>
                </div>
              </div>
              
              <div style={{ marginTop: '20px' }}>
                {student.dailyMissions.bible.status === 'none' && (
                  <div style={styles.bibleForm}>
                    <textarea 
                      value={bibleText}
                      onChange={(e) => setBibleText(e.target.value)}
                      placeholder="외운 말씀을 여기에 작성해 주세요..."
                      className="form-textarea"
                      style={{ minHeight: '90px' }}
                    />
                    <button 
                      disabled={!bibleText.trim()}
                      onClick={() => handleMissionSubmit('bible', bibleText)}
                      style={{ 
                        alignSelf: 'flex-end', 
                        marginTop: '12px',
                        padding: '10px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        transition: 'all 0.2s ease',
                        opacity: bibleText.trim() ? 1 : 0.5,
                        cursor: bibleText.trim() ? 'pointer' : 'default',
                      }}
                    >
                      <Send size={16} /> <span>제출하기</span>
                    </button>
                  </div>
                )}
                {student.dailyMissions.bible.status === 'pending' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={styles.pendingBadge}>⏳ 선생님 암송 승인 대기 중</div>
                    <button 
                      className="btn hover-lift" 
                      style={{ 
                        alignSelf: 'flex-end', 
                        padding: '8px 16px', 
                        fontSize: '0.85rem', 
                        background: 'rgba(239, 68, 68, 0.1)', 
                        color: '#EF4444',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: 700
                      }}
                      onClick={() => {
                        setBibleText(student.dailyMissions.bible.textContent || '');
                        rejectMission(student.id, 'bible');
                      }}
                    >
                      제출 취소하고 수정하기
                    </button>
                  </div>
                )}
                {student.dailyMissions.bible.status === 'completed' && (
                  <div style={styles.completedBadge}><Check size={16} strokeWidth={3} /> 암송 완료! (+2)</div>
                )}
              </div>
            </div>
          </section>

          {/* 간식 배너 */}
          <section style={styles.sectionContainer}>
            <div style={styles.snackBanner} className="card-solid hover-lift">
              <div style={styles.snackHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={styles.appBadge}>주일학교</span>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>이번 주일 간식</h4>
                </div>
                <span style={styles.snackDate}>6/21</span>
              </div>
              
              <div style={styles.snackContent}>
                <ul style={styles.snackList}>
                  <li>🍔 불고기버거</li>
                  <li>🧃 뽀로로 음료수</li>
                  <li>🍫 초코파이</li>
                </ul>
                <div style={styles.snackIconBg} className="squircle">
                  <Utensils size={36} color="#F43F5E" />
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>

      <ProfileEditModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />
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
    minWidth: 0,
  },
  sectionContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    minWidth: 0,
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
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
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
  allergyBadge: {
    marginTop: '8px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.75rem',
    color: 'var(--accent-danger)',
    background: 'var(--accent-danger-bg)',
    padding: '4px 8px',
    borderRadius: 'var(--radius-sm)',
    fontWeight: 700,
  },
  dalantBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '10px',
    padding: '4px 12px 4px 4px',
    background: 'var(--bg-app)',
    border: '1px solid var(--border-light)',
    borderRadius: 'var(--radius-full)',
    fontSize: '0.9rem',
  },
  dalantIconBg: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: '#F59E0B',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickMenuGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
    padding: '8px 0',
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
    width: '48px', // 타일 안에서는 살짝 작아도 됨
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  quickMenuLabel: {
    fontSize: '0.65rem',
    fontWeight: 700,
    color: 'var(--text-main)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
    textAlign: 'center',
    lineHeight: '1.2',
  },
  feedCard: {
    padding: '16px',
  },
  feedHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  feedTypeBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.75rem',
    fontWeight: 800,
    color: 'var(--primary)',
    backgroundColor: 'hsla(252, 100%, 67%, 0.1)',
    padding: '4px 8px',
    borderRadius: 'var(--radius-sm)',
  },
  feedDate: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    fontWeight: 600,
  },
  missionTitleArea: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
  },
  missionIconBg: {
    fontSize: '1.6rem',
    width: '48px',
    height: '48px',
    background: '#FEF3C7', // 파스텔 톤 배경
    border: '1px solid #FDE68A',
    color: '#D97706',
  },
  snackBanner: {
    padding: '16px',
    background: 'var(--bg-card)',
  },
  snackHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  appBadge: {
    fontSize: '0.75rem',
    fontWeight: 800,
    padding: '4px 10px',
    backgroundColor: 'var(--primary)',
    color: 'white',
    borderRadius: 'var(--radius-full)',
    letterSpacing: '0.02em',
  },
  snackDate: {
    fontSize: '0.8rem',
    color: 'var(--primary)',
    fontWeight: 800,
  },
  snackContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  snackList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    fontSize: '0.95rem',
    fontWeight: 700,
    color: 'var(--text-main)'
  },
  snackIconBg: {
    width: '64px',
    height: '64px',
    backgroundColor: '#FFE4E6',
  },
  reminderCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    color: 'var(--text-main)',
  },
  reminderIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bibleForm: {
    display: 'flex',
    flexDirection: 'column',
  },
  pendingBadge: {
    padding: '12px',
    textAlign: 'center',
    borderRadius: 'var(--radius-sm)',
    background: 'hsla(38, 92%, 50%, 0.1)',
    color: '#D97706',
    fontWeight: 700,
    fontSize: '0.9rem',
  },
  completedBadge: {
    padding: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--accent-success-bg)',
    color: 'var(--accent-success)',
    fontWeight: 700,
    fontSize: '0.9rem',
  }
};
