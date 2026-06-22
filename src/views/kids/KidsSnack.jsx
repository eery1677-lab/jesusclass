import React, { useState } from 'react';
import { Utensils, Heart, ThumbsUp, ChevronLeft, Send } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function KidsSnack({ setActiveTab }) {
  const { currentUser, students, snacks, addSnackRequest } = useStore();
  const student = students.find(s => s.id === currentUser.id);
  const [sponsorMsg, setSponsorMsg] = useState('');
  const [hasApplied, setHasApplied] = useState(false);

  const handleSponsorSubmit = (e) => {
    e.preventDefault();
    if (sponsorMsg.trim()) {
      addSnackRequest(currentUser.id, student?.name || currentUser.name, sponsorMsg);
      setHasApplied(true);
      setSponsorMsg('');
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <button style={styles.backBtn} onClick={() => setActiveTab('kids-dashboard')}>
            <ChevronLeft size={24} />
          </button>
          <div style={styles.iconWrapper} className="squircle">
            <Utensils size={24} color="#F43F5E" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>주간 간식 안내</h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>맛있는 간식을 제공해주셔서 감사합니다.</p>
          </div>
        </div>
      </header>

      {student?.allergy?.length > 0 && (
        <div style={styles.allergyAlert} className="hover-glow-gray">
          <div style={styles.allergyTitle}>⚠️ 알레르기 주의</div>
          <div style={styles.allergyText}>
            등록된 알레르기: <strong>{student.allergy.join(', ')}</strong><br/>
            선생님들께서 항상 주의해서 간식을 준비하고 계십니다!
          </div>
        </div>
      )}

      <div style={styles.list}>
        {snacks.map((item, idx) => (
          <div key={idx} style={{...styles.card, ...(item.isCurrent ? {border: '2px solid #F43F5E'} : {})}} className="card-solid hover-lift">
            {item.isCurrent && <div style={styles.currentBadge}>이번 주 간식</div>}
            
            <div style={styles.cardHeader}>
              <div style={styles.weekBadge}>{item.week}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.date}</div>
            </div>
            
            <div style={styles.menuArea}>
              <div style={styles.emojiCircle}>{item.emoji}</div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>{item.menu}</h3>
            </div>
            
            <div style={styles.sponsorArea}>
              <Heart size={14} color="var(--accent-error)" />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>섬겨주신 분: <strong>{item.sponsor}</strong></span>
              {item.isCurrent && (
                <button style={styles.thanksBtn}>
                  <ThumbsUp size={14} /> 감사해요!
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={styles.sponsorFormSection} className="card-solid hover-lift">
        <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 700 }}>간식 후원 신청하기</h3>
        {hasApplied ? (
          <div style={styles.appliedMsg}>
            <Heart size={20} color="white" />
            <span>신청이 완료되었습니다. 귀한 섬김에 감사드립니다!</span>
          </div>
        ) : (
          <form style={styles.sponsorForm} onSubmit={handleSponsorSubmit}>
            <input 
              type="text" 
              placeholder="예: 7월 1주차 간식을 섬기고 싶습니다." 
              className="neon-input"
              style={{
                ...styles.sponsorInput,
                transition: 'var(--transition-smooth)'
              }}
              value={sponsorMsg}
              onChange={e => setSponsorMsg(e.target.value)}
            />
            <button 
              type="submit" 
              style={styles.sponsorSubmitBtn(!!sponsorMsg.trim())}
              disabled={!sponsorMsg.trim()}
            >
              <Send size={16} />
            </button>
          </form>
        )}
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
    background: '#FFE4E6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  allergyAlert: {
    background: 'rgba(244, 63, 94, 0.05)',
    border: '1px solid #F43F5E',
    borderLeft: '4px solid #F43F5E',
    boxShadow: 'var(--shadow-sm)',
    padding: '16px',
    borderRadius: 'var(--radius-md)',
    marginBottom: '24px',
  },
  allergyTitle: {
    color: '#F43F5E',
    fontWeight: 800,
    fontSize: '0.95rem',
    marginBottom: '4px',
  },
  allergyText: {
    fontSize: '0.85rem',
    color: 'var(--text-main)',
    lineHeight: '1.5',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  card: {
    padding: '16px',
    position: 'relative',
  },
  currentBadge: {
    position: 'absolute',
    top: '-10px',
    right: '20px',
    background: '#F43F5E',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 800,
    boxShadow: '0 4px 6px -1px rgba(244, 63, 94, 0.3)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '16px',
  },
  weekBadge: {
    background: 'var(--bg-main)',
    padding: '4px 10px',
    borderRadius: '8px',
    fontSize: '0.8rem',
    fontWeight: 700,
    color: 'var(--text-main)',
  },
  menuArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '20px',
  },
  emojiCircle: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: '#F3F4F6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
  },
  sponsorArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    paddingTop: '16px',
    borderTop: '1px dashed var(--border-color)',
    position: 'relative',
  },
  thanksBtn: {
    position: 'absolute',
    right: 0,
    background: 'rgba(244, 63, 94, 0.1)',
    color: '#F43F5E',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer',
  },
  sponsorFormSection: {
    marginTop: '32px',
    padding: '16px',
  },
  sponsorForm: {
    display: 'flex',
    gap: '8px',
  },
  sponsorInput: {
    flex: 1,
    background: 'var(--bg-main)',
    border: '1px solid var(--border-input)',
    borderRadius: '20px',
    padding: '12px 16px',
    fontSize: '0.95rem',
    outline: 'none',
  },
  sponsorSubmitBtn: (isActive) => ({
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: isActive ? 'var(--primary)' : 'rgba(16, 185, 129, 0.15)',
    color: isActive ? 'white' : 'rgba(16, 185, 129, 0.6)',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: isActive ? 'pointer' : 'default',
    transition: 'all 0.2s ease',
  }),
  appliedMsg: {
    background: 'var(--primary)',
    color: 'white',
    padding: '16px',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontWeight: 600,
    fontSize: '0.95rem',
  }
};
