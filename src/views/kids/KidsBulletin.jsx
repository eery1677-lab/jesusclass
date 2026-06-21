import { useStore } from '../../store/useStore';
import { FileText, Download, Share2, Book, ChevronLeft, Music, Mic, BookOpen, User, Coins, MessageCircle, Heart, Bell } from 'lucide-react';

export default function KidsBulletin({ setActiveTab }) {
  const { bulletins } = useStore();
  const currentBulletin = bulletins.length > 0 ? bulletins[0] : null;

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

      {currentBulletin ? (
        <div style={styles.bulletinPaper} className="card-solid">
          <div style={styles.paperHeader}>
            <div>
              <div style={styles.volText}>최신 발행 주보</div>
              <h1 style={styles.mainTitle}>{currentBulletin.title}</h1>
              <div style={styles.dateText}>{currentBulletin.createdAt}</div>
            </div>
            <Book size={40} color="rgba(0,0,0,0.1)" />
          </div>

          {currentBulletin.imageUrl && (
            <div style={styles.section}>
              <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                <img src={currentBulletin.imageUrl} alt="주보 이미지" style={{ width: '100%', display: 'block' }} />
              </div>
            </div>
          )}

          {currentBulletin.content && (
            <div style={styles.section}>
              <div style={styles.sectionTitleWrapper}>
                <div style={styles.sectionIcon}><Bell size={16} color="#3B82F6" /></div>
                <h3 style={styles.sectionTitle}>예배 순서 및 광고</h3>
              </div>
              <div style={{...styles.announcementItem, whiteSpace: 'pre-wrap'}}>
                <div style={styles.li}>{currentBulletin.content}</div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={styles.bulletinPaper} className="card-solid">
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            아직 이번 주 주보가 등록되지 않았습니다. 🙏
          </div>
        </div>
      )}

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
