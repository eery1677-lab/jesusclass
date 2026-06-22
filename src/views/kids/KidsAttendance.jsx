import React from 'react';
import { CheckCircle, Calendar as CalendarIcon, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function KidsAttendance({ setActiveTab }) {
  const { currentUser, students } = useStore();
  const student = students.find(s => s.id === currentUser.id);

  if (!student) return null;

  // 임시 데이터: 이번 달 출결 (데모용)
  const currentMonth = 6;
  const daysInMonth = 30;
  const attendedDays = [2, 9, 16]; // 주일 출석한 날짜들

  const renderCalendar = () => {
    let days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const isSunday = (i + 0) % 7 === 0; // 임시 계산 (6월 기준)
      const isAttended = attendedDays.includes(i);
      
      days.push(
        <div 
          key={i} 
          style={{
            ...styles.dayCell,
            color: isSunday ? 'var(--accent-error)' : 'var(--text-main)',
            fontWeight: isSunday ? 700 : 500,
            background: isAttended ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-card)',
            border: isAttended ? '2px solid var(--accent-success)' : '1px solid var(--border-color)',
          }}
        >
          {i}
          {isAttended && <CheckCircle size={10} color="var(--accent-success)" style={{ marginTop: '2px' }} />}
        </div>
      );
    }
    return days;
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <button style={styles.backBtn} onClick={() => setActiveTab('kids-dashboard')}>
            <ChevronLeft size={24} />
          </button>
          <div style={styles.iconWrapper} className="squircle">
            <CheckCircle size={24} color="#7B3DFF" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>나의 출결체크</h2>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>빠짐없이 예배드려요!</p>
          </div>
        </div>
        <div style={styles.statsBadge}>
          <Award size={16} /> 누적 {student.attendanceCount}회
        </div>
      </header>

      <div style={styles.card} className="card-solid hover-lift">
        <div style={styles.monthHeader}>
          <button style={styles.navBtn}><ChevronLeft size={20} /></button>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>2026년 {currentMonth}월</h3>
          <button style={styles.navBtn}><ChevronRight size={20} /></button>
        </div>

        <div style={styles.weekDays}>
          {['일', '월', '화', '수', '목', '금', '토'].map(day => (
            <div key={day} style={{...styles.weekDay, color: day === '일' ? 'var(--accent-error)' : 'var(--text-muted)'}}>{day}</div>
          ))}
        </div>

        <div style={styles.calendarGrid}>
          {/* 빈 칸 처리 (6월 1일이 월요일이라 가정) */}
          <div style={styles.emptyCell}></div>
          {renderCalendar()}
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
    marginBottom: '20px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
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
    width: '40px',
    height: '40px',
    background: '#F3E8FF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    background: 'var(--primary)',
    color: 'white',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 700,
  },
  card: {
    padding: '16px',
  },
  monthHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  navBtn: {
    background: 'var(--bg-main)',
    border: 'none',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'var(--text-main)',
  },
  weekDays: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    textAlign: 'center',
    marginBottom: '10px',
  },
  weekDay: {
    fontSize: '0.85rem',
    fontWeight: 700,
  },
  calendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '4px',
  },
  dayCell: {
    aspectRatio: '1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    fontSize: '0.8rem',
  },
  emptyCell: {
    aspectRatio: '1',
  }
};
