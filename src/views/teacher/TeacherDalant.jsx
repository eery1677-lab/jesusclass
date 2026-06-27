import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { TrendingUp, Coins, Plus, Minus, Search, Award, ArrowLeft } from 'lucide-react';

export default function TeacherDalant({ setActiveTab }) {
  const { students, adjustDalant } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [isAdding, setIsAdding] = useState(true);

  // 이름 또는 달란트 순 정렬 (임시로 이름순)
  const filteredStudents = students
    .filter(s => s.name.includes(searchTerm))
    .sort((a, b) => b.dalant - a.dalant);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedStudent || !amount || isNaN(amount) || amount <= 0) return;

    const value = isAdding ? parseInt(amount) : -parseInt(amount);
    adjustDalant(selectedStudent.id, value, reason || (isAdding ? '선생님 특별 달란트' : '달란트 사용'));
    
    // 폼 초기화
    setSelectedStudent(null);
    setAmount('');
    setReason('');
    alert('달란트가 정상적으로 반영되었습니다.');
  };

  return (
    <div style={styles.container}>
      <section style={styles.headerPanel} className="card-solid hover-lift">
        <button 
          className="home-back-btn animate-pulse-border"
          onClick={() => setActiveTab('teacher-dashboard')} 
          style={styles.backBtn}
        >
          <ArrowLeft size={20} color="var(--primary)" />
        </button>
        <TrendingUp size={24} style={{ color: '#F59E0B' }} />
        <div>
          <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#F59E0B' }}>💰 달란트 관리 및 수동 지급</h2>
          <p style={{ margin: 0, marginTop: '4px', color: 'var(--text-muted)', fontSize: '0.9rem', wordBreak: 'keep-all', lineHeight: '1.4' }}>
            우리 반 학생들의 달란트 현황을 확인하고 특별 보상이나 차감을 진행하세요.
          </p>
        </div>
      </section>

      {/* 달란트 부여/차감 폼 */}
      <section style={styles.formSection} className="card-solid hover-lift">
        <h3 style={styles.sectionTitle}>
          <Coins size={18} color="#F59E0B" />
          <span>달란트 증감 처리</span>
        </h3>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="form-group">
            <label className="form-label">대상 학생 선택</label>
            <div style={styles.studentSelectGrid}>
              {filteredStudents.map(student => (
                <div 
                  key={student.id} 
                  className={selectedStudent?.id === student.id ? 'selected-student-card' : ''}
                  style={{
                    ...styles.studentSelectItem, 
                    borderColor: selectedStudent?.id === student.id ? 'var(--primary)' : 'var(--border-light)',
                    background: selectedStudent?.id === student.id ? '#F0FDF4' : 'var(--bg-app)'
                  }}
                  onClick={() => setSelectedStudent(student)}
                >
                  <div style={{...styles.avatarMini, overflow: 'hidden'}}>
                    {student.imageUrl ? (
                      <img src={student.imageUrl} alt="student" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                    ) : (
                      student.avatar || '👦'
                    )}
                  </div>
                  <span style={styles.studentName}>{student.name}</span>
                </div>
              ))}
            </div>
          </div>

            <div className="form-group">
              <label className="form-label">증감 종류</label>
              <div style={styles.typeToggle}>
                <button 
                  type="button"
                  style={{...styles.toggleBtn, background: isAdding ? '#10B981' : 'transparent', color: isAdding ? 'white' : 'var(--text-muted)'}}
                  onClick={() => setIsAdding(true)}
                >
                  <Plus size={16} /> 지급(+)
                </button>
                <button 
                  type="button"
                  style={{...styles.toggleBtn, background: !isAdding ? '#EF4444' : 'transparent', color: !isAdding ? 'white' : 'var(--text-muted)'}}
                  onClick={() => setIsAdding(false)}
                >
                  <Minus size={16} /> 차감(-)
                </button>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">달란트 금액</label>
              <input 
                type="number" 
                className="form-input" 
                placeholder="예: 5" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                required
              />
            </div>

          <div className="form-group">
            <label className="form-label">사유 (선택)</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="예: 성경 퀴즈 정답, 간식 교환 등" 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="btn" 
            style={{ 
              width: '100%', 
              marginTop: '8px', 
              background: isAdding ? 'var(--primary)' : '#EF4444',
              color: 'white'
            }} 
            disabled={!selectedStudent}
          >
            {isAdding ? '달란트 지급하기' : '달란트 차감하기'}
          </button>
        </form>
      </section>

      {/* 달란트 현황판 */}
      <section style={styles.rankingSection}>
        <div style={styles.rankingHeader}>
          <h3 style={styles.sectionTitle}><Award size={18} color="#8B5CF6" /> 전체 랭킹 및 현황</h3>
          <div style={styles.searchBox}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px' }} />
            <input 
              type="text" 
              placeholder="이름 검색..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '36px', width: '140px', background: 'white' }}
            />
          </div>
        </div>

        <div style={styles.rankingList}>
          {filteredStudents.map((student, index) => (
            <div key={student.id} style={styles.rankingCard} className="card-solid hover-lift">
              <div style={styles.rankingLeft}>
                <div style={styles.rankBadge(index)}>{index + 1}</div>
                <div style={{...styles.avatarMini, overflow: 'hidden'}}>
                  {student.imageUrl ? (
                    <img src={student.imageUrl} alt="student" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                  ) : (
                    student.avatar || '👦'
                  )}
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{student.name}</div>
              </div>
              <div style={styles.dalantBadge}>
                <Coins size={16} />
                {student.dalant} D
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    paddingBottom: '80px',
  },
  headerPanel: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '20px',
    background: 'linear-gradient(135deg, #FFFBEB 0%, #ffffff 100%)',
    borderLeft: '4px solid #F59E0B',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '1.1rem',
    fontWeight: 700,
    margin: '0 0 16px 0',
  },
  formSection: {
    padding: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  studentSelectGrid: {
    display: 'flex',
    gap: '12px',
    overflowX: 'auto',
    paddingBottom: '8px',
    scrollbarWidth: 'none', // Firefox
  },
  studentSelectItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '12px',
    border: '2px solid var(--border-light)',
    borderRadius: '16px',
    minWidth: '80px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  avatarMini: {
    width: '46px',
    height: '46px',
    borderRadius: '50%',
    background: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.6rem',
    boxShadow: 'var(--shadow-sm)',
  },
  studentName: {
    fontWeight: 600,
    fontSize: '0.85rem',
  },

  typeToggle: {
    display: 'flex',
    background: 'var(--bg-app)',
    borderRadius: '24px', // pill shape
    padding: '4px',
    height: '46px', // match input height
  },
  toggleBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    border: 'none',
    borderRadius: '20px', // inner pill shape
    fontWeight: 700,
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  },
  rankingSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  rankingHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
  },
  rankingList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  rankingCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
  },
  rankingLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  rankBadge: (index) => ({
    width: '24px',
    height: '24px',
    borderRadius: '6px',
    background: index === 0 ? '#F59E0B' : index === 1 ? '#9CA3AF' : index === 2 ? '#B45309' : 'var(--bg-app)',
    color: index < 3 ? 'white' : 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: '0.85rem',
  }),
  dalantBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: '#FEF3C7',
    color: '#D97706',
    padding: '6px 12px',
    borderRadius: '20px',
    fontWeight: 800,
    fontSize: '0.95rem',
  },
  backBtn: {
    background: 'white', 
    border: '2px solid var(--primary)', 
    borderRadius: '50%',
    cursor: 'pointer', 
    width: '40px',
    height: '40px',
    display: 'flex', 
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '8px',
  }
};
