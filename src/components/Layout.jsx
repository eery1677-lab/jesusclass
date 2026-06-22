import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  Home,
  Bell,
  MessageSquare,
  MoreHorizontal,
  Settings,
  User,
  BookOpen,
  LogOut,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  X
} from 'lucide-react';
import ProfileEditModal from './ProfileEditModal';

export default function Layout({ children, activeTab, setActiveTab, onOpenChat }) {
  const { currentUser, logout, switchUser, churchName, churchContact, students, generateChildCode, switchMode } = useStore();
  const currentStudent = students?.find(s => s.id === currentUser.id);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [generatedCode, setGeneratedCode] = useState(null);

  // 메뉴 리스트
  const tabs = currentUser.role === 'teacher' 
    ? [
        { id: 'teacher-dashboard', label: '홈', icon: Home },
        { id: 'teacher-notices', label: '알림장', icon: Bell },
        { id: 'chat', label: '지저스톡', icon: MessageSquare, isAction: true },
        { id: 'more', label: '더보기', icon: MoreHorizontal }
      ]
    : [
        { id: 'kids-dashboard', label: '홈', icon: Home },
        { id: 'kids-notices', label: '알림장', icon: Bell },
        { id: 'chat', label: '지저스톡', icon: MessageSquare, isAction: true },
        { id: 'more', label: '더보기', icon: MoreHorizontal }
      ];

  // [Mobile] 하단 탭바 (하이클래스 스타일 - 바닥 고정, Solid White)
  const renderBottomNav = () => (
    <nav style={styles.bottomNav} className="bottom-nav-container">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button 
            key={tab.id}
            className={`nav-item ${isActive ? 'active' : ''}`}
            style={styles.navTabBtn}
            onClick={() => {
              if (tab.isAction) {
                onOpenChat();
              } else if (tab.id === 'more') {
                setIsMoreMenuOpen(true);
              } else {
                setActiveTab(tab.id);
              }
            }}
          >
            <Icon 
              size={24} 
              style={{ color: isActive ? '#111827' : '#9CA3AF', marginBottom: '4px' }} 
            />
            <span style={styles.navTabLabel(isActive)}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );

  // [Desktop] 좌측 사이드바 제거됨 (Mobile First)

  return (
    <div style={styles.appContainer}>

      {/* 우측 메인 컨텐츠 영역 */}
      <div style={styles.contentWrapper}>
        
        <header style={styles.header} className="card-solid">
          <div style={styles.headerLeft}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={styles.logoCircle} className="neon-logo-box">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8D6E63" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M5 8h14" />
                </svg>
              </div>
              <h1 style={{ ...styles.title, fontWeight: 900 }} className="neon-logo-text">
                <span style={{color: '#111'}}>Jesus</span>
                <span style={{color: '#10B981'}}>Class</span>
              </h1>
            </div>
          </div>
          
          <div style={styles.headerRight}>
            <div style={{ position: 'relative' }}>
              <button 
                style={styles.roleBtn} 
                onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                className="neon-logo-box hover-lift-no-border"
              >
                <div style={{...styles.avatarMini, overflow: 'hidden'}}>
                  {currentStudent?.imageUrl ? (
                    <img src={currentStudent.imageUrl} alt="profile" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                  ) : (
                    currentStudent?.avatar || (currentUser.role === 'teacher' ? '👩‍🏫' : '👦')
                  )}
                </div>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{currentUser.name}</span>
              </button>
              
              {isRoleMenuOpen && (
                <div style={styles.roleDropdown} className="card-solid animate-fade-in">
                  <div style={styles.dropdownHeader}>계정 전환 (데모)</div>
                  <button style={styles.dropdownItem} onClick={() => { switchUser('student', 'student1'); setActiveTab('kids-dashboard'); setIsRoleMenuOpen(false); }}>
                    👦 학생1 (김예찬)
                  </button>
                  <button style={styles.dropdownItem} onClick={() => { switchUser('student', 'student2'); setActiveTab('kids-dashboard'); setIsRoleMenuOpen(false); }}>
                    👧 학생2 (이주은)
                  </button>
                  <button style={styles.dropdownItem} onClick={() => { switchUser('teacher', 'teacher1'); setActiveTab('teacher-dashboard'); setIsRoleMenuOpen(false); }}>
                    👩‍🏫 교사 (박사랑)
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* 뷰 렌더링 영역 */}
        <main style={styles.mainContent}>
          {children}
        </main>

        {/* 모바일 하단 탭바 */}
        {renderBottomNav()}
        
        {/* 더보기(More) 메뉴 모달 */}
        {isMoreMenuOpen && (
          <div style={styles.moreBackdrop} onClick={() => setIsMoreMenuOpen(false)}>
            <div style={styles.moreSheet} onClick={(e) => e.stopPropagation()} className="animate-fade-up">
              <div style={styles.moreSheetHeader}>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>더보기</h3>
                <button style={styles.closeBtn} onClick={() => setIsMoreMenuOpen(false)}>✕</button>
              </div>
              <div style={styles.moreProfileCard}>
                <div style={{...styles.moreAvatar, overflow: 'hidden'}}>
                  {currentStudent?.imageUrl ? (
                    <img src={currentStudent.imageUrl} alt="profile" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                  ) : (
                    currentStudent?.avatar || (currentUser.role === 'teacher' ? '👩‍🏫' : '👦')
                  )}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{currentUser.name} {currentUser.role === 'teacher' ? '선생님' : '어린이'}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{currentUser.role === 'teacher' ? '유초등부 교사' : '유초등부 3학년'}</div>
                </div>
              </div>
              <div style={{ ...styles.moreMenuList, gap: '12px' }}>
                <button className="list-item-btn hover-lift" style={styles.moreMenuItem} onClick={() => setIsProfileModalOpen(true)}>
                  <div style={styles.moreMenuIconWrapper}><User size={18} color="#4F46E5" /></div>
                  <span style={styles.moreMenuText}>내 프로필 관리</span>
                  <ChevronRight size={18} color="var(--text-muted)" />
                </button>
                <button className="list-item-btn hover-lift" style={styles.moreMenuItem} onClick={() => { setActiveTab('settings'); setIsMoreMenuOpen(false); }}>
                  <div style={styles.moreMenuIconWrapper}><Settings size={18} color="#10B981" /></div>
                  <span style={styles.moreMenuText}>앱 설정 / 알림</span>
                  <ChevronRight size={18} color="var(--text-muted)" />
                </button>
                <button className="list-item-btn hover-lift" style={styles.moreMenuItem} onClick={() => setIsContactModalOpen(true)}>
                  <div style={styles.moreMenuIconWrapper}><HelpCircle size={18} color="#3B82F6" /></div>
                  <span style={styles.moreMenuText}>교회 연락처 및 오시는 길</span>
                  <ChevronRight size={18} color="var(--text-muted)" />
                </button>
                
                {/* 부모 모드 전환 및 로그인 코드 발급 (학부모 계정 전용) */}
                {currentUser.mode === 'parent' && (
                  <>
                    <button className="list-item-btn hover-lift" style={{...styles.moreMenuItem, background: 'rgba(16, 185, 129, 0.05)'}} 
                      onClick={() => {
                        switchMode('child');
                        setIsMoreMenuOpen(false);
                      }}>
                      <div style={styles.moreMenuIconWrapper}><User size={18} color="#10B981" /></div>
                      <span style={{...styles.moreMenuText, color: 'var(--primary)'}}>아이 모드로 전환 👦👧</span>
                      <ChevronRight size={18} color="var(--primary)" />
                    </button>
                    
                    <button className="list-item-btn hover-lift" style={{...styles.moreMenuItem}} 
                      onClick={() => {
                        const code = generateChildCode(currentUser.id);
                        setGeneratedCode(code);
                        setIsMoreMenuOpen(false);
                      }}>
                      <div style={styles.moreMenuIconWrapper}><ShieldCheck size={18} color="#F59E0B" /></div>
                      <span style={styles.moreMenuText}>우리 아이 로그인 코드 발급</span>
                      <ChevronRight size={18} color="var(--text-muted)" />
                    </button>
                  </>
                )}

                {/* 부모 계정으로 들어왔지만, 아이 모드인 경우 돌아가기 버튼 */}
                {currentUser.mode === 'child' && !currentUser.isChildDirectLogin && (
                  <button className="list-item-btn hover-lift" style={{...styles.moreMenuItem, background: 'rgba(79, 70, 229, 0.05)'}} 
                    onClick={() => {
                      setPinInput('');
                      setPinError('');
                      setPinModalOpen(true);
                      setIsMoreMenuOpen(false);
                    }}>
                    <div style={styles.moreMenuIconWrapper}><Lock size={18} color="#4F46E5" /></div>
                    <span style={{...styles.moreMenuText, color: '#4F46E5'}}>부모님 모드로 돌아가기</span>
                    <ChevronRight size={18} color="#4F46E5" />
                  </button>
                )}
              </div>
              <button style={styles.logoutBtn} onClick={async () => { 
                if (window.confirm('정말 로그아웃 하시겠습니까?')) {
                  await logout();
                  setIsMoreMenuOpen(false);
                }
              }}>
                <LogOut size={18} />
                로그아웃
              </button>
            </div>
          </div>
        )}
        
        {/* 연락처 및 오시는 길 모달 */}
        {isContactModalOpen && (
          <div style={styles.moreBackdrop} onClick={() => setIsContactModalOpen(false)}>
            <div style={styles.contactModal} onClick={(e) => e.stopPropagation()} className="animate-fade-up">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, fontSize: '1.2rem' }}>교회 연락처 및 오시는 길</h2>
                <button onClick={() => setIsContactModalOpen(false)} style={styles.closeBtn}>
                  <X size={20} />
                </button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={styles.contactItem}>
                  <div style={styles.contactIcon}><Phone size={20} color="#10B981" /></div>
                  <div>
                    <div style={styles.contactLabel}>교회 사무실</div>
                    <div style={styles.contactValue}>{churchContact?.phone || '등록된 번호가 없습니다.'}</div>
                  </div>
                </div>
                
                <div style={styles.contactItem}>
                  <div style={styles.contactIcon}><MapPin size={20} color="#F59E0B" /></div>
                  <div>
                    <div style={styles.contactLabel}>오시는 길</div>
                    <div style={{...styles.contactValue, whiteSpace: 'pre-line'}}>{churchContact?.address || '등록된 주소가 없습니다.'}</div>
                  </div>
                </div>
                
                <div style={styles.contactItem}>
                  <div style={styles.contactIcon}><Mail size={20} color="#3B82F6" /></div>
                  <div>
                    <div style={styles.contactLabel}>이메일 문의</div>
                    <div style={styles.contactValue}>{churchContact?.email || '등록된 이메일이 없습니다.'}</div>
                  </div>
                </div>
              </div>
              
              <button style={styles.contactCloseBtn} onClick={() => setIsContactModalOpen(false)}>
                확인
              </button>
            </div>
          </div>
        )}

        {/* 부모님 PIN 모달 */}
        {pinModalOpen && (
          <div style={styles.moreBackdrop} onClick={() => setPinModalOpen(false)}>
            <div style={styles.contactModal} onClick={(e) => e.stopPropagation()} className="animate-fade-up">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, fontSize: '1.2rem' }}>부모님 모드 복귀</h2>
                <button onClick={() => setPinModalOpen(false)} style={styles.closeBtn}>
                  <X size={20} />
                </button>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                부모님 모드로 돌아가려면 비밀번호(PIN) 4자리를 입력해주세요.<br/>
                (현재 테스트 버전에서는 <b>0000</b>을 입력하세요)
              </p>
              
              <input 
                type="password" 
                maxLength="4"
                placeholder="****"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/[^0-9]/g, ''))}
                style={{
                  width: '100%', padding: '16px', fontSize: '1.5rem', textAlign: 'center',
                  letterSpacing: '8px', borderRadius: '12px', border: '1px solid var(--border-color)',
                  marginBottom: '8px'
                }}
              />
              
              {pinError && <div style={{ color: '#EF4444', fontSize: '0.85rem', marginBottom: '16px', textAlign: 'center' }}>{pinError}</div>}
              
              <button 
                style={{...styles.contactCloseBtn, marginTop: '8px', background: '#4F46E5'}} 
                onClick={() => {
                  const success = switchMode('parent', pinInput);
                  if (success) {
                    setPinModalOpen(false);
                  } else {
                    setPinError('비밀번호가 일치하지 않습니다.');
                  }
                }}
              >
                확인
              </button>
            </div>
          </div>
        )}

        {/* 자녀 로그인 코드 발급 결과 모달 */}
        {generatedCode && (
          <div style={styles.moreBackdrop} onClick={() => setGeneratedCode(null)}>
            <div style={{...styles.contactModal, textAlign: 'center'}} onClick={(e) => e.stopPropagation()} className="animate-fade-up">
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
                <button onClick={() => setGeneratedCode(null)} style={styles.closeBtn}>
                  <X size={20} />
                </button>
              </div>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <ShieldCheck size={32} color="#F59E0B" />
              </div>
              <h2 style={{ margin: '0 0 12px 0', fontSize: '1.2rem' }}>아이 로그인 코드 발급 완료!</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
                아이의 스마트폰이나 태블릿에서 지저스클래스 앱을 열고,<br/>
                [자녀 코드로 접속하기]를 눌러 아래 6자리 숫자를 입력하게 해주세요.
              </p>
              
              <div style={{ 
                background: 'var(--bg-main)', padding: '24px', borderRadius: '16px', 
                fontSize: '2.5rem', fontWeight: 900, letterSpacing: '8px', color: 'var(--primary)',
                border: '2px dashed var(--border-color)', marginBottom: '24px'
              }}>
                {generatedCode}
              </div>
              
              <button style={styles.contactCloseBtn} onClick={() => setGeneratedCode(null)}>
                확인
              </button>
            </div>
          </div>
        )}

        {/* 프로필 수정 모달 */}
        <ProfileEditModal 
          isOpen={isProfileModalOpen} 
          onClose={() => setIsProfileModalOpen(false)} 
        />
      </div>
    </div>
  );
}

const styles = {
  appContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: 'var(--bg-app)',
  },
  contentWrapper: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    width: '100%',
    position: 'relative',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 20px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    borderRadius: '0',
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  logoCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: 'transparent',
    border: '2px solid rgba(141, 110, 99, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: '1.4rem',
    fontWeight: 900,
    fontFamily: '"Montserrat", "Poppins", sans-serif',
    margin: 0,
    letterSpacing: '-0.5px',
    display: 'flex',
    alignItems: 'center',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  roleBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'var(--bg-app)',
    padding: '6px 12px',
    cursor: 'pointer',
    color: 'var(--text-main)',
    border: '2px solid rgba(16, 185, 129, 0.5)',
    borderRadius: '24px',
  },
  avatarMini: {
    fontSize: '1.1rem',
  },
  roleDropdown: {
    position: 'absolute',
    top: '48px',
    right: 0,
    width: '200px',
    display: 'flex',
    flexDirection: 'column',
    padding: '8px',
    zIndex: 101,
  },
  dropdownHeader: {
    padding: '8px 12px',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--text-muted)',
    borderBottom: '1px solid var(--border-light)',
    marginBottom: '4px',
  },
  dropdownItem: {
    padding: '10px 12px',
    background: 'transparent',
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.9rem',
    fontWeight: 500,
    color: 'var(--text-main)',
    transition: 'var(--transition-smooth)',
  },
  mainContent: {
    flex: 1,
    padding: '20px 16px 80px 16px', // 모바일 바텀 네비 여백 및 좌우 패딩 줄임
    width: '100%',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
  },
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: '480px',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '8px 16px',
    paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
    background: 'var(--bg-card)',
    boxShadow: 'var(--shadow-nav)',
    borderTop: '1px solid var(--border-light)',
    zIndex: 100,
  },
  navTabBtn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: '6px 0',
    WebkitTapHighlightColor: 'transparent',
  },
  navTabLabel: (isActive) => ({
    fontSize: '0.65rem',
    fontWeight: isActive ? 800 : 500,
    color: isActive ? '#111827' : '#9CA3AF',
  }),
  moreBackdrop: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  moreSheet: {
    background: 'var(--bg-card)',
    borderTopLeftRadius: '24px',
    borderTopRightRadius: '24px',
    padding: '24px 20px 40px 20px',
    maxWidth: '600px',
    margin: '0 auto',
    width: '100%',
    boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
  },
  moreSheetHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  closeBtn: {
    background: 'var(--bg-main)',
    border: 'none',
    width: '32px', height: '32px',
    borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.2rem',
    color: 'var(--text-muted)',
    cursor: 'pointer',
  },
  moreProfileCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    background: 'var(--bg-main)',
    borderRadius: '16px',
    marginBottom: '24px',
  },
  moreAvatar: {
    width: '56px', height: '56px',
    borderRadius: '50%',
    background: 'var(--bg-card)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.8rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  moreMenuList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '32px',
  },
  moreMenuItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 12px',
    background: 'var(--bg-main)',
    borderRadius: '12px',
    border: 'none',
    borderBottom: '2px solid var(--border-light)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  moreMenuIconWrapper: {
    width: '36px', height: '36px',
    borderRadius: '10px',
    background: 'white',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginRight: '12px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
  },
  moreMenuText: {
    flex: 1,
    textAlign: 'left',
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--text-main)',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    padding: '16px',
    background: '#FEF2F2',
    color: '#EF4444',
    border: 'none',
    borderRadius: '16px',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
  },
  contactModal: {
    background: 'var(--bg-card)',
    borderRadius: '24px',
    padding: '24px',
    width: '90%',
    maxWidth: '400px',
    margin: 'auto',
    boxShadow: 'var(--shadow-lg)',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    background: 'var(--bg-main)',
    borderRadius: '16px',
  },
  contactIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'var(--shadow-sm)',
  },
  contactLabel: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    fontWeight: 600,
    marginBottom: '2px',
  },
  contactValue: {
    fontSize: '1rem',
    fontWeight: 700,
    color: 'var(--text-main)',
    lineHeight: '1.4',
  },
  contactCloseBtn: {
    width: '100%',
    padding: '14px',
    background: 'var(--primary)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1.05rem',
    fontWeight: 700,
    marginTop: '24px',
    cursor: 'pointer',
  }
};
