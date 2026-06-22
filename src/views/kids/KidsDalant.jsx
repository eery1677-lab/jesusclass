import React, { useState, useEffect } from 'react';
import { Coins, TrendingUp, History, Gift, ChevronLeft } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function KidsDalant({ setActiveTab }) {
  const { currentUser, students } = useStore();
  const student = students.find(s => s.id === currentUser.id);
  const [displayDalant, setDisplayDalant] = useState(0);

  useEffect(() => {
    if (student) {
      let start = 0;
      const end = student.dalant;
      if (start === end) {
        setDisplayDalant(end);
        return;
      }
      const duration = 1000;
      const incrementTime = Math.abs(Math.floor(duration / end));
      
      const timer = setInterval(() => {
        start += 1;
        setDisplayDalant(start);
        if (start === end) clearInterval(timer);
      }, incrementTime);

      return () => clearInterval(timer);
    }
  }, [student?.dalant]);

  if (!student) return null;

  // 가상의 달란트 획득 내역
  const dalantHistory = [
    { id: 1, date: '2026-06-20', title: '출석 완료', amount: '+1', type: 'earn' },
    { id: 2, date: '2026-06-20', title: '요절 암송 미션 완료', amount: '+2', type: 'earn' },
    { id: 3, date: '2026-06-13', title: '출석 완료', amount: '+1', type: 'earn' },
    { id: 4, date: '2026-06-13', title: '헌금 제출', amount: '+1', type: 'earn' },
    { id: 5, date: '2026-05-30', title: '달란트 시장 아이스크림 구매', amount: '-5', type: 'spend' },
  ];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <button style={styles.backBtn} onClick={() => setActiveTab('kids-dashboard')}>
            <ChevronLeft size={24} />
          </button>
          <div style={styles.iconWrapper} className="squircle">
            <Coins size={24} color="#F59E0B" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>내 달란트 조회</h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>차곡차곡 모아서 달란트 시장에서 써요!</p>
          </div>
        </div>
      </header>

      <div style={styles.totalCard} className="card-solid hover-lift">
        <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '8px' }}>
          사용 가능한 달란트
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
          <h1 style={{ margin: 0, fontSize: '3.5rem', fontWeight: 800, color: 'white', lineHeight: '1' }}>{displayDalant}</h1>
          <span style={{ fontSize: '1.2rem', color: 'white', paddingBottom: '6px', fontWeight: 700 }}>달란트</span>
        </div>
      </div>

      <div style={styles.section} className="card-solid hover-lift">
        <div style={styles.sectionTitle}>
          <History size={18} color="var(--primary)" /> 
          <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>획득 / 사용 내역</h3>
        </div>
        
        <div style={styles.historyList}>
          {dalantHistory.map(item => (
            <div key={item.id} style={styles.historyItem}>
              <div style={styles.historyIcon(item.type)}>
                {item.type === 'earn' ? <TrendingUp size={16} color="var(--accent-success)" /> : <Gift size={16} color="var(--accent-error)" />}
              </div>
              <div style={styles.historyContent}>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.date}</div>
              </div>
              <div style={{ 
                fontWeight: 800, 
                fontSize: '1.1rem',
                color: item.type === 'earn' ? 'var(--accent-success)' : 'var(--accent-error)' 
              }}>
                {item.amount}
              </div>
            </div>
          ))}
        </div>
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
    background: '#FEF3C7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalCard: {
    background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    borderRadius: 'var(--radius-lg)',
    padding: '30px',
    marginBottom: '30px',
    color: 'white',
    boxShadow: '0 10px 15px -3px rgba(245, 158, 11, 0.3)',
  },
  section: {
    padding: '16px',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid var(--border-color)',
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  historyItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  historyIcon: (type) => ({
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: type === 'earn' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  historyContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  }
};
