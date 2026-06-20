import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, ChevronLeft, Send, MessageSquare } from 'lucide-react';

export default function KidsSchedule({ setActiveTab }) {
  const [memoText, setMemoText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleMemoSubmit = (e) => {
    e.preventDefault();
    if (memoText.trim()) {
      setSubmitted(true);
      setMemoText('');
    }
  };
  const schedule = [
    { time: '09:00', title: '주일학교 찬양 및 예배', location: '소예배실', icon: Users, color: '#10B981', bg: '#D1FAE5' },
    { time: '10:00', title: '반별 공과 공부', location: '각 반 교실', icon: Calendar, color: '#3B82F6', bg: '#DBEAFE' },
    { time: '10:40', title: '간식 및 친교 시간', location: '친교실', icon: Clock, color: '#F59E0B', bg: '#FEF3C7' },
    { time: '11:00', title: '오후 활동 (체육/미술)', location: '야외 및 체육관', icon: MapPin, color: '#10B981', bg: '#D1FAE5' },
    { time: '12:00', title: '귀가', location: '본당 앞', icon: Users, color: '#6B7280', bg: '#F3F4F6' },
  ];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <button style={styles.backBtn} onClick={() => setActiveTab('kids-dashboard')}>
            <ChevronLeft size={24} />
          </button>
          <div style={styles.iconWrapper} className="squircle">
            <Calendar size={24} color="#0EA5E9" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>주일학교 일정</h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>이번 주일 일정표입니다.</p>
          </div>
        </div>
      </header>

      <div style={styles.timelineCard}>
        <div style={styles.timeline}>
          {schedule.map((item, idx) => {
            const Icon = item.icon;
            const isLast = idx === schedule.length - 1;
            return (
              <div key={idx} style={styles.timelineItem}>
                <div style={styles.timeColumn}>
                  <div style={styles.timeText}>{item.time}</div>
                </div>
                
                <div style={styles.lineColumn}>
                  <div style={{...styles.iconDot, background: item.bg, color: item.color}}>
                    <Icon size={14} />
                  </div>
                  {!isLast && <div style={styles.line}></div>}
                </div>
                
                <div style={styles.contentColumn}>
                  <div style={styles.contentCard} className="hover-lift">
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 700 }}>{item.title}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <MapPin size={12} /> {item.location}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={styles.memoFormSection}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 700 }}>일정 관련 문의/메모</h3>
        {submitted ? (
          <div style={styles.submittedMsg}>
            <MessageSquare size={20} color="white" />
            <span>선생님께 메시지가 전달되었습니다.</span>
          </div>
        ) : (
          <form style={styles.memoForm} onSubmit={handleMemoSubmit}>
            <input 
              type="text" 
              placeholder="궁금한 점이나 남길 메모를 적어주세요." 
              style={styles.memoInput}
              value={memoText}
              onChange={e => setMemoText(e.target.value)}
            />
            <button 
              type="submit" 
              style={styles.memoSubmitBtn(!!memoText.trim())}
              disabled={!memoText.trim()}
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
    background: '#E0F2FE',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineCard: {
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius-lg)',
    padding: '16px',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--border-color)',
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
  },
  timelineItem: {
    display: 'flex',
    minHeight: '80px',
  },
  timeColumn: {
    width: '60px',
    flexShrink: 0,
    textAlign: 'right',
    paddingRight: '16px',
    paddingTop: '6px',
  },
  timeText: {
    fontSize: '0.9rem',
    fontWeight: 700,
    color: 'var(--text-main)',
  },
  lineColumn: {
    width: '30px',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  iconDot: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    border: '2px solid var(--bg-card)',
  },
  line: {
    flex: 1,
    width: '2px',
    background: 'var(--border-color)',
    marginTop: '-4px',
    marginBottom: '-4px',
    zIndex: 1,
  },
  contentColumn: {
    flex: 1,
    minWidth: 0,
    paddingLeft: '16px',
    paddingBottom: '24px',
  },
  contentCard: {
    background: 'var(--bg-main)',
    border: '1px solid var(--border-color)',
    padding: '16px',
    borderRadius: 'var(--radius-md)',
  },
  memoFormSection: {
    marginTop: '32px',
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius-lg)',
    padding: '16px',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--border-color)',
  },
  memoForm: {
    display: 'flex',
    gap: '8px',
  },
  memoInput: {
    flex: 1,
    background: 'var(--bg-main)',
    border: '1px solid var(--border-input)',
    borderRadius: '20px',
    padding: '12px 16px',
    fontSize: '0.95rem',
    outline: 'none',
  },
  memoSubmitBtn: (isActive) => ({
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: isActive ? 'var(--primary)' : 'var(--bg-main)',
    border: isActive ? 'none' : '1px solid var(--border-input)',
    color: isActive ? 'white' : 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: isActive ? 'pointer' : 'default',
    transition: 'all 0.2s',
  }),
  submittedMsg: {
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
