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
  Flame,
  ArrowRight,
  Lock,
  Gift
} from 'lucide-react';
import ProfileEditModal from '../../components/ProfileEditModal';

export default function KidsDashboard({ setActiveTab }) {
  const { currentUser, students, submitMission, rejectMission, churchName } = useStore();
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

  if (!student) {
    return (
      <div style={{ ...styles.container, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '24px', textAlign: 'center' }}>
        <div style={{ 
          width: '80px', 
          height: '80px', 
          borderRadius: '24px', 
          background: 'rgba(16, 185, 129, 0.1)', 
          border: '2px solid rgba(16, 185, 129, 0.2)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          marginBottom: '24px',
          boxShadow: '0 8px 20px rgba(16, 185, 129, 0.1)'
        }}>
          <Lock size={36} color="#10B981" />
        </div>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '12px', wordBreak: 'keep-all', overflowWrap: 'break-word', color: 'var(--text-main)', lineHeight: '1.4' }}>
          ⛪ 예수클래스에 오신 것을 환영합니다!
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', maxWidth: '320px', margin: '0 auto 28px auto', wordBreak: 'keep-all', overflowWrap: 'break-word' }}>
          학부모(또는 학생) 계정 가입이 안전하게 완료되었습니다!<br />
          아직 매핑된 자녀 학생 정보가 존재하지 않습니다.
        </p>
        
        <div style={{ 
          background: 'var(--bg-card)', 
          border: '1px solid var(--border-color)', 
          borderRadius: '20px', 
          padding: '24px', 
          width: '100%', 
          maxWidth: '380px', 
          marginBottom: '32px', 
          textAlign: 'left',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h4 style={{ margin: '0 0 14px 0', fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>💡</span> 다음 단계 안내
          </h4>
          <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.8', wordBreak: 'keep-all', overflowWrap: 'break-word' }}>
            <li style={{ marginBottom: '10px' }}>
              담당 주일학교 반 선생님께 연락하여 신규 가입하신 이메일을 말씀해 주세요.
              <div style={{ 
                marginTop: '6px', 
                background: 'var(--bg-main)', 
                padding: '6px 12px', 
                borderRadius: '8px', 
                fontSize: '0.85rem', 
                fontFamily: 'monospace',
                color: 'var(--primary)',
                border: '1px solid var(--border-color)',
                display: 'inline-block',
                fontWeight: 600
              }}>
                {currentUser?.email}
              </div>
            </li>
            <li>선생님이 교사용 대시보드에서 자녀 정보 매핑을 승인하시는 즉시 대시보드가 정상 활성화됩니다.</li>
          </ol>
        </div>

        <button 
          onClick={async () => {
            const { logout } = useStore.getState();
            await logout();
          }}
          style={{ 
            padding: '12px 32px', 
            borderRadius: '12px', 
            background: 'var(--bg-card)', 
            border: '1px solid var(--border-color)', 
            color: 'var(--text-main)', 
            fontSize: '0.9rem', 
            fontWeight: 700, 
            cursor: 'pointer',
            transition: 'var(--transition-smooth)',
            boxShadow: 'var(--shadow-sm)'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-main)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-card)'}
        >
          로그아웃
        </button>
      </div>
    );
  }

  // 일일 미션 정보 계산
  const missions = [
    { id: 'attendance', label: '예배 출석체크', type: 'attendance', points: '1달란트', tab: 'kids-attendance' },
    { id: 'offering', label: '감사 헌금 드리기', type: 'offering', points: '1달란트', tab: 'kids-dashboard' }, // 헌금은 대시보드 바로체크
    { id: 'bible', label: '성경 암송 요절', type: 'bible', points: '2달란트', tab: 'kids-memory-verse' }
  ];

  const completedMissionsCount = missions.filter(m => student.dailyMissions[m.type]?.status === 'completed').length;
  const pendingMissionsCount = missions.filter(m => student.dailyMissions[m.type]?.status === 'pending').length;
  const progressPercent = Math.round((completedMissionsCount / missions.length) * 100);

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

  const handleMissionSubmit = (type, content = '') => {
    submitMission(student.id, type, content);
  };

  const getMissionStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span style={{ ...styles.mBadge, color: 'var(--accent-success)', background: 'var(--accent-success-bg)' }}>✅ 완료</span>;
      case 'pending':
        return <span style={{ ...styles.mBadge, color: '#D97706', background: 'rgba(245,158,11,0.08)' }}>⏳ 심사중</span>;
      default:
        return <span style={{ ...styles.mBadge, color: 'var(--text-muted)', background: 'var(--bg-app)' }}>⚪ 미완료</span>;
    }
  };

  // 성경 암송 요절 렌더링 디코더
  const getBibleVerseText = (rawContent) => {
    if (!rawContent) return '아직 제출된 암송이 없습니다.';
    try {
      const parsed = JSON.parse(rawContent);
      if (parsed.type === 'media') {
        return parsed.mediaType === 'video' ? '🎥 동영상 암송 숙제 제출 완료' : '🖼️ 암송 사진 인증 완료';
      } else if (parsed.type === 'voice') {
        return '🎙️ 녹음 파일 암송 제출 완료';
      }
      return parsed.text || rawContent;
    } catch (e) {
      return rawContent;
    }
  };

  return (
    <div style={styles.container}>
      <Confetti active={showConfetti} />
      
      <div className="dashboard-grid" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* 왼쪽 단 */}
        <div style={styles.column}>
          {/* 1. 상단 프로필 영역 */}
          <section style={styles.profileSection} className="card-solid hover-lift">
            <div style={styles.profileHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={styles.appBadge}>{churchName}</span>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>나의 프로필</h3>
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
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px', fontWeight: 600 }}>
                  {student.grade} • 열매 맺는 반
                </p>
                
                {student.allergy && student.allergy.length > 0 && (
                  <div style={styles.allergyBadge}>
                    <AlertTriangle size={12} /> <span>알레르기 주의: {student.allergy.join(', ')}</span>
                  </div>
                )}
                
                <div style={styles.dalantBadge}>
                  <div style={styles.dalantIconBg}><Coins size={14} color="white" /></div>
                  <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>{student.dalant} 달란트</span>
                </div>
              </div>
            </div>
          </section>

          {/* 2. 오늘 하루 미션 달성도 (NEW!) */}
          <section style={styles.sectionContainer}>
            <div className="card-solid hover-lift" style={styles.missionCard}>
              <div style={styles.missionHeader}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>오늘의 미션 달성</h4>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>매일 미션을 깨고 달란트를 모아보세요!</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={styles.progressText}>{completedMissionsCount} / {missions.length} 완료</span>
                </div>
              </div>

              {/* 프로그레스 바 */}
              <div style={styles.progressBarBg}>
                <div style={{ ...styles.progressBarFill, width: `${progressPercent}%` }}></div>
              </div>

              {/* 미션 목록 리스트 */}
              <div style={styles.missionList}>
                {missions.map(m => {
                  const status = student.dailyMissions[m.type]?.status || 'none';
                  return (
                    <div 
                      key={m.id} 
                      style={styles.missionItem}
                      className="hover-lift"
                      onClick={() => {
                        if (m.type === 'offering' && status === 'none') {
                          if (window.confirm('오늘의 헌금 드리기 미션을 제출하시겠습니까? (+1달란트)')) {
                            handleMissionSubmit('offering');
                          }
                        } else if (m.tab) {
                          setActiveTab(m.tab);
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          ...styles.checkCircle,
                          borderColor: status === 'completed' ? 'var(--primary)' : 'var(--border-strong)',
                          background: status === 'completed' ? 'var(--primary)' : 'transparent'
                        }}>
                          {status === 'completed' && <Check size={12} color="white" strokeWidth={3} />}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: status === 'completed' ? 'var(--text-light)' : 'var(--text-main)' }}>
                            {m.label} <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>({m.points})</span>
                          </div>
                          {m.type === 'bible' && status !== 'none' && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px', fontWeight: 600 }}>
                              제출: {getBibleVerseText(student.dailyMissions.bible.textContent)}
                            </div>
                          )}
                          {student.dailyMissions[m.type]?.teacherFeedback && (
                            <div style={{
                              fontSize: '0.78rem',
                              color: '#8B5CF6',
                              marginTop: '4px',
                              fontWeight: 700,
                              background: '#EDE9FE',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              💌 선생님: {student.dailyMissions[m.type].teacherFeedback}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {getMissionStatusBadge(status)}
                        {status === 'none' && m.type !== 'offering' && <ChevronRight size={16} color="var(--text-muted)" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>

        {/* 오른쪽 단 */}
        <div style={styles.column}>
          {/* 3. 성경 암송 요절 피드 */}
          <section style={styles.sectionContainer}>
            <div style={styles.feedCard} className="card-solid hover-lift">
              <div style={styles.feedHeader}>
                <div style={styles.feedTypeBadge}><Sparkles size={12} /> 암송 요절 추천</div>
                <span style={styles.feedDate}>시편 23:1</span>
              </div>
              
              <div style={styles.missionTitleArea}>
                <div style={styles.bibleIconBg} className="neon-logo-box">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8D6E63" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M5 8h14" />
                  </svg>
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>"여호와는 나의 목자시니..."</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 600 }}>
                    녹음, 텍스트 혹은 **비디오/사진**으로 제출해 보세요!
                  </p>
                </div>
              </div>
              
              <div style={{ marginTop: '20px' }}>
                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%', borderRadius: '16px', display: 'flex', justifyContent: 'center', gap: '8px' }}
                  onClick={() => setActiveTab('kids-memory-verse')}
                >
                  <span>암송 숙제하러 가기</span> <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </section>

          {/* 4. 우리들 이야기 (8그리드 퀵 메뉴) */}
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
                      <Icon size={26} color={item.color} strokeWidth={2.5} />
                    </div>
                    <span style={styles.quickMenuLabel}>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 5. 주일 간식 배너 */}
          <section style={styles.sectionContainer}>
            <div style={styles.snackBanner} className="card-solid hover-lift">
              <div style={styles.snackHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={styles.snackBadge}>달콤 간식</span>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>이번 주일의 맛있는 간식</h4>
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
    padding: '20px',
  },
  profileHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  profileEditBtn: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    cursor: 'pointer',
  },
  profileContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  avatarCircle: {
    width: '76px',
    height: '76px',
    borderRadius: '50%',
    background: 'var(--bg-app)',
    border: '2.5px solid rgba(16, 185, 129, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-sm)',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  avatarEmoji: {
    fontSize: '2.8rem',
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
    marginTop: '6px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.7rem',
    color: 'var(--accent-danger)',
    background: 'var(--accent-danger-bg)',
    padding: '4px 8px',
    borderRadius: '8px',
    fontWeight: 700,
  },
  dalantBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '10px',
    padding: '4px 12px 4px 4px',
    background: 'var(--bg-app)',
    border: '1.5px solid var(--border-light)',
    borderRadius: 'var(--radius-full)',
    fontSize: '0.85rem',
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
  // 미션 카드 스타일
  missionCard: {
    padding: '20px',
  },
  missionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '14px',
  },
  progressText: {
    fontSize: '0.9rem',
    fontWeight: 800,
    color: 'var(--primary)',
  },
  progressBarBg: {
    width: '100%',
    height: '12px',
    background: 'var(--bg-app)',
    borderRadius: '6px',
    overflow: 'hidden',
    marginBottom: '16px',
    border: '1px solid var(--border-light)',
  },
  progressBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #10B981 0%, #059669 100%)',
    borderRadius: '6px',
    transition: 'width 0.4s ease-in-out',
  },
  missionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  missionItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 14px',
    background: 'var(--bg-app)',
    borderRadius: '16px',
    border: '1.5px solid var(--border-light)',
    cursor: 'pointer',
  },
  checkCircle: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    border: '2px solid var(--border-strong)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mBadge: {
    fontSize: '0.7rem',
    fontWeight: 700,
    padding: '3px 8px',
    borderRadius: '8px',
  },
  // 퀵 메뉴 그리드
  quickMenuGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
    padding: '4px 0',
  },
  quickMenuItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '10px 2px',
    cursor: 'pointer',
    width: '100%',
    minWidth: 0,
    aspectRatio: '1 / 1',
    borderRadius: '20px',
  },
  quickMenuIconWrapper: {
    width: '46px',
    height: '46px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  quickMenuLabel: {
    fontSize: '0.65rem',
    fontWeight: 800,
    color: 'var(--text-main)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
    textAlign: 'center',
    lineHeight: '1.2',
  },
  feedCard: {
    padding: '20px',
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
    backgroundColor: 'hsla(142, 72%, 29%, 0.08)',
    padding: '4px 10px',
    borderRadius: '8px',
  },
  feedDate: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    fontWeight: 700,
  },
  missionTitleArea: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  bibleIconBg: {
    width: '48px',
    height: '48px',
    background: 'var(--bg-app)', 
    border: '2px solid rgba(16, 185, 129, 0.4)',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    fontSize: '1.6rem',
    color: '#D97706',
  },
  snackBanner: {
    padding: '20px',
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
  snackBadge: {
    fontSize: '0.75rem',
    fontWeight: 800,
    padding: '4px 10px',
    backgroundColor: '#FFE4E6',
    color: '#F43F5E',
    borderRadius: 'var(--radius-full)',
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
  }
};
