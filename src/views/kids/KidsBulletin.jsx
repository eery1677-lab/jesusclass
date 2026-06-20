import { FileText, Download, Share2, Book, ChevronLeft, Music, Mic, BookOpen, User, Coins, MessageCircle, Heart, Bell } from 'lucide-react';

export default function KidsBulletin({ setActiveTab }) {
  const currentBulletin = {
    title: '유초등부 주일 주보',
    date: '2026년 6월 20일',
    vol: '제 2026-25호',
    worshipInfo: [
      { order: '찬양', leader: '찬양팀', icon: Music },
      { order: '기도', leader: '이하늘 어린이', icon: Mic },
      { order: '말씀봉독', leader: '다같이 (시편 23:1~6)', icon: BookOpen },
      { order: '말씀', leader: '김요한 전도사님', icon: User },
      { order: '헌금', leader: '다같이', icon: Coins },
      { order: '주기도문', leader: '다같이', icon: MessageCircle }
    ],
    announcements: [
      '다음 주일은 야외 예배로 드립니다. (장소: 시민공원)',
      '여름 성경학교 등록이 시작되었습니다. (7월 20일~22일)',
      '성경 읽기표를 다 채운 친구들은 선생님께 제출해 주세요.'
    ],
    newFriends: ['김민준 (3학년)', '박서연 (1학년)']
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <button style={styles.backBtn} onClick={() => setActiveTab('kids-dashboard')}>
            <ChevronLeft size={24} />
          </button>
          <div style={styles.iconWrapper} className="squircle">
            <FileText size={24} color="#6B7280" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>모바일 주보</h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>스마트폰으로 보는 주보</p>
          </div>
        </div>
      </header>

      <div style={styles.bulletinPaper} className="card-solid">
        <div style={styles.paperHeader}>
          <div>
            <div style={styles.volText}>{currentBulletin.vol}</div>
            <h1 style={styles.mainTitle}>{currentBulletin.title}</h1>
            <div style={styles.dateText}>{currentBulletin.date}</div>
          </div>
          <Book size={40} color="rgba(0,0,0,0.1)" />
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitleWrapper}>
            <div style={styles.sectionIcon}><Heart size={16} color="#EC4899" /></div>
            <h3 style={styles.sectionTitle}>예배 순서</h3>
          </div>
          <div style={styles.orderList}>
            {currentBulletin.worshipInfo.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} style={styles.orderItem}>
                  <div style={styles.orderLeft}>
                    <div style={styles.orderItemIcon}><Icon size={14} color="#6B7280" /></div>
                    <span style={styles.tdOrder}>{item.order}</span>
                  </div>
                  <div style={styles.tdLeader}>{item.leader}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitleWrapper}>
            <div style={styles.sectionIcon}><Bell size={16} color="#3B82F6" /></div>
            <h3 style={styles.sectionTitle}>교회 소식</h3>
          </div>
          <div style={styles.announcementList}>
            {currentBulletin.announcements.map((text, idx) => (
              <div key={idx} style={styles.announcementItem}>
                <div style={styles.bulletPoint}></div>
                <div style={styles.li}>{text}</div>
              </div>
            ))}
          </div>
        </div>

        {currentBulletin.newFriends.length > 0 && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>새 친구를 환영해요 🎉</h3>
            <div style={styles.newFriendsBox}>
              {currentBulletin.newFriends.join(', ')}
            </div>
          </div>
        )}
      </div>

      <div style={styles.actionButtons}>
        <button className="btn" style={styles.actionBtn}>
          <Download size={18} /> 주보 다운로드 (PDF)
        </button>
        <button className="btn" style={styles.actionBtn}>
          <Share2 size={18} /> 공유하기
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
    animation: 'fadeUp 0.4s ease-out forwards',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  backBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-main)',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    width: '48px',
    height: '48px',
    background: '#F3F4F6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bulletinPaper: {
    background: '#FFFdf9',
    borderRadius: 'var(--radius-lg)',
    padding: '30px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    border: '1px solid #e5e7eb',
    color: '#1f2937',
    marginBottom: '24px',
  },
  paperHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: '2px solid #1f2937',
    paddingBottom: '20px',
    marginBottom: '24px',
  },
  volText: {
    fontSize: '0.85rem',
    color: '#6b7280',
    marginBottom: '4px',
  },
  mainTitle: {
    margin: '0 0 8px 0',
    fontSize: '1.8rem',
    fontWeight: 900,
    color: '#111827',
  },
  dateText: {
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#4b5563',
  },
  section: {
    marginBottom: '32px',
  },
  sectionTitleWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
  },
  sectionIcon: {
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    background: '#F3F4F6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '1.2rem',
    fontWeight: 800,
    color: '#111827',
  },
  orderList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  orderItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    background: '#F9FAFB',
    borderRadius: '12px',
    border: '1px solid #F3F4F6',
  },
  orderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  orderItemIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: 'white',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  tdOrder: {
    fontWeight: 700,
    color: '#374151',
    fontSize: '0.95rem',
  },
  tdLeader: {
    color: '#6B7280',
    fontSize: '0.9rem',
    fontWeight: 500,
  },
  announcementList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  announcementItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    background: '#F9FAFB',
    padding: '16px',
    borderRadius: '12px',
  },
  bulletPoint: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#3B82F6',
    marginTop: '8px',
    flexShrink: 0,
  },
  li: {
    color: '#4B5563',
    lineHeight: '1.6',
    fontSize: '0.95rem',
  },
  newFriendsBox: {
    background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
    padding: '16px',
    borderRadius: '16px',
    fontWeight: 700,
    color: '#92400E',
    textAlign: 'center',
    boxShadow: '0 4px 10px rgba(253, 230, 138, 0.3)',
  },
  actionButtons: {
    display: 'flex',
    gap: '12px',
  },
  actionBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    background: 'white',
    color: 'var(--text-main)',
    border: '1px solid var(--border-color)',
    padding: '14px',
    borderRadius: '12px',
    fontWeight: 600,
    fontSize: '0.95rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
  }
};
